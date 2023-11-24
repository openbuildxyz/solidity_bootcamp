// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {MyERC20} from "../../src/MyERC20.sol";
import {DeployMyERC20} from "../../script/DeployMyERC20.s.sol";

contract MyERC20Test is Test {
    MyERC20 myERC20;

    address USER = makeAddr("user");

    uint256 private constant MINT_AMT = 1e18;

    function setUp() public {
        DeployMyERC20 deployer = new DeployMyERC20();
        myERC20 = deployer.run();
    }

    function test_MintOwner() public {
        vm.prank(msg.sender);
        myERC20.mint(MINT_AMT);
    }

    function testFail_MintUser() public {
        vm.prank(USER);
        myERC20.mint(MINT_AMT);
    }
}
