## 个人介绍

- Github: [IAm0xAxe](https://github.com/IAm0xAxe)
- Wechat ID: IAm0xAxe（solidity_bootcamp 群昵称：Axe）
- 钱包地址: 0xb694EE7881dd1c7F19dE35cEE64610835ce8DC96

初学区块链安全的小白，因为对业务逻辑的理解能力非常差，所以参加该训练营学习开发技术，查漏补缺提升自己。

## 作业提交

1. [x] 部署一个ERC20代币 -->>  [Task 1 - Sepolia](https://sepolia.etherscan.io/tx/0x426f74e49de95f71823abc2f89a3b3315c44b62c284869161fd4be02182c732e)
2. 发行一个ERC721的NFT合约 -->> [Task2]()
3. 使用foundry框架编译和测试 -->> [Task3]()

## 学习日志

> **使用的开发框架：** Foundry
> **参考的学习资料：** [Lesson 10: Foundry ERC20s](https://github.com/Cyfrin/foundry-full-course-f23#lesson-10-foundry-erc20s)、[Lesson 11: Foundry NFTs | MoodNFT](https://github.com/Cyfrin/foundry-full-course-f23#lesson-11-foundry-nfts--moodnft)

**初始工作：**
1. 创建solidity_bootcamp_tasks文件夹，放后续阶段的Task。
2. 进入该文件，并对solidity_bootcamp_tasks文件夹进行初始化。

```bash
1. mkdir solidity_bootcamp_tasks
2. cd solidity_bootcamp_tasks/
3. forge init
```

### Task 1

1. 首先了解[EIP-20](https://eips.ethereum.org/EIPS/eip-20 )
2. 写合约时需用到OpenZeppelin的`erc20`合约，所以需要先下载。
3. 写好`ERC20`合约后，通过`task1-DeployOurToken.s.sol`进行部署。
4. 最后[在真实的Sepolia 测试网中部署合约](https://www.youtube.com/watch?v=PTUk1XPPwdA&list=PL2-Nvp2Kn0FPH2xU3IbKrrkae-VVXs1vk&index=78) ，最后部署成功。作业提交1。

```bash
1. forge install OpenZeppelin/openzeppelin-contracts --no-commit # 下载erc20
2. forge script script/DeployOurToken.s.sol:DeployOurToken  --rpc-url $SEPOLIA_RPC_URL --private-key $REAL_PRIVATE_KEY --broadcast #在Sepolia部署ERC20
```
