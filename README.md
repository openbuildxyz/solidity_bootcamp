# solidity_bootcamp

Co-learn Solidity，一起变强！🔥🔥🔥

### 学习路线：
4 周 （6 Lessons + HackerWeekend）

1.Blockchain Introduction (区块链解决什么问题，Web2 与 Web3 的不同, 给 Web2 开发者的机会，Wallet 、 Layers)
1、区块链基本原理介绍
2、区块链应用情况介绍
3、区块链技术学习路径
4、典型 web2 与 web3 应用的不同
5、优秀学习资料分享

2.Solidity Introduction (Remix, how to deploy, types, interface ) 
Solidity 智能合约简介
合约开发框架、工具介绍
Solidity 核心语法
合约开发、调试、部署流程介绍（使用 Remix）

3.ERC contracts ( ERC20 、 ERC721 openzepplin) and Mini Exchange 
ERC/EIP 介绍
ERC20/ERC712/ERC1155 概念讲解
OpenZepplin 简介及实用库推荐
Mini Exchange Demo 讲解（使用 Foundry）

4.Test & Security & Advanced Coding 
Test：
Hardhat 介绍，场景测试，Task
Foundry 介绍，场景测试，fork环境测试
Security：
常见安全漏洞，及修复事项
Hardhat本地安全测试及局限性
Foundry模拟线上环境安全测试 (实操)
Advance Coding：
ERC20扩展协议及安全编程注意事项
ERC721/ERC1155 安全编程注意事项
协议设计通用安全注意事项

5.Frontend in Web3: Javascript Libraries and the Ecosystem  - Amagi
介绍：
	生态介绍，库，如何开始
	开始，初入茅庐：
	上手，钱包连接，如何与 ERC20 / ERC721 协议协作对接
	实战：...待定？
	实践案例讲解，uniswap ...
Tools: 
Introduction to EVM Contract Bytecode and On-Chain Data Analysis - Chainbase-insulator
	
6.Oracle & Automation - Chainlink
Workshop 1
预言机问题
去中心化预言机
预言机计算服务
Demo：Chainlink Automation 实现 dynamic NFT

Workshop 2
跨链问题
预言机跨链服务
Demo：Chainlink CCIP 实现跨链 NFT

7.Offline Hackerhouse (北京/上海/深圳/成都多地) 



## [Github Discussion]( )使用方法

| Categories         | description                                                  |
| ------------------ | ------------------------------------------------------------ |
| [🍕Materials](https://openbuild.xyz/learn/courses/95)         | 回顾视频  |
| [🙏 Q&A](https://github.com/web3-frontend/.github/discussions/categories/q-a)              | 提问 / 答疑                                                  |
| 💡[I've got an idea!](https://github.com/web3-frontend/.github/discussions/categories/ideas)   | 关于一些 Amazing fancy ideas, 用来<br />1. web3前端共学 <br />2. 组队开发<br />3. 参加黑客松<br />4. 招聘内推<br />5. 自娱自乐🎣<br /> |



### 础推荐材料

| 介绍 | 地址 |
| --- | --- |
人文基础：
比特币之前的事情：理解组成比特币的核心技术的发展，理解比特币的前前后后，能更好的理解中本聪创造比特币的核心产物。
| 比特币前传（一）70 年代公钥传奇| [https://foresightnews.pro/article/detail/13987](https://foresightnews.pro/article/detail/13987 ) |
| 比特币前传（二）：去中心化的起源| [https://foresightnews.pro/article/detail/14114](https://foresightnews.pro/article/detail/14114) |
| 比特币前传（三）：90 年代的加密战争| [https://foresightnews.pro/article/detail/14545](https://foresightnews.pro/article/detail/14545) |
| 比特币前传（四）：跨越半个世纪的思想与蓝图 | [ttps://foresightnews.pro/article/detail/14783](https://foresightnews.pro/article/detail/14783) |
2。以太坊简史：因暴雪削弱术士而诞生的千亿美元巨兽
| 以太坊近十年的发展很难用一篇文章概括，但是可以大致浏览每一个阶段的重大突破与变化。了解 VB 创造 ETH 的时候主要想解决什么问题 | [https://foresightnews.pro/article/detail/13531](https://foresightnews.pro/article/detail/13531) |
3、加密思潮编年史，从 25 年前说起
| 快速了解加密思潮在不同时期的变化，了解到如何一步步从 BTC 走向 DAPP | [https://foresightnews.pro/article/detail/961](https://foresightnews.pro/article/detail/961) |
技术基础：
**比特币白皮书精读版**
| 比特币白皮书精读版是对比特币白皮书更详细的解读，有助于更好的理解白皮书中的内容。比特币的技术原理搞的越清楚越好。 | [https://mp.weixin.qq.com/s/eYCbAD_tPG9PmuFE1LvCWA](https://mp.weixin.qq.com/s/eYCbAD_tPG9PmuFE1LvCWA) |
**以太坊白皮书精讲 精选**
白皮书精讲系列是看懂白皮书很好的参考资料，可以更深入的了解白皮书中的细节。这是 ETH1.0 的架构，后面再看 ETH 2.0 的架构。也是搞得越清楚越好，后续的区块链整体上都没有脱离这个架构，既 Chain-VM-共识-Daap
|（Part1） | [https://zhuanlan.zhihu.com/p/37747240 ](https://zhuanlan.zhihu.com/p/37747240 ) |
|（Part2） | [https://zhuanlan.zhihu.com/p/38002875  ](https://zhuanlan.zhihu.com/p/38002875  ) |
|（Part3） | [https://zhuanlan.zhihu.com/p/38003169  ](https://zhuanlan.zhihu.com/p/38003169  ) |
**一个以太坊交易的完整周期**
|这篇文章对具体的每一个环节都有很详细的记录，跟 Daap 的开发结合非常紧密，最好能完整过一遍，然后自己尝试画一个详细的流程图。包括前端怎么跟钱包交互，钱包怎么跟 RPC 交互，节点之间怎么通信，EVM 怎么处理交易，Gas，最后存储等。| [https://www.notonlyowner.com/learn/what-happens-when-you-send-one-dai  ](https://www.notonlyowner.com/learn/what-happens-when-you-send-one-dai ) |

