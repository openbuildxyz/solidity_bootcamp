#### create

**功能** 创建活动

`function create(IERC20 token, uint stakeAmount, uint endTime) external`

**参数**

| 参数        | 类型   | 说明                    |
| ----------- | ------ |-----------------------|
| token       | IERC20 | 活动创建者指定质押的ERC20 token |
| stakeAmount | uint   | 参与活动需要质押的代币数量         |
| endTime | uint   | 活动结束时间戳，需大于当前时间       |


#### join

**功能** 参与活动

`function join(uint8 id) external`

| 参数        | 类型   | 说明                    |
| ----------- | ------ |-----------------------|
| id | uint | 参加的活动id |


#### withdrawBySignature/withdrawBySignatureMessage

**功能** 提取押金(第一版接口)

`function withdrawBySignature(address player, uint8 id, uint256 amount, bytes memory signature) external`

`function withdrawBySignatureMessage(address player, uint8 id, uint256 amount, bytes memory signature) external`

| 参数        | 类型   | 说明                    |
| ----------- | ------ |-----------------------|
| player | address | 参与者地址 |
| id | uint8 | 活动id |
| amount | uint256 | 提取金额，当金额小于抵押值时，押金-提取的部分作为奖金直接发送给活动创建者 |
| signature | bytes | 活动创建者的签名 |

**说明**

withdrawBySignature是通过signTypedData方式签名，具体可参见测试用例中的withdrawChallenge(account, id, amount)方法；

withdrawBySignatureMessage是直接进行消息签名，签名内容可以通过getHashMessage(address player,uint8 id,uint256 amount) 获取。

#### withdraw

**功能** 提取押金(第二版接口)

`function withdraw(uint8 id, address player) external`

| 参数        | 类型   | 说明                    |
| ----------- | ------ |-----------------------|
| id | uint8 | 活动id |
| player | address | 参与者地址 |

**说明** 只有活动结束且创建者设置份额后才可提取

#### setShares

**功能** 设置创建者提取份额(总份额100，设置范围0-100，0表示全部用户提取，100表示全部创建者提取)，单次操作最多MAX_BATCH_NUMBER条

`function setShares(uint8 id, address[] calldata players, uint8[] calldata shares) external`

| 参数      | 类型        | 说明                 |
|---------|-----------|--------------------|
| id      | uint8     | 活动id               |
| players | address[] | 参与者地址列表            |
| shares  | uint8[]   | 创建者份额列表，与players对应 |

#### setSharesAndWithdraw

**功能** 设置创建者提取份额，提取对应份额的token并将剩余份额的token直接转给用户,单次操作最多MAX_BATCH_NUMBER条

`function setSharesAndWithdraw(uint8 id, address[] calldata players, uint8[] calldata shares) exteral`

| 参数      | 类型        | 说明                 |
|---------|-----------|--------------------|
| id      | uint8     | 活动id               |
| players | address[] | 参与者地址列表            |
| shares  | uint8[]   | 创建者份额列表，与players对应 |

#### getPlayersCount

**功能** 查询参与活动id的用户数量

`function getPlayersCount(uint8 id) external returns(uint)`

| 参数      | 类型        | 说明                 |
|---------|-----------|--------------------|
| id      | uint8     | 活动id               |

**返回值说明**

| 类型        | 说明   |
|-----------|------|
| uint8  | 参与人数 |

#### getPlayersList

**功能** 查询参与活动id的用户列表，用户数量很多时，需要分页查询，单次查询最多MAX_BATCH_NUMBER条

`function getPlayersList(uint8 id, uint start, uint end) public view returns(address[] memory)

| 参数    | 类型      | 说明     |
|-------|---------|--------|
| id    | uint8   | 活动id   |
| start | uint    | 下标起始位置 |
| end   | uint    | 下标结束   |

**返回值说明**

| 类型        | 说明    |
|-----------|-------|
| address[] | 参与者列表 |


#### getPlayerInfo

**功能** 查询用户参与活动的详情

`function getPlayerInfo(uint8 id, address player) public view returns(StateEnum, bool, uint)`  

| 参数      | 类型      | 说明   |
|---------|---------|------|
| id      | uint8   | 活动id |
| player | address | 用户地址 |

**返回值说明**

| 类型        | 说明                                  |
|-----------|-------------------------------------|
| StateEnum | 参与状态(0:未参与 1: 已质押未提取 2:部分提起 3:全部提取) |
| bool      | 创建者是否已设置提取份额，true:已设置 false:未设置     |
| uint      | 参与者可提取的token数量                      |

#### getMyPlayerInfo

**功能** 查询调用者参与活动详情，返回结果和getPlayerInfo一致

#### batchGetPlayerInfo

**功能** 批量查询调用者参与活动详情，参数和返回结果可参考getPlayerInfo,单次查询最多MAX_BATCH_NUMBER条

`function batchGetPlayerInfo(uint8 id, address[] memory players) public view returns(StateEnum[] memory, bool[] memory, uint[] memory)`

