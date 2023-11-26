# Solidity 入门

> 一门面向合约的、为实现智能合约而创建的高级编程语言

## 什么是智能合约？

- 智能合约是 **运行在链上** 的程序
- **合约开发者** 可以通过智能合约实现与链上资产、数据进行交互
- **用户** 可以通过自己的链上账户来调用合约、访问资产与数据
  
## Solidity

- 一门 **面向合约、为是心啊智能合约二创建的高级编程语言**
- 在 EVM 虚拟机上运行 —— EVM 如何运行的，solidity 如何运行的
- 语法整体类似于 JavaScript
- 是目前最流行的智能合约语言
- 也是入门区块链与 Web3 所必须掌握的语言

## 与一般程序的差异

- 原生支持资产流动
- 部署与后续写入需要一定费用
- 存储数据的成本更高
- 部署后无法更改（可升级合约？）

## 如何部署智能合约

Solidity 合约是以 .sol 为后缀的文件，无法直接执行，需要编译为 EVM(Ethereum Virtual Machine) 可识别的字节码才能在链上运行。

.sol --> complile --> Contract Bytecode --> deploy --> Ethereum (Contract)

开发框架：Browine(python) Hardhat(javascript) Foundry(solidity)

开发工具：Remix IDE Ganache/Anvil Others

## Solidity 核心语法

### 数据类型

boolean

int

uint

**address**

bytes

...

