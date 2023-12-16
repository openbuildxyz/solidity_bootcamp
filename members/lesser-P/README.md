# 个人介绍

Github: [https://github.com/lesser-P](https://github.com/lesser-P)

Wechat ID: Ye13185999712

Discord ID: 1120632081802875024

钱包地址: 0x909523711be4358Fa11d1d9c7EfD2041Eef686c9

刚毕业的 java 开发，有点合约开发经验，希望黑客松能学到新东西，（web3 工作怎么有点难找啊

## 作业提交

### 第一阶段

[Task1](/members/lesser-P/task1/Task.md#task-1)
[Task2](/members/lesser-P/task2/Task.md#task-1)
[Task3](/members/lesser-P/task3/Task.md#task-1)

### 第二阶段

#### Task1 合约存在的部分安全问题

没有访问控制：foundationWallet、technologyWallet 和 marketingWallet 这些状态变量是公开的，任何人都可以读取它们。虽然这不一定是一个问题，但如果这些钱包地址应该保密，那么这就是一个安全问题。

没有检查地址的有效性：在构造函数中，合约接收五个钱包地址并存储它们，但没有检查这些地址是否有效。如果传入的是一个零地址，那么这可能会导致问题。

没有检查合约的余额：在 addInitLiquidity 函数中，合约的所有者可以添加初始流动性，但函数没有检查合约的余额是否足够。

可能的重入攻击：receive 函数是一个空的回退函数，它允许合约接收以太币。如果这个函数被恶意调用，可能会导致重入攻击。

没有限制谁可以调用 addInitLiquidity 函数：虽然这个函数有一个 onlyOwner 修饰符，但在你给出的代码片段中，并没有看到这个修饰符的定义。如果任何人都可以调用这个函数，那么这就是一个安全问题。

#### Task2 钱包 UI

[Wallet](/members/lesser-P/walletUI/wallet.png)
[Network](/members/lesser-P/walletUI/net.png)

### 第三阶段

#### Task1 DataFeedTask

https://sepolia.etherscan.io/address/0xcFD196Dfd4418eb4Dad91017ADf681b5121e1113#readContract

#### Task2 VRFTask

https://sepolia.etherscan.io/address/0x54e619aa34a4df4df1d9e4f3f747adeffa337387

#### Task3 AutomationTask

https://sepolia.etherscan.io/address/0x6E13b9576EacF61212aEdc93B2F36cebc87c3092#code

## 学习日志

[第一课笔记](journal/1.md)
