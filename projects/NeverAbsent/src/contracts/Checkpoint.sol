// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
    @dev 打卡应用-组队打卡获取奖学金
    1. 奖金是ERC20，由活动发起者提供，可设定奖励总金额和活动起止时间
    2. 打卡形式分为3种：个人打卡/2人组打卡/3人组打卡，每人每天只能打一次卡，积分策略为如下：
     a.单人组每次打卡6分
     b.2人组队员均打卡,每人得12分，一人打卡，打卡者得3分，未打开者0分。
     c.3人组队员均打开，每人得18分，一人打卡，打卡者得2分，两人打卡打卡者各得4分，未打卡者0分。
    3. 队伍总数量设定上限100组
    4. 到截止日期后，每个人根据积分占比可提取对应数量的ERC20 token，可代执行领取
    5. 提供查询用户奖金的方法
    6. 出现异常情况需要停止活动时，owner可以提走合约中的剩余ERC20，并销毁合约
    7. 支持黑名单功能，一旦发现恶意刷分，owner可以将地址加入黑名单，被加入黑名单后不能参与活动且已经获得的积分无效

    @author sum
    @notice
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CheckpointStorage.sol";
import "./CheckTypeEnum.sol";
import "./IERROR.sol";

contract Checkpoint is CheckpointStorage, IERROR, Ownable{
    uint constant SINGLE_CHECKIN_SCORE = 6;
    IERC20 immutable public rewardToken;
    uint immutable public startTime;
    uint immutable public endTime;
    uint immutable public totalRewards;

    event CreateTeam(address indexed account, uint8 teamId, CheckType checkType);
    event Join(address indexed account, uint8 teamId);
    event CheckIn(address indexed account, uint8 teamId, uint checkLastTime, uint score);
    event WithDraw(address indexed account, uint rewards);
    event AddBlack(address indexed account, uint8 teamId, uint score);

    constructor(address token, uint start, uint end, uint rewards) Ownable(msg.sender){
        rewardToken = IERC20(token);
        startTime = start;
        endTime = end;
        totalRewards = rewards ;
    }

    modifier isValidCheckTime(){
        require(block.timestamp >= startTime && block.timestamp <= endTime, "invalid time");
        _;
    }

    modifier notBlackPlayer(address player){
        require(blackPlayer[player] == false, "is black player");
        _;
    }

    function setRewards() public{
        require(rewardToken.balanceOf(msg.sender) >= totalRewards, "not enough balance");
        require(rewardToken.transferFrom(msg.sender, address(this), totalRewards), "setRewards failed");
    }

    function createTeam(CheckType teamType) public{
        require(playerInfo[msg.sender].teamId == 0, "has joined");
        require(teamNumber < totalTeamLimit, "out of team limit");
        require(teamType == CheckType.SINGLE || teamType == CheckType.DOUBLE || teamType == CheckType.TRIPLE, "invalid checkType");
        teamNumber += 1;
        bool finished = false;
        if (teamType == CheckType.SINGLE){
            finished = true;
        }

        teamInfo[teamNumber] = Team(teamType, msg.sender, address(0), address(0), finished);
        playerInfo[msg.sender] = Player(teamNumber, 0, 0);
        emit CreateTeam(msg.sender, teamNumber, teamType);
    }

    function join(uint8 teamId) public{
        require(teamId != 0, "teamId should not be 0");
        require(playerInfo[msg.sender].teamId == 0, "has joined");
        require(teamInfo[teamId].player1 != address(0), "team has not created, use createTeam function");
        require(!teamInfo[teamId].finished, "team has enough player");
        Team storage team = teamInfo[teamId];

        if (team.player2 == address(0)){
            team.player2 = msg.sender;
            if (team.teamType == CheckType.DOUBLE){
                team.finished = true;
            }
        }
        else if (team.player3 == address(0)){
            team.player3 = msg.sender;
            team.finished = true;
        }
        //playerTeam[msg.sender] = teamId;
        playerInfo[msg.sender] = Player(teamId, 0 , 0);
        emit Join(msg.sender, teamId);
    }

    function checkIn() public isValidCheckTime() {
        require(playerInfo[msg.sender].teamId != 0, "not joined any team");
        require(getDayStartTime() > playerInfo[msg.sender].lastCheckTime, "has checked");

        if (teamInfo[playerInfo[msg.sender].teamId].teamType == CheckType.SINGLE){
            updateSingleTeamScore(msg.sender);
        }
        else if (teamInfo[playerInfo[msg.sender].teamId].teamType == CheckType.DOUBLE){
            updateDoubleTeamScore(msg.sender);
        }
        else {
            updateTripleTeamScore(msg.sender);
        }
        emit CheckIn(msg.sender, playerInfo[msg.sender].teamId, playerInfo[msg.sender].lastCheckTime, playerInfo[msg.sender].score);

    }


    function getDayStartTime() view public returns(uint){
        uint currentTimestamp = block.timestamp;
        return currentTimestamp - (currentTimestamp % secondsOneDay);
    }

    function isFinished() view public returns(bool){
        return block.timestamp > endTime;
    }

    function getRewardsPerScore() view public returns(uint){
        return totalRewards * 1e18/totalScore;
    }

    /**
    获取结束前该方法结果仅供参考
    */
    function getPlayerRewards(address player) view public returns(uint){
        require(playerInfo[player].teamId != 0, "not joined any team");
        return playerInfo[player].score * getRewardsPerScore() / 1e18;
    }

    function balanceOfRewardToken() view public returns(uint){
        return rewardToken.balanceOf(address(this));
    }

    function getSingleScore() pure public returns(uint){
        return SINGLE_CHECKIN_SCORE;
    }

    function getDoubleScore(bool isFirst) pure public returns(uint){
        if (isFirst){
            return getSingleScore()/2;
        }else{
            return getSingleScore() * 2;
        }
    }

    //order表示第几个打卡，范围1、2、3
    function getTripleScore(uint order) pure public returns(uint){
        require(order == 1 || order ==2 || order == 3, "invalid order, ourder should be 1,2,3");
        if (order == 1){
            return getSingleScore()/3;
        }else if (order == 2){
            return getSingleScore() * 2 / 3;
        }
        return getSingleScore() * 3;
    }

    function withdrawReward(address player) public{
        require(playerInfo[player].teamId != 0, "invalid player");
        require(hasWithDrawed[player] == false, "has withdrawed");
        uint rewards = getPlayerRewards(player);
        require(balanceOfRewardToken() >= rewards, "not enough rewards");
        rewardToken.transfer(player, rewards);
        hasWithDrawed[player] = true;

        emit WithDraw(player, rewards);
    }

    function withDrawAllRewardToOwner() public onlyOwner(){
        uint balance = balanceOfRewardToken();
        rewardToken.transfer(owner(), balance);
        selfdestruct(payable(msg.sender));

    }

    function addBlack(address[] memory blackList) public onlyOwner(){
        uint length = blackList.length;
        for(uint i; i < length; i++){
            Player memory player = playerInfo[blackList[i]];
            if (blackPlayer[blackList[i]] == false){
                totalScore -= player.score;
                blackPlayer[blackList[i]] = true;
                emit AddBlack(blackList[i], player.teamId, player.score);
            }
        }
    }

    function updateSingleTeamScore(address sender) internal {
        Player storage player = playerInfo[sender];
        require(teamInfo[player.teamId].teamType == CheckType.SINGLE, "not single team");
        player.lastCheckTime = block.timestamp;
        player.score += getSingleScore();
        totalScore += getSingleScore();
    }

    function updateDoubleTeamScore(address sender) internal{
        Player storage player = playerInfo[sender];
        require(teamInfo[player.teamId].teamType == CheckType.DOUBLE, "not double team");

        player.lastCheckTime = block.timestamp;
        uint8 teamId = player.teamId;
        Player storage player2 = playerInfo[teamInfo[teamId].player2];
        if (msg.sender == teamInfo[teamId].player2){
            player2 = playerInfo[teamInfo[teamId].player1];
        }
        if (player2.lastCheckTime >= getDayStartTime()){ //player2 has check

            player.score += getDoubleScore(false);
            player2.score += getDoubleScore(false) - getDoubleScore(true);
            totalScore += 2 * getDoubleScore(false) - getDoubleScore(true);
        }else{  //player2 not check
            player.score += getDoubleScore(true);
            totalScore += getDoubleScore(true) ;
        }

    }

    function updateTripleTeamScore(address sender) internal{
        Player storage player = playerInfo[sender];
        require(teamInfo[player.teamId].teamType == CheckType.TRIPLE, "not triple team");

        player.lastCheckTime = block.timestamp;
        uint8 teamId = player.teamId;

        address  playerPartner1 = teamInfo[teamId].player1;
        address  playerPartner2 = teamInfo[teamId].player2;
        if (sender == playerPartner1){
            playerPartner1 = teamInfo[teamId].player3;
        }else if(sender == playerPartner2){
            playerPartner2 = teamInfo[teamId].player3;
        }
        Player storage player2 = playerInfo[playerPartner1];
        Player storage player3 = playerInfo[playerPartner2];

        if (player2.lastCheckTime < getDayStartTime() && player3.lastCheckTime < getDayStartTime() ){ //player2 和player3都没打卡
            player.score += getTripleScore(1);
            totalScore += getTripleScore(1);
        }
        else if (player2.lastCheckTime >= getDayStartTime() && player3.lastCheckTime < getDayStartTime()){ //player2打过，player3没打卡
            player.score += getTripleScore(2);
            player2.score += getTripleScore(2) - getTripleScore(1);
            totalScore += 2 * getTripleScore(2) - getTripleScore(1);
        }
        else if (player2.lastCheckTime < getDayStartTime() && player3.lastCheckTime >= getDayStartTime()){ //player2打过，player3没打卡
            player.score += getTripleScore(2);
            player3.score += getTripleScore(2) - getTripleScore(1);
            totalScore += 2 * getTripleScore(2) - getTripleScore(1);
        }
        else{ //player2和player3都打过
            player.score += getTripleScore(3);
            player2.score += getTripleScore(3) - getTripleScore(2);
            player3.score += getTripleScore(3) - getTripleScore(2);
            totalScore += 3 * getTripleScore(3) - 2 * getTripleScore(2);
        }
    }

}