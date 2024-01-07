import { expect } from "chai";
import exp from "constants";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

describe("ParkingStore", function () {
  let erc6551RegistryContract: Contract;
  let erc6551AccountContract: Contract;
  let parkingNFTContract: Contract;
  let parkingStoreContract: Contract;

  beforeEach(async function () {
    //deploy ERC6551Registry
    const Erc6551Registry = await ethers.getContractFactory("ERC6551Registry");
    erc6551RegistryContract = await Erc6551Registry.deploy();

    //deploy StandardERC6551Account
    const StandardERC6551Account = await ethers.getContractFactory(
      "StandardERC6551Account"
    );
    erc6551AccountContract = await StandardERC6551Account.deploy();

    const ParkingERC721Contract = await ethers.getContractFactory(
      "ParkingERC721"
    );
    parkingNFTContract = await upgrades.deployProxy(ParkingERC721Contract);
    await parkingNFTContract.deployed();

    const ParkingStoreContract = await ethers.getContractFactory(
      "ParkingStore"
    );
    parkingStoreContract = await upgrades.deployProxy(ParkingStoreContract, [
      parkingNFTContract.address,
      erc6551RegistryContract.address,
      erc6551AccountContract.address,
    ]);
    await parkingStoreContract.deployed();
  });

  it("should be deploy", async () => {
    expect(erc6551RegistryContract).to.not.null;
    expect(erc6551AccountContract).to.not.null;
    expect(parkingNFTContract).to.not.null;
    expect(parkingStoreContract).to.not.null;

    expect(await parkingNFTContract.name()).to.equal("LotLootParking");
    expect(await parkingNFTContract.symbol()).to.equal("LLP");
  });

  it("mint parking", async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    // no auth
    await expect(parkingStoreContract.connect(addr1).mint()).to.be.reverted;
    // parking nft contract grant role to parking store contract
    parkingNFTContract
      .connect(owner)
      .grantRole(ethers.utils.id("MINTER_ROLE"), parkingStoreContract.address);

    expect(await parkingStoreContract.connect(addr1).mint()).to.emit(
      parkingStoreContract,
      "ParkingMint"
    );
    expect(await parkingNFTContract.balanceOf(addr1.address)).to.equal(1);
    const tokenId = await parkingNFTContract.tokenOfOwnerByIndex(
      addr1.address,
      0
    );
    expect(tokenId).not.null;
    expect(tokenId.toNumber()).to.equal(1000);

    await parkingStoreContract.connect(addr2).mint();
    expect(await parkingNFTContract.balanceOf(addr2.address)).to.equal(1);
    const tokenId2 = await parkingNFTContract.tokenOfOwnerByIndex(
      addr2.address,
      0
    );
    expect(tokenId2).not.null;
    expect(tokenId2.toNumber()).to.equal(1001);

    //6551 account
    const accountAddress = await erc6551RegistryContract.account(
      erc6551AccountContract.address,
      1337,
      parkingNFTContract.address,
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
      expect(token.tokenContract).to.equal(parkingNFTContract.address);
      expect(token.tokenId).to.equal(1000);
    });

    // single address limit 5 parking nft
    await parkingStoreContract.connect(addr1).mint(); // 2
    await parkingStoreContract.connect(addr1).mint();
    await parkingStoreContract.connect(addr1).mint();
    await parkingStoreContract.connect(addr1).mint();

    expect(await parkingNFTContract.balanceOf(addr1.address)).to.equal(5);
    const tokenIdLast = await parkingNFTContract.tokenOfOwnerByIndex(
      addr1.address,
      4
    );
    expect(tokenIdLast).equal(1005);
    await parkingStoreContract.connect(addr1).mint();
    await expect(parkingStoreContract.connect(addr1).mint()).to.be.revertedWith(
      "Max NFT limit reached"
    );
  });

  it("mint max parking", async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    parkingNFTContract
      .connect(owner)
      .grantRole(ethers.utils.id("MINTER_ROLE"), parkingStoreContract.address);

    expect(await parkingStoreContract.connect(addr1).mintMax()).to.emit(
      parkingStoreContract,
      "ParkingMintMax"
    );
    expect(await parkingNFTContract.balanceOf(addr1.address)).to.equal(5);
  });
});
