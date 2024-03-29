### Challenge 需求

简单的锁定合约，为活动报名或其他场景提供质押和收付款功能。

### 包含功能

#### 创建活动

创建一个活动，需要 Token address 和 Amount 以及 End Time。内部 ID 递增，调用后 log 记录 ID。

#### 质押

参加一个活动，需要 ID，此时需要转移 ID 对应活动的 Token 和 Amount 到合约锁定。

#### 活动发布者提取

活动正在进行中即可进行操作，活动发布者配置参与者可取回的份额。同时活动发布者可领取到对应的份额。

比如：A B C 三人参与了活动 1，各质押了 100 USDT。活动发布者调用接口配置 A 50% B 100%，此时活动发布者获取到 50 U。可后续继续操作 C 的份额。

#### 参与者提取

当活动发布者配置结束，参与者即可提取对应的份额，如活动发布者配置了全部提取，则参与者不可提取。



### 查询接口

#### 查询活动

使用活动 ID 查询活动基本信息，发布者，质押 Token 和 数量，结束时间等。

#### 查询活动参与

使用活动 ID 查询参与质押的 Address 列表和是否经过发布者配置以及可 Claim 金额。

#### 查询本人活动参与

使用活动 ID 查询参与的活动是否经过发布者配置以及可 Claim 金额。
