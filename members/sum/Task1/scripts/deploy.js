// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

   const FakeUSDT = await ethers.getContractFactory("FakeUSDT");
   const fakeUSDT = await FakeUSDT.deploy();
   console.log(fakeUSDT.address);
   //await fakeUSDT.deployTransaction.wait(); // 等待合约部署完成
   console.log("fakeUSDT address:" , fakeUSDT.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
