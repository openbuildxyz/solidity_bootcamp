# Personal Profile

Github: https://github.com/yh515511038

Wallet Address: 0x4c86BD6A356b87880cD8f5553aFD94873d3E78B1

Tags: DBA, Python, Web(junior level)



# Course Tasks

## 任务1 - 部署一个 ERC20 代币

### 1.1 准备开发环境

#### 1.1.1 更新 package

```sh
root@ubuntu-s-1vcpu-1gb-sfo3-01:~# sudo apt-get update

root@ubuntu-s-1vcpu-1gb-sfo3-01:~# sudo apt-get upgrade
```



#### 1.1.2 安装 NPM

```sh
# npm
root@ubuntu-s-1vcpu-1gb-sfo3-01:~# sudo apt-get install npm
root@ubuntu-s-1vcpu-1gb-sfo3-01:~# npm -v
8.19.4
```



#### 1.1.3 安装 NodeJS

[安装指引](https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions)

```sh
# 1.Download and import the Nodesource GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# 2.Create deb repository
NODE_MAJOR=20	# available major version: 16/18/20/21
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# 3.Run Update and Install
sudo apt-get update
sudo apt-get install nodejs -y

## 如果之前安装过旧版本会报错
trying to overwrite '/usr/include/node/common.gypi', which is also in package libnode-dev 12.22.9~dfsg-1ubuntu3.2
## 卸载对应package
sudo dpkg --remove --force-remove-reinstreq libnode-dev
sudo dpkg --remove --force-remove-reinstreq libnode72:amd64
```



#### 1.1.4 Clone 代币合约

```sh
root@ubuntu-s-1vcpu-1gb-sfo3-01:~# git clone https://github.com/meterio/tokenERC20
root@ubuntu-s-1vcpu-1gb-sfo3-01:~# cd tokenERC20
```



#### 1.1.5 安装 Hardhat

```sh
## 修改依赖
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# vim package.json
  "dependencies": {
    "@chainlink/contracts": "^0.5.1",
    "@chainlink/contracts-ccip": "^0.0.0",
    "@nomiclabs/hardhat-etherscan": "^3.1.0",		# 需确认
    "@nomiclabs/hardhat-waffle": "^2.0.3",			# 需确认
    "@nomiclabs/hardhat-web3": "^2.0.0",
    "@openzeppelin/contracts": "^4.7.3",
    "@typechain/ethers-v5": "^4.0.0",
    "@types/chai": "^4.2.6",
    "@types/mocha": "^5.2.7",
    "chai": "^4.2.0",
    "colors.ts": "^1.0.20",
    "decimal.js": "^10.2.1",
    "dotenv": "^10.0.0",
    "eth-sig-util": "^3.0.1",
    "ethereum-waffle": "^2.2.0",
    "hardhat-typechain": "^0.3.5",
    "mocha": "^10.2.0",
    "mocha-chai-jest-snapshot": "^1.1.0",
    "prettier": "^2.0.5",
    "prettier-plugin-solidity": "^1.0.0-alpha.59",
    "solc": "^0.7.6",
    "solhint": "^3.2.1",
    "solhint-plugin-prettier": "^0.0.5",
    "ts-generator": "^0.1.1",
    "ts-node": "^8.5.4",
    "typechain": "^4.0.0",
    "typescript": "^3.7.3",
    "undici": "^5.12.0",
    "web3": "^4.2.2"
  },
    
  "devDependencies": {
    "@nomiclabs/hardhat-ethers": "^2.2.1",				# 需确认
    "@openzeppelin/contracts-upgradeable": "^4.8.2",
    "@openzeppelin/hardhat-upgrades": "^1.12.0",
    "eslint": "^7.32.0",
    "eslint-config-standard": "^16.0.3",
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-mocha-no-only": "^1.1.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^5.1.0",
    "ethers": "^5.5.4",
    "hardhat": "^2.19.1",
    "hardhat-deploy": "^0.11.12",
    "prettier": "^2.4.1",
    "prettier-plugin-solidity": "^1.0.0-beta.18"
  }

root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# npm install --save-dev hardhat
```



### 1.2 选择区块链

#### 1.2.1 [查询 RPC 配置节点](Chainlist.org)

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-6.png" alt="0-basic-6" style="zoom:67%;" />

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-9.png" alt="0-basic-9" style="zoom:50%;" />

#### 1.2.2 区块浏览器

用来查询区块交易、合约等信息。

​	meter：[Meter | Explorer](https://scan.meter.io/)

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-5.png" alt="0-basic-5" style="zoom:67%;" />



#### 1.2.3 [从测试网获取代币](https://docs.meter.io/developer-documentation/introduction)

​	1.登录[Faucet for Testnet](https://faucet-warringstakes.meter.io/)，输入钱包地址（metamask）；

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-7.png" alt="0-basic-7" style="zoom:50%;" />

2.点击"Claim Now"：

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-8.png" alt="0-basic-8" style="zoom:50%;" />



### 1.3 部署代币

#### 1.3.1 配置环境变量

```sh
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# cp .env.sample .env
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# cat "METER_TEST_PRIVKEY='<YOUR-PRIVKEY>'" >> .env
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# cat "MAINNET_CONTRACT_ADMIN_PRIVKEY='<YOUR-PRIVKEY>'" >> .env
```



#### 1.3.2 配置代理地址&端口（可选）

```sh
# 如果使用代理，需要修改对应端口，否则直接注释
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# vim +37 hardhat.config.ts
const { setGlobalDispatcher, ProxyAgent } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");		# 代理地址&端口
setGlobalDispatcher(proxyAgent);
```



#### 1.3.3 安装部署

```sh
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# npm install


root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# npm run compile
> my-token@1.0.0 compile
> hardhat compile
Downloading compiler 0.8.19
... ...
Compiled 80 Solidity files successfully (evm target: paris).
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!


# npx hardhat deploy --name "<代币名称>" --symbol "<代币符号/标志>" --suply <代币发行个数> --owner <发行人address> --network metertest
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# npx hardhat deploy --name "solidity boot camp" --symbol "solBoot" --supply 100000000000000000000 --owner 0x4c86BD6A356b87880cD8f5553aFD94873d3E78B1 --network metertest
Nothing to compile
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
Deploying: ERC20MintablePauseable
  to 0xabEd0731cddf8202228eC9d1044C153D83eBE2d1		# 代币地址
  in 0x6018f5b9a5135f5ee62bc4be72aff337d22afd777c6ed569fa79735700baaf30	# 代币交易hash_id
# 注：代币发行个数的单位是Wei，10的-18次方(1e-18)
```



### 1.4 后续验证操作

#### 1.4.1 查询交易信息

使用代币交易的 hash_id 在[区块浏览器](scan.meter.io)中查询：

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-11.png" alt="0-basic-11" style="zoom:50%;" />



#### 1.4.2 验证合约

点击部署的代币 **solBoot**，验证合约（如果未验证，需要先选择当前部署的合约，再做手动验证）：

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-12.png" alt="0-basic-12" style="zoom:50%;" />

```sh
# 包含智能合约所有信息的json文件
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# cd artifacts/build-info
root@ubuntu-s-1vcpu-1gb-sfo3-01:~/tokenERC20# ls *.json
-rw-r--r-- 1 root root 9828258 Nov 29 08:04 734e7dfe9edb78c6d96dd1b2c0a99911.json
```



#### 1.4.3 导入 token

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-13.png" alt="0-basic-13" style="zoom:50%;" />

<img src="images\0-basic-14.png" alt="0-basic-14" style="zoom:50%;" />

<img src="https://github.com/yh515511038/solidity_bootcamp/blob/main/studyNotes/yh515511038/images/0-basic-15.png" alt="0-basic-15" style="zoom:50%;" />

