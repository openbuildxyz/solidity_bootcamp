// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";

import "../contracts/Lock.sol";

contract LockTest is Test {
    Lock t;

    function setUp() public {
        t = new Lock(1699356981);
    }

    function testName() public {
        assertEq(t.unlockTime(), 1699356981);
    }
}

