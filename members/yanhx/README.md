# 个人介绍

Github: https://github.com/yanhx

Wechat ID: yanhx9558
Wechat Name: Ryan

Discord ID: crypto_ryan

wallet address: 0x498295c74023bc5415C255F81F5F0ACe949afbe0

Hi everyone, I'm Ryan from Singapore. Currently working on 2 web3 projects, (1) Opencord, a communication platform for DAOs; (2) REET, a physical RWA project for natural resources. I have a background in TradFi. 


## 作业提交
(code is inside this folder)

Task1 ERC20: src/MyERC20.sol
- Deployment: https://sepolia.etherscan.io/address/0xcf9a3ce9f056d5e642b57577ce1f7b02414a170f

Task2 ERC721: src/MyERC721.sol
- Deployment: https://sepolia.etherscan.io/address/0x58480c2ae521ab7c50e1bb257035245387bfd5bd

Task3 foundry tests: test/unit/MyERC20Test.t.sol


## 安全检测 任务
1. SafeMath 库在Solidity 0.8版本之后不需要了，编译器可以自动处理overflow，underflow。建议去除SafeMath.sol依赖，并改为基本数学操作
2. uniswapV2Pair, usdtAddr，birdWallet, monkeyWallet, foundationWallet, technologyWallet,marketingWallet 变量建议改为immutable, 其值在合约内从未被修改
3. MAX_SUPPLY， LP_SUPPLY， OTHER_SUPPLY的值建议改写成 81_000_000 ether 形式以符合代码风格
4. startTime 的作用仅为识别是否是首次添加流动性，可以用一个bool变量替代
5. constructor, receive, addInitLiquidity 均为 payable函数，但没有函数能将ether取出
6. 在construtor中，缺少对传入的地址参数 是否为0 的检测
7. 在 addInitLiquidity函数中 IERC20(usdtAddr).approve ， uniswapV2Router.addLiquidity 的调用的返回值被忽略
8. 在 sellTokenAndFees 和 buyTokenAndFees函数中，各类amount的计算应向上取整而不是向下取整，应向有利于合约而不是有利于用户的方向取整
9. 在 sellTokenAndFees 和 buyTokenAndFees函数中 swapFeeTotal只是被计算，而对应的token没有从from地址转入此合约地址
10. 在 buyTokenAndFees 函数中 burnAmount 没有从转账数额中扣除
11. swapFeeTotal 为积累的待分配手续费收入，所以分配的额度之和不应该超过swapFeeTotal，现在在distributeFee函数中分配额为6倍swapFeeTotal
12. addLiquidity 私有函数 从未在合约中被使用，应该去掉