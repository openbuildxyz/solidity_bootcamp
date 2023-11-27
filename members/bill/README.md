# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

npx hardhat myDeploy --name OpenBuildERC20 --args "[]"

部署结果:
deploy OpenBuildERC20, operator:0x63fD2cbE6d245475e9125FFcF6548729D311A73a, args:"[]"
Contract deployed to: 0x7B2BE1a617Da84eE5735F7cD0eC0676CDaE5410a


npx hardhat myDeploy --name OpenBuildERC721 --args "[]"

部署结果:
deploy OpenBuildERC721, operator:0x63fD2cbE6d245475e9125FFcF6548729D311A73a, args:"[]"
Contract deployed to: 0x33DCf616228Ef53089A5322EBbfb68DE32E2b8dA
```

