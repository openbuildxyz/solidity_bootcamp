const { ethers } = require('hardhat')

async function main() {
  const factory = await ethers.getContractFactory('ERC721Token')
  const contract = await factory.deploy('YNH', 'YNH')
  await contract.waitForDeployment()
  console.log('Contract deployed to:', contract.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
