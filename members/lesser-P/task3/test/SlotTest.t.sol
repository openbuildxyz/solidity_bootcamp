// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {Slot} from "../src/Slot.sol";

contract SlotTest is Test {
    bytes32 public TEST_SLOT = keccak256("TEST_SLOT");
    address public player = makeAddr("PLAYER");
    Slot slot;

    function setUp() external {
        hoax(player, 10 ether);
        slot = new Slot();
    }

    function testCheckStatementNotWorng() public {
        bytes32 _TEST_SLOT = slot.TEST_SLOT();
        assertEq(TEST_SLOT, _TEST_SLOT);
    }

    function testIfDifferentAddrGetSameValueIsWrong() public {
        uint256 startingIndex = 0;
        uint256 players = 5;
        for (uint256 i = startingIndex; i < players; i++) {
            address player = address(uint160(i));
            slot.write(player);
            address addr = slot.get();
            assertEq(player, addr);
        }
    }

    function testIfRandomAddressWrite(address randomAddress) public {
        slot.write(randomAddress);
        address addr = slot.get();
        assertEq(randomAddress, addr);
    }
}
