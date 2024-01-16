// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
    @dev openBuildChallenge挑战活动, 需求详见requirementV2.md
    @author sum
    @notice
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "./StorageV2.sol";
import "./IOpenBuildPartyV2.sol";

contract OpenBuildPartyV2 is Ownable, IOpenBuildPartyV2, StorageV2{

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

    modifier isValidWithdrawState(uint8 id, address player){
        require(playerChallengeState[player][id] == StateEnum.NOT_WITHDRAW, "can't withdraw, make sure you joined and not withdraw yet");
        _;
    }

    modifier onlyCreator(uint8 id){
        require(challengeInfo[id].creator == msg.sender, "only creator");
        _;
    }

    modifier notInitShare(address player, uint8 id){
        require(challengePlayerShares[id][player] != DEFAULT_SHARE, "has not set share yet");
        _;
    }

    constructor() Ownable(msg.sender) {
    }

    /**
    @notice 创建挑战
    @param token IERC20 token 抵押的token
    @param stakeAmount 押金
    @param endTime 截止时间
    */
    function create(IERC20 token, uint stakeAmount, uint endTime) external notBlackPlayer(msg.sender){
        require(challengeNumber < CHALLENGE_NUMBER_LIMIT, "out of team limit");
        require(endTime > block.timestamp, "endTime should be in future");

        challengeInfo[challengeNumber]= Challenge(msg.sender, token, stakeAmount, endTime, 0, 0);
        challengeNumber += 1;
        emit Create(msg.sender, address(token), challengeNumber - 1, endTime, stakeAmount);
    }

    /**
    @notice 参与挑战, 要求id有效，参与时间有效，用户不在黑名单且未参加此挑战，同时要求用户有足够的押金并完成授权
    @param id 挑战id
    */
    function join(uint8 id) external isValidId(id) isValidJoinTime(id) notBlackPlayer(msg.sender) {
        require(playerChallengeState[msg.sender][id] == StateEnum.NOT_JOIN, "has joined");

        Challenge memory challenge = challengeInfo[id];
        require(challenge.stakeToken.allowance(msg.sender, address(this)) >= challenge.stakeAmount, "not approved enough");
        require(challenge.stakeToken.balanceOf(msg.sender) >= challenge.stakeAmount, "not enough balance");

        require(challenge.stakeToken.transferFrom(msg.sender, address(this), challenge.stakeAmount), "transfer failed"); // stake

        _updateChallengeStakeInfo(id, challenge.stakeAccountNum + 1, challenge.balance + challenge.stakeAmount);

        _updatePlayerChallengeState(msg.sender, id, StateEnum.NOT_WITHDRAW);

        _addChallengePlayerList(id, msg.sender);

        _updateChallengePlayerShare(id, msg.sender, DEFAULT_SHARE); //初始化用户提取比例

        emit Join(msg.sender, id);
    }

    /**
    @notice 提取押金，用户只能在挑战结束时间后且创建者完成提取比例设置后提取押金
    @param id 挑战id
    @param player 提取用户
    */
    function withdraw(uint8 id, address player) external notBlackPlayer(player) isValidWithDrawTime(id) notInitShare(player, id){
        uint playerAmount = _getWithDrawAmount(player, id);
        _withdraw(player, id, playerAmount);
    }

    /**
    @notice owner不受黑名单和结束时间及提取比例设置限制，可以直接把质押指定金额退回
    @param id 挑战id
    @param players 提取用户列表
    @param amounts 提取金额列表
    */
    function returnStake(uint8 id, address[] memory players, uint[] memory amounts) external onlyOwner(){
        uint length = players.length;
        require(length == amounts.length, "length not match");
        for(uint i; i < length; i++){
            _withdraw(players[i], id, amounts[i]);
        }
    }

    /// owner有权限增加黑名单，黑名单用户不能创建和参与挑战
    function addBlack(address[] calldata blackList) external onlyOwner(){
        uint length = blackList.length;
        for(uint i; i < length; i++){
            blackPlayer[blackList[i]] = true;
            emit AddBlack(blackList[i]);
        }
    }

    /// owner有权限移除黑名单
    function removeBlack(address[] calldata blackList) external onlyOwner(){
        uint length = blackList.length;
        for(uint i; i < length; i++){
            blackPlayer[blackList[i]] = false;
            emit RemoveBlack(blackList[i]);
        }
    }

    /**
    @notice 挑战创建者设置提取比例,share范围0-100,表示创建者所属的比例
    @param id 挑战id
    @param players array 提取用户
    @param shares array 提取份额
    */
    function setShares(uint8 id, address[] calldata players, uint8[] calldata shares) external onlyCreator(id){
        uint length = players.length;
        require(length == shares.length, "length not match");
        require(length <= MAX_BATCH_NUMBER, "too many players");
        for(uint i; i < length; i++){
            _setShare(id, players[i], shares[i]);
        }
    }

    //创建者设置提取比例并直接提取押金,用户提取金额向下取正整数

    function setSharesAndWithdraw(uint8 id, address[] calldata players, uint8[] calldata shares) external onlyCreator(id){
        uint length = players.length;
        require(length == shares.length, "length not match");
        require(length <= MAX_BATCH_NUMBER, "too many players");
        for(uint i; i < length; i++){
            require(playerChallengeState[players[i]][id] == StateEnum.NOT_WITHDRAW, "state should be not_withdraw");
            _setShare(id, players[i], shares[i]);
            uint playerAmount = _getWithDrawAmount(players[i], id);
            _withdraw(players[i], id, playerAmount);
        }
    }

    /**
    @notice 检查挑战是否结束
    @param id 挑战id
    @return bool 是否结束，true:结束 false:未结束
    */
    function isFinished(uint8 id) public view isValidId(id) returns(bool){
        return challengeInfo[id].endTime < block.timestamp;
    }

    /**
    @notice 获取用户参与挑战详情
    @param player 用户
    @param id 挑战id
    @return （StateEnum，bool，uint） 参与状态，创建者是否完成比例设置，可以提取的质押金额
    */
    function getPlayerInfo(uint8 id, address player) public view isValidId(id) returns(StateEnum, bool, uint) {
        StateEnum state = playerChallengeState[player][id];
        uint share = challengePlayerShares[id][player];
        if (state == StateEnum.NOT_JOIN || share == DEFAULT_SHARE){
            return (state, false, 0);
        }
        uint playerAmount = _getWithDrawAmount(player, id);
        return (state, true, playerAmount);
    }

    ///获取调用者挑战详情
    function getMyPlayerInfo(uint8 id) public view returns(StateEnum, bool, uint) {
        return getPlayerInfo(id, msg.sender);
    }

    /**
    @notice 获取某次挑战用户数量
    @param id 挑战id
    */
    function getPlayersCount(uint8 id) public view isValidId(id) returns(uint){
        return challengeInfo[id].stakeAccountNum;
    }

    /**
    @notice 获取某次挑战用户列表及质押详情，用户数量很多时，需要分页查询，单次查询最多MAX_BATCH_NUMBER条
    @param id 挑战id
    @param start 开始下标
    @param end 结束下标
    */
    function getPlayersList(uint8 id, uint start, uint end) public view returns(address[] memory){
        require(start < end && end - start <= MAX_BATCH_NUMBER && end < challengeInfo[id].stakeAccountNum, "need start < end and (end - start) <= MAX_BATCH_NUMBER and end < stakeAccountNum");
        uint length = end - start;
        address[] memory players = new address[](length);
        uint index;
        address[] memory totalPlayers = challengePlayerList[id];
        for(uint i = start; i < end; i++){
            index = i - start;
            players[index] = totalPlayers[i];
        }
        return players;

    }

    /**
    @notice 获取某次挑战用户列表及质押详情，用户数量很多时，需要分页查询，单次查询最多MAX_BATCH_NUMBER条
    @param id 挑战id
    @param players 用户列表
    @return （uint8[],bool[],uint[]） 用户列表，用户参与状态列表，创建者是否完成比例设置列表，可以提取的质押金额列表
    */
    function batchGetPlayerInfo(uint8 id, address[] memory players) public view isValidId(id) returns(StateEnum[] memory, bool[] memory, uint[] memory) {
        uint length = players.length;
        require(length <= MAX_BATCH_NUMBER, "too many players");
        StateEnum[] memory status = new StateEnum[](length);
        bool[] memory hasSetShares = new bool[](length);
        uint[] memory amounts = new uint[](length);

        StateEnum state;
        bool hasSetShare;
        uint amount;
        for(uint i = 0; i < length; i++){
            (state, hasSetShare, amount) = getPlayerInfo(id, players[i]);
            status[i] = state;
            hasSetShares[i] = hasSetShare;
            amounts[i] = amount;
        }

        return (status, hasSetShares, amounts);
    }

    ///计算用户可以提取的质押金额
    function _getWithDrawAmount(address player, uint8 id) internal view notInitShare(player, id) returns(uint){
        return challengeInfo[id].stakeAmount * (100 - challengePlayerShares[id][player]) / 100;
    }

    function _withdraw(address player, uint8 id, uint amount) internal isValidId(id) {

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

    /**
    @notice 挑战创建者设置提取份额,范围[0,100],表示创建者所属的比例,已提取过的不能再设置，未提取过可重复设置
    @param id 挑战id
    @param player 参与者
    @param share 提取份额
    */
    function _setShare(uint8 id, address player, uint8 share) internal isValidId(id){
        require(0 <= share && share <= MAX_SHARE, "share out of range");
        require(playerChallengeState[player][id] != StateEnum.PART_WITHDRAW && playerChallengeState[player][id] != StateEnum.ALL_WITHDRAW, "has withdrawed, can't set share");
        // require(player != address(0), "player not exist");
        // require(challengeInfo[id].players.indexOf(player) >= 0, "player not in players");
        _updateChallengePlayerShare(id, player, share);//设置比例,已经设置过的可以重设

        emit SetShare(player, id, share);
    }

}