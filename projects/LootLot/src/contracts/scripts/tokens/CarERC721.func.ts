import { ethers } from "hardhat";

async function getContract() {
  const contract = await ethers.getContractAt(
    "CarERC721",
    // "0x4DDbF5Ddf8819dE761fC708F8A522D341E03cBE5"
    "0x51e49799490A4469fb73edFC09822b3b566cE445"
  );
  const [owner] = await ethers.getSigners();

  return contract.connect(owner);
}

async function grantRole() {
  const contract = await getContract();

  //grant minter role to default caller
  const tx = await contract.grantRole(
    ethers.utils.id("MINTER_ROLE"),
    // "0x25ea0Cd74A37b5Ff129BdE58EFff87c00338Fe20"
    "0x861eC40cF915A2036617272a81ed16b339952E51"
  );
  const receipt = await tx.wait();
  console.log(receipt);
  console.log("Auth CarStore", "done!");
}

async function main() {
  await grantRole();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
