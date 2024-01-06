// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2, console} from "forge-std/Test.sol";
import "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {Utils} from "../src/Utils.sol";
// 继承下来测试用
contract UtilsObj is Utils{}

contract UtilsTest is Test {
    UtilsObj utils;
    uint256[] random;

    function setUp() public {
        utils = new UtilsObj();
    }

    // function test_getCountByPercent() public {
    //     random = [
    //         78541660797044910968829902406342334108369226379826116161446442989268089806461,
    //         78541660797044910968829902406342334108369226379826116161446442989268089806461,
    //         92458281274488595289803937127152923398167637295201432141969818930235769911599,
    //         92458281274488595289803937127152923398167637295201432141969818930235769911599
    //     ];
    //     random.push(92458281274488595289803937127152923398167637295201432141969818930235769911599);
    //     uint256 amount = 1000000000000;
    //     uint256[] memory amounts = utils.getCountByPercent(
    //         random,
    //         1000000000000
    //     );
    //     uint256 total;
    //     // 计算总和
    //     for (uint256 i = 0; i < amounts.length; i++) {
    //         total += amounts[i];
    //     }
    //     // assertEq(total,amount);
    // }
}
