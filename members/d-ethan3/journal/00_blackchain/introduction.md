# Introduction to Blockchain

## 区块链基本原理

### 互联网应用模型

- Client-Server 架构
- 高效，数据中心化存储
- 无条件信任运营者

### 区块链网络架构

- P2P 架构
- 每个节点同步数据，大量冗余备份
- 任何一个节点都可以提供全部服务
- 只需要对协议（代码）的信任

## 区块链的基本结构

- 链式数据结构
  - 分叉
- 状态一致性复制
  - 区块链的数据库就是状态机（State），所谓共识就是如何保证所有节点的状态持续一致
- 数据访问权限
  - 无需许可（但是一般有交易成本）
  - 读取完全公开透明
  - 通过加密算法对写入鉴权（只有对应的私钥才能改变一个账户的状态）

## 区块链共识算法

- 通过某种协议达到全网节点的数据一致
- 只影响交易的收录和排序
  - 交易本身安全性由加密算法保证
    - 即使共识失败，没有私钥也不能盗币
    - 双花是交易排序问题
  - PoW 和 PoS 不是共识算法
    - 防止垃圾节点占据全网多数
    - PoW 的过程需要时间，所以造成延迟
  - 共识算法种类
    - 概率共识
      - 最长链（中本聪共识）
      - 最多传播（雪崩共识）
    - 确定性共识
      - pBFT
      - HotStuff
- 扩容的两个维度
  - 吞吐量（交易费太高）
    - 大区块，降低去中心化程度（ETH2.0 PoS不能更好解决的问题）
  - 时延（交易确认太慢）
    - 替换 PoW (ETH2.0 PoS 能更好解决的问题)

## 没有太多人提到的问题

> 或许你应该注意

- EVM的处理瓶颈
  - EVM是单线程处理模型，当前最强 CPU 单线程处理能力在 1000 到 2000 TPS 之间
- 状态存储爆炸和 I/O 瓶颈
  - 高 TPS 产生大量状态数据
  - BSC 大约 200TPS，硬盘和 I/O 性能要求都已经到极限
    - AWS 节点每月成本数千 $

## 区块链应用

- 发币
  - ERC20
- DeFi
  - DEX，借贷，流动性挖矿
- NFT (ERC721, ERC1155)
  - 头像， 游戏
  - 市场
  - 借贷

互联网应用通常不已资产为核心

### Bonding Curve - DeFi 的基石

- DEX(Uniswap)
  - X*Y=K
- 借贷（compound, aave）
  - R=R_base+utilization*slope
- 流动性越多交易体验越好

## Web3 应用开发架构

### 传统 Web2 应用架构

Front-end Back-end Database

### Web3 应用架构

- 前端
  - 钱包插件
    - 浏览器 Plugin
    - Wallet Connect
  - 后端
    - 智能合约（数据库+简单计算）
    - 数据流（The Graph）
  - 存储
    - 中心化：AWS S3
    - 去中心化：IPFS

## 区块链开发例子 - 部署一个 ERC20 代币

1. 准备好开发环境
2. 选择在哪条链上开发
   - 配置 RPC - [ChainList](https://chainlist.org/)
   - 领取测试代币（水龙头）
   - 可用 [Meter](https://docs.meter.io/developer-documentation/introduction) 尝试开发
3. ERC20 合约
   [tokenERC20](https://github.com/meterio/tokenERC20)
4. 合约常用开发环境
   - Node.js
   - npm
   - hardhat
