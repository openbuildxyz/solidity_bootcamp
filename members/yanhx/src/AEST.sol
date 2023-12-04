/**
 * Submitted for verification at BscScan.com on 2022-12-06
 */

// Dependency file: @openzeppelin/contracts/token/ERC20/IERC20.sol

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity =0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./libs/SafeMath.sol";

contract AEST is ERC20, Ownable {
    // SafeMath is no longer needed starting with Solidity 0.8. The compiler now has built in overflow checking.
    using SafeMath for uint256;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair; //should be immutable
    address public usdtAddr; //should be immutable

    uint256 public constant MAX_SUPPLY = 81000000 * 10 ** 18; // better to write as 81_000_000 ether
    uint256 public constant LP_SUPPLY = 5000000 * 10 ** 18; //5_000_000 ether
    uint256 public constant OTHER_SUPPLY = 76000000 * 10 ** 18; //76_000_000 ether

    address public birdWallet; //should be immutable
    address public monkeyWallet; //should be immutable
    address public foundationWallet; //should be immutable
    address public technologyWallet; //should be immutable
    address public marketingWallet; //should be immutable

    uint256 public swapFeeTotal;
    uint256 public startTime;

    mapping(address => bool) public automatedMarketMakerPairs;

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    /**
     * Contract locking ether found:
     *     Contract AEST (src/AEST.sol#23-164) has payable functions:
     *      - AEST.constructor(string,string,address,address,address[5]) (src/AEST.sol#48-72)
     *      - AEST.receive() (src/AEST.sol#74)
     *      - AEST.addInitLiquidity(uint256) (src/AEST.sol#76-84)
     *     But does not have a function to withdraw the ether
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address router_,
        address usdtAddr_,
        address[5] memory wallets
    ) payable ERC20(name_, symbol_) {
        monkeyWallet = wallets[0];
        birdWallet = wallets[1];
        foundationWallet = wallets[2];
        technologyWallet = wallets[3];
        marketingWallet = wallets[4];

        usdtAddr = usdtAddr_; //lacks a zero-check

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(router_);

        address _uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory()).createPair(address(this), usdtAddr);
        uniswapV2Router = _uniswapV2Router;
        uniswapV2Pair = _uniswapV2Pair;
        _setAutomatedMarketMakerPair(_uniswapV2Pair, true);

        _mint(address(this), MAX_SUPPLY);
        _transfer(address(this), msg.sender, OTHER_SUPPLY);
    }

    receive() external payable {}

    function addInitLiquidity(uint256 amount) external payable onlyOwner {
        require(startTime == 0, "only once"); // can be replaced with a bool variable
        startTime = block.timestamp;

        _approve(address(this), address(uniswapV2Router), LP_SUPPLY);
        //ignores return value
        IERC20(usdtAddr).approve(address(uniswapV2Router), amount);

        //ignores return value
        uniswapV2Router.addLiquidity(address(this), usdtAddr, LP_SUPPLY, amount, 0, 0, address(0), block.timestamp);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function setAutomatedMarketMakerPair(address pair, bool value) public onlyOwner {
        require(pair != uniswapV2Pair, "The PancakeSwap pair cannot be removed from automatedMarketMakerPairs");

        _setAutomatedMarketMakerPair(pair, value);
    }

    function _setAutomatedMarketMakerPair(address pair, bool value) private {
        require(automatedMarketMakerPairs[pair] != value, "Automated market maker pair is already set to that value");
        automatedMarketMakerPairs[pair] = value;

        emit SetAutomatedMarketMakerPair(pair, value);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (from == address(this) && to == uniswapV2Pair) {
            super._transfer(from, to, amount);
        } else {
            if (automatedMarketMakerPairs[from]) {
                buyTokenAndFees(from, to, amount);
            } else if (automatedMarketMakerPairs[to]) {
                sellTokenAndFees(from, to, amount);
            } else {
                super._transfer(from, to, amount);
            }
        }
    }

    function sellTokenAndFees(address from, address to, uint256 amount) internal {
        uint256 burnAmount = amount.mul(3).div(100); //when amout < 33, burnAmount = 0, it is rounded down, should round up which is favoring the pool.
        uint256 otherAmount = amount.mul(1).div(100); //it is rounded down, should round up which is favoring the pool.

        amount = amount.sub(burnAmount);
        swapFeeTotal = swapFeeTotal.add(otherAmount); // fee is calculated but not transferred to this contract
        super._burn(from, burnAmount);
        super._transfer(from, to, amount);
        // super._transfer(from, address(this), swapFeeTotal);
    }

    function buyTokenAndFees(address from, address to, uint256 amount) internal {
        // burnAmount is not deduced from transfer amount
        uint256 burnAmount = amount.mul(3).div(100); //it is rounded down, should round up which is favoring the pool.
        uint256 otherAmount = amount.mul(1).div(100); //it is rounded down, should round up which is favoring the pool.
        uint256 feeAmount = amount.mul(10).div(100); //it is rounded down, should round up which is favoring the pool.
        amount = amount.sub(feeAmount);
        //amount = amount.sub(burnAmount);

        swapFeeTotal = swapFeeTotal.add(otherAmount); // fee is calculated but not transferred to this contract
        super._burn(from, burnAmount);
        super._transfer(from, to, amount);
    }

    //swapFeeTotal is the total amount of fee to be distributed, so sum of distributed value should be less than swapFeeTotal, otherwise there is not enough to distribute
    function distributeFee() public {
        uint256 mokeyFeeTotal = swapFeeTotal.mul(2);
        super._transfer(uniswapV2Pair, monkeyWallet, mokeyFeeTotal);
        super._transfer(uniswapV2Pair, birdWallet, swapFeeTotal);
        super._transfer(uniswapV2Pair, foundationWallet, swapFeeTotal);
        super._transfer(uniswapV2Pair, technologyWallet, swapFeeTotal);
        super._transfer(uniswapV2Pair, marketingWallet, swapFeeTotal);
        swapFeeTotal = 0;
    }

    // this private function is never called in the contract
    function addLiquidity(uint256 tokenAmount, uint256 usdtAmount) private {
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        IERC20(usdtAddr).approve(address(uniswapV2Router), usdtAmount);

        uniswapV2Router.addLiquidity(
            address(this), usdtAddr, tokenAmount, usdtAmount, 0, 0, address(0), block.timestamp
        );
    }
}
