// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";

import "../contracts/OpenBuildERC20.sol";

contract LockTest is Test {
    OpenBuildERC20 t;

    function setUp() public {
        t = new OpenBuildERC20();
    }

    function testNameSuccess() public {
        assertEq(t.name(), "OpenBuildERC20");
    }

    function testNameFailed() public {
        assertEq(t.name(), "OnBuildERC20");
    }
}


