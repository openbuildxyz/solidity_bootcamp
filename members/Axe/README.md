## 个人介绍

- Github: [IAm0xAxe](https://github.com/IAm0xAxe)
- Wechat ID: IAm0xAxe（solidity_bootcamp 群昵称：Axe）
- 钱包地址: 0xb694EE7881dd1c7F19dE35cEE64610835ce8DC96

我是Axe，初学区块链安全的小白，因为对业务逻辑的理解能力非常差，所以参加该训练营学习开发技术，以查漏补缺提升自己。

## 作业提交

**Phase 1**
1. [x] 部署一个ERC20代币 -->> [Task 1 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/tree/master/src/task1-foundry-erc20) 、 [Task 1 - Sepolia](https://sepolia.etherscan.io/tx/0x426f74e49de95f71823abc2f89a3b3315c44b62c284869161fd4be02182c732e)
2. [x] 发行一个ERC721的NFT合约 -->> [Task 2 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/tree/master/src/task2-foundry-erc721) 、 [Task 2 - Sepolia](https://sepolia.etherscan.io/tx/0x19ffe34ef826d18f037234048e51137174c7bb67a2d8196e6cdea3e9cd595d86)
3. [x] 使用foundry框架编译和测试 -->> [Task3 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/blob/master/test/task3-OurTokenTest.t.sol)

****

**Phase 2**
1. [x] 任务 1 - 分析token并对区块进行安全检测 -->> [Phase2 - Task1 - Code](https://github.com/IAm0xAxe/solidity_bootcamp_Tasks/tree/master/src/phase2_task1)
    - 分析链上BNB链上token并Fork高度26793740的区块进行安全测试 0xddc0cff76bcc0ee14c3e73af630c029fe020f907 


## 学习日志

### Phase 1

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

#### Task 1

1. 写`ERC20`之前，先了解[EIP-20](https://eips.ethereum.org/EIPS/eip-20 )
2. 在写`ERC20`合约时需用到OpenZeppelin的`erc20`合约，所以需要先下载。
3. 写好`ERC20`合约后，通过`DeployOurToken.s.sol`本地部署。测试成功。
4. 最后[在真实的Sepolia 测试网中部署合约](https://www.youtube.com/watch?v=PTUk1XPPwdA&list=PL2-Nvp2Kn0FPH2xU3IbKrrkae-VVXs1vk&index=78) ，部署成功，Task 1提交。

```bash
1. forge install OpenZeppelin/openzeppelin-contracts --no-commit # 下载erc20
2. forge script script/DeployOurToken.s.sol:DeployOurToken  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast # 本地部署
3. forge script script/DeployOurToken.s.sol:DeployOurToken  --rpc-url $SEPOLIA_RPC_URL --private-key $REAL_PRIVATE_KEY --broadcast #在Sepolia部署
```

#### Task 3

> 在Task1的基础编写测试，以完成学习任务3 - 测试ERC20应用。

1. Test 1：测试bob的余额
2. Test 2：测试Bob批准Alice代其使用代币 
3. **学习使用AI编写测试：** 参考我代码库中`chatGPT_prompt.txt`文件中的提示词。
4. 完成ERC20的全部测试

```bash
1. forge test --mt testBobBalance # 测试1：测试bob的余额
2. forge test --mt testAllowancesWorks # 测试2：测试Bob批准Alice代其使用代币 
```

#### Task 2

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


### Phase 2 

#### Task 1

1. 在BNB链上找到我们需要安全测试的合约： https://bscscan.com/token/0xddc0cff76bcc0ee14c3e73af630c029fe020f907#code -->> `ASET.sol`
2. 该合约中的内容，可以进行拆分。`libs、interfaces`文件夹，分别放对应的合约
3. 为了编译成功。需要安装OpenZeppelin v4.6.0 版本。`forge install OpenZeppelin/openzeppelin-contracts@v4.6.0 --no-commit`
4. 使用AI对`ASET.sol`主合约进行分析。【**注意：AI只是辅助！！！**】
    - 提供的Solidity代码定义了一个名为`AEST`的智能合约，它是一个具有附加功能的ERC20代币。根据有关在BscScan.com上验证的注释，它被设计为在币安智能链（BSC）上运行。该合约使用了OpenZeppelin的ERC20和Ownable合约，以及与Uniswap V2交互的接口和库。
    - 以下是合约的功能和潜在安全考虑的详细说明：
        1. **代币经济模型**：合约定义了最大供应量（`MAX_SUPPLY`）为8100万个代币，其中500万个（`LP_SUPPLY`）可能用于提供流动性，剩下的7600万个（`OTHER_SUPPLY`）用于其他目的。
        2. **流动性配对创建**：在合约构建期间，在AEST代币和USDT之间创建了一个Uniswap V2流动性配对。
        3. **初始铸币和转账**：合约将最大供应量铸造给自身，然后将`OTHER_SUPPLY`转账给合约部署者。
        4. **流动性提供**：`addInitLiquidity`函数允许所有者在`startTime`检查通过时向Uniswap配对添加初始流动性。
        5. **自动做市商（AMM）配对管理**：合约可以将某些配对指定为AMM配对，这会影响资金转移的处理方式。
        6. **转账覆盖**：`_transfer`函数被覆盖，包括了在通过AMM配对购买或出售代币时的自定义逻辑。它包含了燃烧机制和费用分配逻辑。
        7. **费用分配**：`distributeFee`函数允许将收集到的费用分配给预定义的钱包。
        8. **潜在的安全漏洞和注意事项**：
           - **中心化风险**：合约是`Ownable`的，所有者拥有特殊权限，如添加流动性和设置AMM配对。如果所有者的账户被攻击，这种集中控制可能带来风险。
           - **重入风险**：`addInitLiquidity`和`distributeFee`函数与外部合约（Uniswap V2路由器）交互，但似乎没有重入保护。然而，由于它们不直接转移ETH，只与路由器交互，风险可能较小。
           - **缺乏滑点保护**：`addLiquidity`函数没有强制执行任何滑点保护，最小金额设置为0。
           - **单次使用函数**：由于`startTime`检查，`addInitLiquidity`函数只能调用一次。这是一个设计选择，但可能被视为限制。
           - **费用分配**：`distributeFee`函数没有检查合约是否有足够的余额来分配，如果余额不足，可能导致交易失败。
           - **燃烧机制**：燃烧机制减少了总供应量，可能影响代币的价格。重要的是确保这不能被利用。
           - **硬编码的钱包地址**：合约中有硬编码的地址用于费用分配，如果其中任何地址被攻击或丢失，可能会成为故障点。
           - **授权双花**：合约似乎没有保护免受ERC20“approve”双花问题的影响，调用两次“approve”可能导致意外的津贴更改。
    - 总体而言，该合约在标准ERC20代币的基础上引入了几个功能，如费用收集和分配，以及燃烧机制。然而，它也将控制权集中在所有者手中，并具有硬编码的元素，可能成为故障点或安全风险。关键是确保所有者的权限得到安全管理，并且硬编码的地址由可信方控制。
5. **自己分析发现可能存在的风险：**
    1. 该合约未做重入保护，建议使用。
    2. owner的中心化风险
    3. **Liquidity**硬编码零地址：在 `addInitLiquidity` 和 `addLiquidity` 函数中，流动性的接收者是硬编码的零地址。
    4. 缺乏对`distributeFee`的访问控制：该函数直接使用`public`，应该对该函数做访问控制。
    5. 使用了多余的`SafeMath`: 在Solidity 0.8版本中，溢出检查是内置的，因此使用SafeMath库可能是不必要的
    6. 关键功能缺失：该合约有转账功能，但是却没有提取功能。这不符合业务逻辑。如果资金被错误地发送到该合约，可能会导致资金被锁定。
   
