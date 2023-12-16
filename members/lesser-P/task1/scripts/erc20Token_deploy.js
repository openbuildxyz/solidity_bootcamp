require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  //how to deploy ERC20Token
  const ERC20Token = await ethers.getContractFactory('ERC20Token')
  const contract = await ERC20Token.deploy('YNH', 'YNH')
  await contract.waitForDeployment()
  console.log('ERC20Token deployed to:', contract.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
