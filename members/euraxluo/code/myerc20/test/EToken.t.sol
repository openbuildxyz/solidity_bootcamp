// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {EToken} from "../src/EToken.sol";

contract ETokenTest is Test {
    EToken public etoken;

    function setUp() public {
        etoken = new EToken();
    }

    function test_mint() public {
        etoken.mint(100);
        console2.log(
            "%s:%s",
            etoken.totalSupply(),
            100 + 10 * 10 ** etoken.decimals()
        );
        assertEq(etoken.totalSupply(), 100 + 10 * 10 ** etoken.decimals());
    }

    function testFuzz_mint(uint8 x) public {
        etoken.mint(x);
        console2.log(
            "%s:%s",
            etoken.totalSupply(),
            x + 10 * 10 ** etoken.decimals()
        );
        assertEq(etoken.totalSupply(), x + 10 * 10 ** etoken.decimals());
    }
}
