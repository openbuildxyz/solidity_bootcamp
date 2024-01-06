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

**功能** 提取押金

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
