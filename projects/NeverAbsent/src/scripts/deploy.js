// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
  // 获取默认的以太坊提供商
  const provider = ethers.provider;
  const fakeUSDT = "0x6c0339c71fff8f1ff0629ac763782295040c9f3e";

  const block = await provider.getBlock();
  const blockTime = block.timestamp;
  endTime = blockTime + 24 * 3600 * 14;
  console.log("blockTime: " + blockTime);
  const Checkpoint = await ethers.getContractFactory("Checkpoint");
  checkpoint = await Checkpoint.deploy(fakeUSDT, blockTime, endTime, ethers.parseEther("2000"));
  console.log("checkpoint Address:" + checkpoint.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
