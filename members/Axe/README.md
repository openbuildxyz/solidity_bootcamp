## 个人介绍

- Github: [IAm0xAxe](https://github.com/IAm0xAxe)
- Wechat ID: IAm0xAxe（solidity_bootcamp 群昵称：Axe）
- 钱包地址: 0xb694EE7881dd1c7F19dE35cEE64610835ce8DC96
 
我是Axe，初学区块链安全的小白，因为对业务逻辑的理解能力非常差，所以参加该训练营学习开发技术，以查漏补缺提升自己。

## 作业提交

1. [x] 部署一个ERC20代币 -->> [Task 1 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/tree/master/src/task1-foundry-erc20) 、 [Task 1 - Sepolia](https://sepolia.etherscan.io/tx/0x426f74e49de95f71823abc2f89a3b3315c44b62c284869161fd4be02182c732e)
2. [x] 发行一个ERC721的NFT合约 -->> [Task 2 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/tree/master/src/task2-foundry-erc721) 、 [Task 2 - Sepolia](https://sepolia.etherscan.io/tx/0x19ffe34ef826d18f037234048e51137174c7bb67a2d8196e6cdea3e9cd595d86)
3. [x] 使用foundry框架编译和测试 -->> [Task3 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/blob/master/test/task3-OurTokenTest.t.sol)

## 学习日志

> **我使用的开发框架：** Foundry
> **以及参考的学习资料：** [Lesson 10: Foundry ERC20s](https://github.com/Cyfrin/foundry-full-course-f23#lesson-10-foundry-erc20s)、[Lesson 11: Foundry NFTs | MoodNFT](https://github.com/Cyfrin/foundry-full-course-f23#lesson-11-foundry-nfts--moodnft)

**初始工作：**
1. 创建`solidity_bootcamp_tasks`文件夹，放后续阶段的Task。
2. 进入该文件，并对该文件夹进行初始化。

```bash
1. mkdir solidity_bootcamp_tasks
2. cd solidity_bootcamp_tasks/
3. forge init
```

### Task 1

> 任务1：部署一个ERC20代币

1. 写`ERC20`之前，先了解[EIP-20](https://eips.ethereum.org/EIPS/eip-20 )
2. 在写`ERC20`合约时需用到OpenZeppelin的`erc20`合约，所以需要先下载。
3. 写好`ERC20`合约后，通过`DeployOurToken.s.sol`本地部署。测试成功。
4. 最后[在真实的Sepolia 测试网中部署合约](https://www.youtube.com/watch?v=PTUk1XPPwdA&list=PL2-Nvp2Kn0FPH2xU3IbKrrkae-VVXs1vk&index=78) ，部署成功，Task 1提交。

```bash
1. forge install OpenZeppelin/openzeppelin-contracts --no-commit # 下载erc20
2. forge script script/DeployOurToken.s.sol:DeployOurToken  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast # 本地部署
3. forge script script/DeployOurToken.s.sol:DeployOurToken  --rpc-url $SEPOLIA_RPC_URL --private-key $REAL_PRIVATE_KEY --broadcast #在Sepolia部署
```

### Task 3

> 在Task1的基础编写测试，以完成学习任务3 - 测试ERC20应用。

1. Test 1：测试bob的余额
2. Test 2：测试Bob批准Alice代其使用代币 
3. **学习使用AI编写测试：** 参考我代码库中`chatGPT_prompt.txt`文件中的提示词。
4. 完成ERC20的全部测试

```bash
1. forge test --mt testBobBalance # 测试1：测试bob的余额
2. forge test --mt testAllowancesWorks # 测试2：测试Bob批准Alice代其使用代币 
```


### Task 2

> 部署一个ERC721的NFT合约

1. 了解什么是[IPFS](https://www.youtube.com/watch?v=Ytlmm_KGfso&list=PL2-Nvp2Kn0FPH2xU3IbKrrkae-VVXs1vk&index=142)，以及[EIP-721](https://eips.ethereum.org/EIPS/eip-721 )
2. 需要用到OpenZeppelin的`erc721`合约
3. 写 `basicNft.sol`，部署合约为：`DeployBasicNft.s.sol`。然后写 `Interactions.s.sol`用作交互mint，最后在Sepolia测试网中部署。

```bash
1. forge install Cyfrin/foundry-devops --no-commit # 下载Cyfrin/foundry-devops
2. forge script script/DeployBasicNft.s.sol  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast # 本地部署
3. forge script script/DeployBasicNft.s.sol  --rpc-url $SEPOLIA_RPC_URL --private-key $REAL_PRIVATE_KEY --broadcast #在Sepolia部署
4. forge script script/Interactions.s.sol  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast # 本地部署，mint
5. forge script script/Interactions.s.sol  --rpc-url $SEPOLIA_RPC_URL --private-key $REAL_PRIVATE_KEY --broadcast #在Sepolia部署，mint
```
