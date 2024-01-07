1. secondsOneDay 打卡频率，86400表示打卡需间隔24小时
2. totalTeamLimit 队伍数量上限
3. teamNumber 已组队的数量
4. playerInfo(address) 参数是用户地址，返回结构
   struct Player{
   uint8 teamId; //队伍id
   uint score;  //截止目前已经获得的分数
   uint lastCheckTime; //最近一次打卡时间
   }
5. teamInfo(uint) 参数是队伍id，从1递增，返回结构
   struct Team{
   CheckType teamType; //0 单人组; 1 双人组; 2 三人组
   address player1;   //队长，创建者
   address player2;   //队员1
   address player3;   //队员2
   bool finished;    //该队伍是否已完成
   }
6. createTeam(CheckType) 创建战队，参数是0 1 2同上
7. join(uint8)  加入战队，参数是1-100的队伍id
8. checkIn() 打卡
9. isFinished() 活动是否已结束
10. withdrawReward(address) 提取奖励，可以代领，参数是领取奖励的地址
