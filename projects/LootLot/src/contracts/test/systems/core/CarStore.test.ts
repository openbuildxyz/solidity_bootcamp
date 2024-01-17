import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

describe("CarStore", function () {
  let erc6551RegistryContract: Contract;
  let erc6551AccountContract: Contract;
  let carNFTContract: Contract;
  let carStoreContract: Contract;

  beforeEach(async function () {
    //deploy ERC6551Registry
    const Erc6551Registry = await ethers.getContractFactory("ERC6551Registry");
    erc6551RegistryContract = await Erc6551Registry.deploy();

    //deploy StandardERC6551Account
    const StandardERC6551Account = await ethers.getContractFactory(
      "StandardERC6551Account"
    );
    erc6551AccountContract = await StandardERC6551Account.deploy();

    const CarERC721Contract = await ethers.getContractFactory("CarERC721");
    carNFTContract = await upgrades.deployProxy(CarERC721Contract);
    await carNFTContract.deployed();

    const CarStoreContract = await ethers.getContractFactory("CarStore");
    carStoreContract = await upgrades.deployProxy(CarStoreContract, [
      carNFTContract.address,
      erc6551RegistryContract.address,
      erc6551AccountContract.address,
    ]);
    await carStoreContract.deployed();
  });

  it("should be deploy", async () => {
    expect(erc6551RegistryContract).to.not.null;
    expect(erc6551AccountContract).to.not.null;
    expect(carNFTContract).to.not.null;
    expect(carStoreContract).to.not.null;

    expect(await carNFTContract.name()).to.equal("LotLootCar");
    expect(await carNFTContract.symbol()).to.equal("LLC");
  });

  it("mint car", async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    // no auth
    await expect(carStoreContract.connect(addr1).mint()).to.be.reverted;
    // car nft contract grant role to car store contract
    carNFTContract
      .connect(owner)
      .grantRole(ethers.utils.id("MINTER_ROLE"), carStoreContract.address);

    expect(await carStoreContract.connect(addr1).mint()).to.emit(
      carStoreContract,
      "CarMint"
    );
    expect(await carNFTContract.balanceOf(addr1.address)).to.equal(1);
    const tokenId = await carNFTContract.tokenOfOwnerByIndex(addr1.address, 0);
    expect(tokenId).not.null;
    expect(tokenId.toNumber()).to.equal(1000);

    await carStoreContract.connect(addr2).mint();
    expect(await carNFTContract.balanceOf(addr2.address)).to.equal(1);
    const tokenId2 = await carNFTContract.tokenOfOwnerByIndex(addr2.address, 0);
    expect(tokenId2).not.null;
    expect(tokenId2.toNumber()).to.equal(1001);

    //6551 account
    const accountAddress = await erc6551RegistryContract.account(
      erc6551AccountContract.address,
      1337,
      carNFTContract.address,
      tokenId.toNumber(),
      tokenId.toNumber()
    );

    const accountContract1 = await ethers.getContractAt(
      "StandardERC6551Account",
      accountAddress
    );
    expect(accountContract1).not.null;

    await accountContract1.token().then((token) => {
      expect(token.chainId).to.equal(1337);
      expect(token.tokenContract).to.equal(carNFTContract.address);
      expect(token.tokenId).to.equal(1000);
    });
  });
});
