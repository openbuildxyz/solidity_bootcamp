### anvil
1. `anvil`
**启动本地区块链**
---
### forge
1. `forge init`
**初始化 `foundry`开发模板**

2. `forge i 包名 --no-commit`
**安装依赖（可能需要走终端代理，否则安装时可能会超时或者有部分包体未下载下来**

3. `forge create 合约名 —rpc-url rpc端口 —private-key 合约部署者的私钥地址`
**部署合约**

4.  `forge script 脚本所在路径 --rpc-url rpc端口 --broadcast —private-key 合约部署者的私钥地址`
**通过脚本部署合约**

5. `forge test`
**本地网络单元测试**

6. `forge test --mt 函数名`
**测试某个具体函数（其余命令通过 `forge test —help`查看）**

7. `forge test —fork-url $RPC_URL`
**测试网单元测试**

8. `forge coverage`
**查看测试覆盖率**

9. `forge coverage --report debug > coverage.txt`
**生成 gas 消耗快照 可以用`—mt` 匹配某个具体函数**

    ---
### cast

1. `cast —to-base 待处理数据 需要转换到的格式`
**[将一种进制的数转换为另一种进制的数](https://book.getfoundry.sh/reference/cast/cast--to-base)**

2. `cast send 合约地址 “合约函数签名” 合约参数 —rpc-url $RPC_URL —private-key $PRIVATE_KEY`
**写入合约函数（因为改变了链上状态，所以必须传递私钥签名）。**

3. `cast call 合约地址 “合约函数签名”`
**读取合约函数（需要注意的是，尽管 `cast call` 命令不会修改合约状态，但它仍然可以读取 Solidity 合约中的所有函数，包括修改状态的函数。因此，在调用修改状态的函数时会收到报错）。所以不需要传递私钥进行签名。**

4. `cast tx 交易哈希`
**查看交易信息**

### 其余命令

1. `source .env` ----> `echo $PRIVATE_KEY`
**将文件注入到 shell 中，可以在命令行通过 `echo` 查看到，还可以通过$变量名来使用**

2. `history -c`
**销毁命令行历史记录(保护私钥的操作）**

3. `sudo npx thirdweb deploy`
**安全部署合约而不会留下任何信息（避免私钥泄露），更多这方面的信息查看 [thirdweb 官网](https://thirdweb.com/)**

    ---
### chisel

> **终端中可以输入 `Solidity` 代码，类似于浏览器的控制台**

### 一些web3 开发时常用到的库/工具



1. [foundry-devops](https://github.com/Cyfrin/foundry-devops)
**用于和合约进行交互时获取最近部署的合约，需要注意一点 `forge install` 需要开启Clash 的增强模式走终端代理**

2. [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)
**最全且应用最广泛的智能合约开发库**


3. [solmate](https://github.com/transmissions11/solmate)
**相比于 openzeppelin，solmate 更加现代化，更注重对于 gas 的优化**

4. [wagmi](https://wagmi.sh/)
**一个用于前端和链上进行交互的 hooks 库，基于 React Hooks 开发**

5. [RainbowKit](https://www.rainbowkit.com/zh-CN/docs/introduction)
**RainbowKit 是一个 [React](https://reactjs.org/)库，可以轻松地将钱包连接添加到您的dapp。 它直观、响应迅速且可自定义。**

6. Todo......