// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error WalletCenter__NotMatchedLength();
error WalletCenter__InvalidShare();
error WalletCenter__NotAdmin();
error WalletCenter__NotOwner();
error WalletCenter__WithdrawFailed();
error WalletCenter__VoteFailed();
error WalletCenter__YourTagWeightIsNotEnough();
error WalletCenter__YourTagNameIsTooLong();
error WalletCenter__AlreadyVoted();
error WalletCenter__UpkeepNotNeeded(uint256 balance, uint256 patients);
error WalletCenter__NotOpen();
error WalletCenter__PaymentFailed();

contract WalletCenter is VRFConsumerBaseV2, AutomationCompatibleInterface {
    struct WalletInfoQuarter {
        uint256 supporting;
        uint256 unSupporting;
    }

    struct WalletInfoHistory {
        uint256 supporting;
        uint256 unSupporting;
    }

    struct TagInfo {
        string tagName;
        uint256 tagWeight;
    }

    enum CenterStatus {
        OPEN, // 0
        CALCULATING // 1
    }

    fallback() external payable {}
    receive() external payable {}

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    CenterStatus private s_centerStatus = CenterStatus.OPEN;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint256 private immutable i_interval;
    bytes32 private immutable i_keyHash;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint256 private s_startTime;
    address payable private s_winner;
    uint256 private s_baseFee;
    address s_admin;
    address payable[] private s_patients;
    uint256 private s_maintenanceFee;
    uint256[] private s_walletIds;
    mapping(uint256 walletId => WalletInfoQuarter walletInfo) private s_quarterData;
    mapping(uint256 walletId => WalletInfoHistory walletInfo) private s_historyData;
    mapping(uint256 walletId => TagInfo[]) s_tagData;
    mapping(address owner => uint256 share) private s_shareData;

    event EnterVote(uint256 indexed walletId, address indexed patient, uint256 isSupporting);
    event AddTag(uint256 indexed walletId, address indexed patient, uint256 tagWeight, string tagName);
    event PickWinner(address indexed winner);

    constructor(
        uint256 baseFee,
        address[2] memory owners,
        address admin,
        uint256[2] memory shares,
        uint64 subscriptionId,
        bytes32 keyHash,
        uint256 interval,
        uint32 callbackGasLimit,
        address vrfCoordinator
    ) VRFConsumerBaseV2(vrfCoordinator) {
        s_admin = admin;
        i_interval = interval;
        s_startTime = block.timestamp;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_baseFee = baseFee;
        if (owners.length != shares.length) revert WalletCenter__NotMatchedLength();
        uint256 totalShare = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            totalShare += shares[i];
            if (totalShare > 100) revert WalletCenter__InvalidShare();
            s_shareData[owners[i]] = shares[i];
        }
    }

    modifier onlyAdmin() {
        if (msg.sender != s_admin) revert WalletCenter__NotAdmin();
        _;
    }

    modifier onlyOwner() {
        if (s_shareData[msg.sender] == 0) revert WalletCenter__NotOwner();
        _;
    }

    function vote(uint256 walletId, uint256 isSupporting) external payable {
        if (s_centerStatus != CenterStatus.OPEN) revert WalletCenter__NotOpen();
        for (uint256 i = 0; i < s_patients.length; i++) {
            if (s_patients[i] == msg.sender) revert WalletCenter__AlreadyVoted();
        }
        if (msg.value < s_baseFee) revert WalletCenter__VoteFailed();
        if (isSupporting == 1) {
            s_quarterData[walletId].supporting += 1;
            s_historyData[walletId].supporting += 1;
        } else {
            s_quarterData[walletId].unSupporting += 1;
            s_historyData[walletId].unSupporting += 1;
        }
        for (uint256 i = 0; i < s_walletIds.length; i++) {
            if (s_walletIds[i] == walletId) continue;
            s_walletIds.push(walletId);
        }
        (bool success,) = address(this).call{value: s_baseFee}("");
        s_patients.push(payable(msg.sender));
        if (!success) revert WalletCenter__VoteFailed();
        emit EnterVote(walletId, msg.sender, isSupporting);
    }

    function addTag(uint256 walletId, string memory tag) external payable {
        bytes memory strBytes = bytes(tag);
        if (strBytes.length > 20) revert WalletCenter__YourTagNameIsTooLong();
        if (s_tagData[walletId].length >= 5) {
            uint256 lengh = s_tagData[walletId].length;
            uint256 minWeight = s_tagData[walletId][0].tagWeight;
            for (uint256 i = 0; i < lengh; i++) {
                if (s_tagData[walletId][i].tagWeight < minWeight) {
                    minWeight = s_tagData[walletId][i].tagWeight;
                }
            }
            if (msg.value < minWeight) revert WalletCenter__YourTagWeightIsNotEnough();
        }
        s_tagData[walletId].push(TagInfo(tag, msg.value));
        emit AddTag(walletId, msg.sender, msg.value, tag);
    }

    function checkUpkeep(bytes memory)
        /**
         * checkData
         */
        public
        view
        returns (bool upkeepNeeded, bytes memory)
    /**
     * performData
     */
    {
        bool isOpen = CenterStatus.OPEN == s_centerStatus;
        bool timePassed = ((block.timestamp - s_startTime) > i_interval);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && hasBalance && isOpen);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }

    function performUpkeep(bytes calldata)
        /**
         * performData
         */
        external
    {
        (bool checkUpkeep_,) = checkUpkeep("");
        if (!checkUpkeep_) {
            revert WalletCenter__UpkeepNotNeeded(address(this).balance, s_patients.length);
        }
        s_centerStatus = CenterStatus.CALCULATING;
        i_vrfCoordinator.requestRandomWords(
            i_keyHash, i_subscriptionId, REQUEST_CONFIRMATIONS, i_callbackGasLimit, NUM_WORDS
        );
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        s_maintenanceFee += address(this).balance / 10;
        uint256 winnerIndex = randomWords[0] % s_patients.length;
        address payable winner = s_patients[winnerIndex];
        s_winner = winner;
        emit PickWinner(winner);
        (bool success,) = winner.call{value: address(this).balance - s_maintenanceFee}("");
        if (!success) revert WalletCenter__PaymentFailed();
        s_patients = new address payable[](0); // empty participants array
        s_walletIds = new uint256[](0); // empty walletIds array
        s_startTime = block.timestamp; // reset startTime
        s_centerStatus = CenterStatus.OPEN;
    }

    function setBaseFee(uint256 baseFee) external onlyAdmin {
        s_baseFee = baseFee;
    }

    function setShare(address[] memory owners, uint256[] memory shares) external onlyAdmin {
        if (owners.length != shares.length) revert WalletCenter__NotMatchedLength();
        uint256 totalShare = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            totalShare += shares[i];
            if (totalShare > 100) revert WalletCenter__InvalidShare();
            s_shareData[owners[i]] = shares[i];
        }
    }

    function withdraw(address payable beneficiary) external payable onlyOwner {
        uint256 share = s_shareData[msg.sender];
        uint256 amount = address(this).balance * share / 100;
        (bool success,) = beneficiary.call{value: amount}("");
        if (!success) revert WalletCenter__WithdrawFailed();
    }

    function getBaseFee() public view returns (uint256 baseFee) {
        return s_baseFee;
    }

    function getShare(address owner) public view returns (uint256 share) {
        return s_shareData[owner];
    }

    function getTags(uint256 walletId) public view returns (TagInfo[] memory tags) {
        return s_tagData[walletId];
    }

    function getWalletInfoQuarter(uint256 walletId) public view returns (WalletInfoQuarter memory walletInfo) {
        return s_quarterData[walletId];
    }

    function getWalletInfoHistory(uint256 walletId) public view returns (WalletInfoHistory memory walletInfo) {
        return s_historyData[walletId];
    }

    function getPatients() public view returns (address payable[] memory patients) {
        return s_patients;
    }

    function getWinner() public view returns (address winner) {
        return s_winner;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_startTime;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getCenterState() public view returns (CenterStatus) {
        return s_centerStatus;
    }

    function getWalletIds() public view returns (uint256[] memory walletIds) {
        return s_walletIds;
    }
}
