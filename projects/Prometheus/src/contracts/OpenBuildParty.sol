// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
    @dev openBuildChallenge挑战活动, 需求详见requirement.md
    @author sum
    @notice
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./Storage.sol";
import "./IOpenBuildParty.sol";

contract OpenBuildParty is Ownable, EIP712, IOpenBuildParty, Storage{

    bytes32 private constant SIGN_TYPEHASH =
        keccak256("Sign(address player,uint8 id,uint256 amount)");


    event AddBlack(address indexed account);
    event RemoveBlack(address indexed account);

    receive() external payable{
        revert ("not support!");
    }

    fallback() external payable{
        revert ("not support!");
    }

    modifier isValidId(uint8 id){
        require(id < challengeNumber, "id is invalid");
        _;
    }

    modifier isValidJoinTime(uint8 id){
        require(block.timestamp <= challengeInfo[id].endTime, "has finished!");
        _;
    }

    modifier isValidWithDrawTime(uint8 id){
        require(isFinished(id), "not finished! can't withdraw");
        _;
    }

    modifier notBlackPlayer(address player){
        require(blackPlayer[player] == false, "is black player");
        _;
    }

    constructor() Ownable(msg.sender) EIP712("OpenBuildParty", "1") {
    }

    function create(IERC20 token, uint stakeAmount, uint endTime) external notBlackPlayer(msg.sender){
        require(challengeNumber < CHALLENGE_NUMBER_LIMIT, "out of team limit");
        require(endTime > block.timestamp, "endTime should be in future");

        challengeInfo[challengeNumber]= Challenge(msg.sender, token, stakeAmount, endTime, 0, 0);
        challengeNumber += 1;
        emit Create(msg.sender, address(token), challengeNumber - 1, endTime, stakeAmount);
    }

    function join(uint8 id) external isValidId(id) isValidJoinTime(id) notBlackPlayer(msg.sender){
        require(playerChallengeState[msg.sender][id] == StateEnum.NOT_JOIN, "has joined");

        Challenge memory challenge = challengeInfo[id];
        require(challenge.stakeToken.allowance(msg.sender, address(this)) >= challenge.stakeAmount, "not approved enough");
        require(challenge.stakeToken.balanceOf(msg.sender) >= challenge.stakeAmount, "not enough balance");

        require(challenge.stakeToken.transferFrom(msg.sender, address(this), challenge.stakeAmount), "transfer failed"); // stake

        _updateChallengeStakeInfo(id, challenge.stakeAccountNum + 1, challenge.balance + challenge.stakeAmount);

        _updatePlayerChallengeState(msg.sender, id, StateEnum.NOT_WITHDRAW);
        emit Join(msg.sender, id);
    }

    function withdrawBySignature(address player, uint8 id, uint256 amount, bytes memory signature) external notBlackPlayer(msg.sender) isValidWithDrawTime(id){
        require(challengeInfo[id].creator == getSinger(player, id, amount, signature), "signature error");
        _withdraw(player, id, amount);
    }

    function withdrawBySignatureMessage(address player, uint8 id, uint256 amount, bytes memory signature) external notBlackPlayer(msg.sender) isValidWithDrawTime(id){
        require(challengeInfo[id].creator == getMessageSinger(player, id, amount, signature), "signature error");
        _withdraw(player, id, amount);
    }

    //owner不受黑名单和结束时间限制，可以直接把质押金额退回
    function returnStake(uint8 id, address[] memory players, uint[] memory amounts) external onlyOwner(){
        uint length = players.length;
        require(length == amounts.length, "length not match");
        for(uint i; i < length; i++){
            _withdraw(players[i], id, amounts[i]);
        }
    }

    /// owner有权限增加黑名单，黑名单用户不能创建和参与挑战
    function addBlack(address[] memory blackList) external onlyOwner(){
        uint length = blackList.length;
        for(uint i; i < length; i++){
            blackPlayer[blackList[i]] = true;
            emit AddBlack(blackList[i]);
        }
    }

    /// owner有权限移除黑名单
    function removeBlack(address[] memory blackList) external onlyOwner(){
        uint length = blackList.length;
        for(uint i; i < length; i++){
            blackPlayer[blackList[i]] = false;
            emit RemoveBlack(blackList[i]);
        }
    }

    function isFinished(uint8 id) public view isValidId(id) returns(bool){
        return challengeInfo[id].endTime < block.timestamp;
    }

    function getHashMessage(address player,uint8 id,uint256 amount) public pure returns(bytes32){
        return keccak256(abi.encodePacked(player, id, amount));
    }

    function getSinger(address player, uint8 id, uint amount, bytes memory signature) public view returns(address){
        bytes32 structHash = keccak256(abi.encode(SIGN_TYPEHASH, player, id, amount));
        bytes32 hash = _hashTypedDataV4(structHash);
        return ECDSA.recover(hash, signature);
    }

    function getMessageSinger(address player, uint8 id, uint amount, bytes memory signature) public pure returns(address){
        bytes32 messageHash = _toEthSignedMessageHash(getHashMessage(player, id, amount));
        return ECDSA.recover(messageHash, signature);
    }

    function _toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function _withdraw(address player, uint8 id, uint amount) internal isValidId(id) {
        require(playerChallengeState[player][id] == StateEnum.NOT_WITHDRAW, "can't withdraw, make sure you joined and not withdraw yet");
        Challenge memory challenge = challengeInfo[id];

        require(amount <= challenge.stakeAmount, "amount should less than stake");
        require(challenge.stakeToken.balanceOf(address(this)) >= challenge.stakeAmount, "not enough token");

        uint creatorRewards = challenge.stakeAmount - amount;
        require(challenge.stakeToken.transfer(player, amount),"transfer failed"); // withdraw

        bool isAll = true;
        // send rewards
        if (creatorRewards > 0){
            isAll = false;
            require(challenge.stakeToken.transfer(challenge.creator, creatorRewards), "transfer failed");
        }

        _updateChallengeStakeInfo(id, challenge.stakeAccountNum, challenge.balance - challenge.stakeAmount);

        StateEnum newState = isAll ? StateEnum.ALL_WITHDRAW : StateEnum.PART_WITHDRAW;
        _updatePlayerChallengeState(player, id, newState);

        emit WithDraw(msg.sender, player, id, isAll, amount);
    }

}