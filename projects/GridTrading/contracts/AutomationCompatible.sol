
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IAutomationCompatible.sol";
import "./interfaces/IGridTrading.sol";


contract AutomationCompatible is IAutomationCompatible {

    address public owner;

    address public performContract;

    address public forwarderAddress;  // Forwarder address

    constructor(address _performContract) {
        performContract = _performContract;
        owner = msg.sender;
    }

    function setForwarderAddress(address _new) public {
        require(msg.sender == owner, "Only owner");
        forwarderAddress = _new;
    }


    function checkUpkeep(bytes calldata checkData) external view  override returns (bool upkeepNeeded, bytes memory  performData ) {
        (uint _start, uint256 _end) = abi.decode(checkData, (uint256, uint256));
        return IGridTrading(performContract).checkUpkeep(_start, _end);
    }

    function performUpkeep(bytes calldata performData ) external override {
        // check forwarderAddress
        require(msg.sender == forwarderAddress, "Invalid forwarderAddress");

        IGridTrading(performContract).performUpkeep(performData);
    }

    
}