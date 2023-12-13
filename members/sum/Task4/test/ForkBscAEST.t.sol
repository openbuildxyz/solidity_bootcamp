pragma solidity ^0.8.4;
import {Test, console2} from "forge-std/Test.sol";
import {AEST, ERC20, IUniswapV2Pair, IUniswapV2Router02} from "../src/AEST.sol";

contract ForkBscAEST is Test {
    // the identifiers of the forks
    uint256 bscFork;
    address payable target = payable(0xdDc0CFF76bcC0ee14c3e73aF630C029fe020F907);
    address owner = 0x7c64e03e0A4Ed9C19f1ab8B85b8e10eA59BBd150; //developer
    address holder1 = 0x790fF2BdC2591AF87e656febc6FfdF2D9b2F48e1;
    address recevier = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address lp_token = 0x40eD17221b3B2D8455F4F1a05CAc6b77c5f707e3;
    address uniswapv2Router = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    address usdt_token = 0x55d398326f99059fF775485246999027B3197955;
    address usdt_holder = 0xc748673057861a797275CD8A068AbB95A902e8de;

    // create bsc fork during setup, block=26793740
    function setUp() public {
        string memory BSC_RPC_URL = vm.envString("BSC_RPC_URL");
        //bscFork = vm.createSelectFork(BSC_RPC_URL, 26793740);
        bscFork = vm.createFork(BSC_RPC_URL, 26793740);
    }

    /**
     * test fork
     */
    function testFork() public {
        // check activeFork is bsc, block is 26793740
        vm.selectFork(bscFork);
        assertEq(vm.activeFork(), bscFork);
        assertEq(block.number, 26793740);
    }

    /**
     * test owner, transferOwnership
     */
    function testOwner() public {
        vm.selectFork(bscFork);
        AEST aest  = AEST(target);
        assertEq(owner, aest.owner());
        vm.prank(owner);
        aest.transferOwnership(recevier);
        assertEq(recevier, aest.owner());
    }

    /**
     * test aest transfer from A to B
     */
    function testTransfer() public {
        vm.selectFork(bscFork);
        AEST aest  = AEST(target);

        uint256 balance1_before = aest.balanceOf(holder1);
        uint256 balance2_before = aest.balanceOf(recevier);

        vm.prank(holder1);
        aest.transfer(recevier, 1e18);

        uint256 balance1_after = aest.balanceOf(holder1);
        uint256 balance2_after = aest.balanceOf(recevier);
        console2.log("holder1 balance, before: ",balance1_before," after: ",balance1_after);
        console2.log("recevier balance, before: ",balance2_before," after: ",balance2_after);
        assertEq(balance1_after, balance1_before - 1e18);
        assertEq(balance2_after, balance2_before + 1e18);
    }

    /**
     * test aest transfer from A to A
     */
    function testTransfer2Self() public {
        vm.selectFork(bscFork);
        AEST aest  = AEST(target);
        uint256 balance_before = aest.balanceOf(holder1);
        vm.prank(holder1);
        aest.transfer(holder1, 1e18);

        uint256 balance_after = aest.balanceOf(holder1);
        console2.log("holder1 balance, before: ",balance_before," after: ",balance_after);
        assertEq(balance_after, balance_before);
    }

    /**
     * test lp swap
     * step1: swap 1e18 usdt to aest
     * step2: swap the aest(amount: step1 return aest) to usdt
     * step3: compute the loss
     */
    function testLpSWAP() public {
        vm.selectFork(bscFork);
        IUniswapV2Pair pair  = IUniswapV2Pair(lp_token);
        IUniswapV2Router02 router2 = IUniswapV2Router02(uniswapv2Router);
        AEST aest  = AEST(target);
        ERC20 usdt = ERC20(usdt_token);
        (uint112 amount0, uint112 amount1,) = pair.getReserves();
        console2.log("amount0: ",amount0," amount1: ",amount1);

        vm.startPrank(usdt_holder, usdt_holder);
        address [] memory path = new address[](2);
        path[0] = usdt_token;
        path[1] = target;
        uint256 usdtBalanceInit = usdt.balanceOf(usdt_holder);
        uint256 aestBalanceInit = aest.balanceOf(usdt_holder);
        console2.log("before usdt balance: ", usdtBalanceInit);
        console2.log("before aest balance: ",aestBalanceInit);

        aest.approve(uniswapv2Router, 1e30);
        usdt.approve(uniswapv2Router, 1e30);
        console2.log("swap usdt to aest, amount: 1e18");
        router2.swapExactTokensForTokensSupportingFeeOnTransferTokens(1e18, 10, path, usdt_holder, 9999999999);

        uint256 usdtBalanceSwap1 = usdt.balanceOf(usdt_holder);
        uint256 aestBalanceSwap1 = aest.balanceOf(usdt_holder);
        console2.log("afterswap1 usdt balance: ", usdtBalanceSwap1);
        console2.log("afterswap1 aest balance: ", aestBalanceSwap1);

        address [] memory path2 = new address[](2);
        path2[0] = target;
        path2[1] = usdt_token;
        console2.log("swap aest to usdt, amount: ", aestBalanceSwap1);
        router2.swapExactTokensForTokensSupportingFeeOnTransferTokens(aestBalanceSwap1, 10, path2, usdt_holder, 9999999999);

        uint256 usdtBalanceSwap2 = usdt.balanceOf(usdt_holder);
        uint256 aestBalanceSwap2 = aest.balanceOf(usdt_holder);
        console2.log("afterswap2 usdt balance: ", usdtBalanceSwap2);
        console2.log("afterswap2 aest balance: ", aestBalanceSwap2);

        uint256 lossusdt = usdtBalanceInit-usdtBalanceSwap2;
        console2.log("loss usdt:",lossusdt);
        console2.log("loss rate:" , lossusdt*100/usdtBalanceInit, "%");
    }

}

