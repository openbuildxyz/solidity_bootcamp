// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IGridTrading {

    function checkUpkeep(uint256 _start, uint256 _end) external view returns(bool, bytes memory);

    function performUpkeep(bytes calldata performData) external;
}
