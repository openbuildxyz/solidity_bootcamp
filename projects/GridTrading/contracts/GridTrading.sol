// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./library/TransferHelper.sol";

import "./interfaces/IWETH.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IGridTrading.sol";

import "./AutomationCompatible.sol";

contract GridTrading is IGridTrading {
    // using SafeMath for uint256;

    address public owner;
    address public constant WETH = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9; // sepolia testnet
    address public constant LINK = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // sepolia testnet
    address public constant UniswapV2Router =
        0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // sepolia testnet

    mapping(address => mapping(address => bool)) public pairOf;

    address public upkeep;

    uint256 public fee = 2000; // 2000 /10**6

    
    struct Order {
        address tokenA;
        address tokenB;
        uint256 dealAmount; // base on tokenB
        uint256 priceRatio; // 120(%)，
        uint256 slippage; //  1 (/ 1000)
        uint256 amountA; //
        uint256 amountB; //
        uint256[] priceListX64; // x2**64
    }
    uint256 public nonce; 
    mapping(uint256 => Order) orderOf; 

    constructor() {
        owner = msg.sender;
        upkeep = address(new AutomationCompatible(address(this)));

        _addPair(WETH, LINK);
    }

    function addPair(address _tokenA, address _tokenB) public {
        require(msg.sender == owner, "Only owner");
        _addPair(_tokenA, _tokenB);
    }

    function _addPair(address _tokenA, address _tokenB) internal {
        pairOf[_tokenA][_tokenB] = true;
        pairOf[_tokenB][_tokenA] = true;
        // approve to Router
        TransferHelper.safeApprove(_tokenA, UniswapV2Router, type(uint256).max);
        TransferHelper.safeApprove(_tokenB, UniswapV2Router, type(uint256).max);
    }

    function setUpkeep(address _new) public {
        require(msg.sender == owner, "Only owner");
        upkeep = _new;
    }

    // tokenA / WETH
    function depositETH(
        address tokenA,
        uint256 dealAmount, 
        uint256 priceRatio, 
        uint256 slippage 
    ) public payable {
        // check pair
        require(pairOf[tokenA][WETH] == true, "Invalid pair");

        // deposit to WETH
        require(dealAmount > 0 && msg.value >= dealAmount, "Invalid amount");
        IWETH(WETH).deposit{value: msg.value}();

        // approve to Router, done before initialization

        _deposit(
            tokenA,
            WETH, 
            dealAmount, // base on tokenB
            priceRatio, 
            slippage, 
            msg.value
        );
    }

    // tokenA / tokenB
    function deposit(
        address tokenA,
        address tokenB,
        uint256 dealAmount, 
        uint256 priceRatio, 
        uint256 slippage, 
        uint256 amount 
    ) public {
        // check pair
        require(pairOf[tokenA][tokenB] == true, "Invalid pair");

        // transfer token from msg.sender to this contract
        TransferHelper.safeTransferFrom(
            tokenB,
            msg.sender,
            address(this),
            amount
        );

        // approve to Router, done before initialization

        require(dealAmount > 0, "dealAmount should be more than zero");
        require(amount >= dealAmount, "amount insufficient");

        _deposit(
            tokenA,
            tokenB,
            dealAmount, 
            priceRatio, 
            slippage, 
            amount
        );
    }

    // tokenA / tokenB
    function _deposit(
        address tokenA,
        address tokenB,
        uint256 dealAmount, 
        uint256 priceRatio, 
        uint256 slippage, 
        uint256 amount 
    )
        internal
        returns (uint256[] memory amounts, uint256[] memory amountsSwap)
    {
        address[] memory path = new address[](2);
        path[0] = tokenB;
        path[1] = tokenA;

        amounts = IUniswapV2Router(UniswapV2Router).getAmountsOut(
            dealAmount,
            path
        );

        uint256 priceX64 = (amounts[0] * 2**64) / amounts[1]; // tokenA price

        // first swap tokenB to tokenA
        amountsSwap = IUniswapV2Router(UniswapV2Router)
            .swapExactTokensForTokens(
                amounts[0],
                amounts[1],
                path,
                address(this),
                block.timestamp + 3600
            );

        // save
        uint256[] memory priceListX64 = new uint256[](1);
        priceListX64[0] = priceX64;

        orderOf[++nonce] = Order(
            tokenA,
            tokenB,
            dealAmount, 
            priceRatio, 
            slippage, 
            amounts[1], 
            amount - amounts[0], 
            priceListX64 
        );
    }

    function checkUpkeep(uint256 _start, uint256 _end)
        external
        view
        returns (bool, bytes memory)
    {
        bytes memory performData;
        if (_end > nonce) _end = nonce;
        
        for (uint256 _nonce = _start; _nonce <= _end; _nonce++) {
            (
                address tokenA,
                address tokenB,
                uint256 dealAmount, 
                uint256 priceRatio, 
                ,
                ,
                uint256 amountB, 
                uint256[] memory priceListX64 
            ) = getOrderInfo(_nonce);

            uint256 priceX64_current;
            {
                address[] memory path = new address[](2);
                path[0] = tokenB;
                path[1] = tokenA;
                uint256[] memory amounts = IUniswapV2Router(UniswapV2Router)
                    .getAmountsOut(dealAmount, path);
                priceX64_current = (amounts[0] * 2**64) / amounts[1]; 
            }

            uint256 len = priceListX64.length;
            if (len == 0) continue;

            uint256 priceX64_latest = priceListX64[len - 1]; // get the latest price

            performData = abi.encode(
                _nonce,
                len,
                priceX64_latest,
                priceX64_current
            );

            // price increase
            if (priceX64_current >= (priceX64_latest * priceRatio) / 100)
                return (true, performData);

            // price decrease
            if (
                priceX64_current <= priceX64_latest / (priceRatio / 100) &&
                amountB >= dealAmount
            ) return (true, performData);
        }

        return (false, performData);
    }

    function performUpkeep(bytes calldata performData) external {
        // check sender
        require(upkeep == msg.sender, "Invalid upkeep");

        (
            uint256 _nonce,
            uint256 _len,
            uint256 priceX64_latest,
            uint256 priceX64_current
        ) = abi.decode(performData, (uint256, uint256, uint256, uint256));
        if (priceX64_current > priceX64_latest) {
            _sell(_nonce, priceX64_latest);
            if (_len == 1) _buy(_nonce, priceX64_latest);
        } else {
            _buy(_nonce, priceX64_latest);
        }
    }

    function _buy(uint256 _nonce, uint256 priceX64_latest) internal {
        // get order infos
        (
            address tokenA,
            address tokenB,
            uint256 dealAmount, 
            uint256 priceRatio, 
            uint256 slippage, 
            ,
            uint256 amountB, 
            uint256[] memory priceListX64 
        ) = getOrderInfo(_nonce);

        // check
        require(amountB > 0 && amountB >= dealAmount, "Insufficient balance");
        if (priceListX64.length > 0)
            require(
                priceX64_latest == priceListX64[priceListX64.length - 1],
                "Invalid latest price input"
            );

        // get the current price and check
        uint256 priceX64_current;
        uint256[] memory amounts;
        address[] memory path = new address[](2);
        path[0] = tokenB;
        path[1] = tokenA;
        amounts = IUniswapV2Router(UniswapV2Router).getAmountsOut(
            dealAmount,
            path
        );
        priceX64_current = (amounts[0] * 2**64) / amounts[1]; // tokenA price

        if (priceListX64.length > 0) {
            uint256 _maxPrice = (((priceX64_latest * 100) / priceRatio) *
                1000) / (1000 - slippage);
            require(priceX64_current <= _maxPrice, "Price exceeds slippage");
        }

        // buy
        IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(
            amounts[0], // tokenB
            amounts[1], 
            path,
            address(this),
            block.timestamp + 3600
        );

        // reset
        _resetBuy(_nonce, amounts[1], amounts[0], priceX64_current);
    }

    function _sell(uint256 _nonce, uint256 priceX64_latest) internal {
        // get order infos
        (
            address tokenA,
            address tokenB,
            uint256 dealAmount, 
            uint256 priceRatio, 
            uint256 slippage, 
            ,
            ,
            uint256[] memory priceListX64 
        ) = getOrderInfo(_nonce);

        // check
        require(
            priceX64_latest == priceListX64[priceListX64.length - 1],
            "Invalid latest price input"
        );

        // get the sell amountA
        uint256 amountASell = (dealAmount * 2**64) / priceX64_latest;

        // get the current price and check
        uint256[] memory amounts;
        address[] memory path = new address[](2);

        uint256 priceX64_current;
        path[0] = tokenA;
        path[1] = tokenB;
        amounts = IUniswapV2Router(UniswapV2Router).getAmountsOut(
            amountASell,
            path
        );
        priceX64_current = (amounts[1] * 2**64) / amounts[0]; // tokenA price
        uint256 _minPrice = (((priceX64_latest * priceRatio) / 100) *
            (1000 - slippage)) / 1000;
        require(priceX64_current >= _minPrice, "Price exceeds slippage");
        // buy
        IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(
            amounts[0], // tokenA
            amounts[1], // 
            path,
            address(this),
            block.timestamp + 3600
        );

        // reset
        _resetSell(_nonce, amounts[0], amounts[1]);
    }

    function _resetBuy(
        uint256 _nonce,
        uint256 _amountA,
        uint256 _amountB,
        uint256 priceX64_current
    ) internal {
        orderOf[_nonce].amountA += _amountA;
        orderOf[_nonce].amountB -= _amountB;
        orderOf[_nonce].priceListX64.push(priceX64_current);
    }

    function _resetSell(
        uint256 _nonce,
        uint256 _amountA,
        uint256 _amountB
    ) internal {
        orderOf[_nonce].amountA -= _amountA;
        orderOf[_nonce].amountB += _amountB;
        orderOf[_nonce].priceListX64.pop();
    }

    function getOrderInfo(uint256 _nonce)
        public
        view
        returns (
            address tokenA,
            address tokenB,
            uint256 dealAmount, 
            uint256 priceRatio, 
            uint256 slippage, 
            uint256 amountA, 
            uint256 amountB, 
            uint256[] memory priceListX64 
        )
    {
        tokenA = orderOf[_nonce].tokenA;
        tokenB = orderOf[_nonce].tokenB;
        dealAmount = orderOf[_nonce].dealAmount; // base on tokenB
        priceRatio = orderOf[_nonce].priceRatio; 
        slippage = orderOf[_nonce].slippage;
        amountA = orderOf[_nonce].amountA; 
        amountB = orderOf[_nonce].amountB; 
        priceListX64 = orderOf[_nonce].priceListX64;
    }

    //******************test*********************
    //******************test*********************
    //******************test*********************

    function testSetOrder() public payable {
        // LINK / WETH
        depositETH(
            LINK,
            msg.value / 2, // base on tokenB
            120, 
            1 
        );

        // modify the price
        uint256 price = orderOf[nonce].priceListX64[0];
        orderOf[nonce].priceListX64[0] = price * 10;
    }

}
