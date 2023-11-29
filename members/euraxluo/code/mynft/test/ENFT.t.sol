// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {ENFT} from "../src/ENFT.sol";
import {Base64} from "../src/Base64.sol";

contract ENFTTest is Test {
    ENFT public enft;

    function setUp() public {
        enft = new ENFT();
    }

    function test_SVG() public {
        enft.createSVG(1);
        console2.log("%s:%s", enft.createSVG(1),Base64.encode(enft.createSVG(1)));
    }
}
