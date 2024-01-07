import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("StandardERC6551Account", function () {
  let erc6551Registry: Contract;
  let standardERC6551Account: Contract;
  let testToken721: Contract;

  let chainId: number;

  beforeEach(async function () {
    //deploy ERC6551Registry
    const Erc6551Registry = await ethers.getContractFactory("ERC6551Registry");
    erc6551Registry = await Erc6551Registry.deploy();

    //deploy StandardERC6551Account
    const StandardERC6551Account = await ethers.getContractFactory(
      "StandardERC6551Account"
    );
    standardERC6551Account = await StandardERC6551Account.deploy();

    const TestToken721 = await ethers.getContractFactory("TestToken721");
    testToken721 = await TestToken721.deploy();

    chainId = await ethers.provider.getNetwork().then((res) => {
      return res.chainId;
    });
  });
  it("should be deployed", async function () {
    expect(erc6551Registry.address).to.not.equal(null);
  });

  async function createAccount(
    userAddress: string,
    userChainId?: number,
    tokenId?: number
  ): Promise<string> {
    //mint a token to owner
    const [owner] = await ethers.getSigners();
    await testToken721.connect(owner).safeMint(userAddress);
    const accountChainId = userChainId || chainId;

    const salt = ethers.utils.id("mySalt");
    const accountAddress = await erc6551Registry.account(
      standardERC6551Account.address,
      accountChainId,
      testToken721.address,
      tokenId || 0,
      salt
    );

    //create a new account
    await erc6551Registry.createAccount(
      standardERC6551Account.address,
      accountChainId,
      testToken721.address,
      tokenId || 0,
      salt,
      []
    );

    return accountAddress;
  }

  describe("token", function () {
    it("should be get token info", async function () {
      //mint a token to owner
      const [owner] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address);

      //get token info
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      await accountContract.token().then((token) => {
        expect(token.chainId).to.equal(chainId);
        expect(token.tokenContract).to.equal(testToken721.address);
        expect(token.tokenId).to.equal(0);
      });

      //deploy another token
      const accountAddress1 = await createAccount(owner.address, undefined, 1);

      //get token info
      const accountContract1 = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress1
      );

      await accountContract1.token().then((token) => {
        expect(token.chainId).to.equal(chainId);
        expect(token.tokenContract).to.equal(testToken721.address);
        expect(token.tokenId).to.equal(1);
      });
    });
  });

  describe("owner", function () {
    it("should be get owner", async function () {
      //mint a token to owner
      const [owner] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address);

      //get owner
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      await accountContract.owner().then((res) => {
        expect(res).to.equal(owner.address);
      });
    });

    it("fail to get owner if chainId is wrong", async function () {
      //mint a token to owner
      const [owner] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address, 80000);

      //get owner
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      await accountContract.owner().then((res) => {
        expect(res).to.equal(ethers.constants.AddressZero);
      });
    });
  });

  describe("executeCall", function () {
    it("should be execute call transfer eth", async function () {
      //mint a token to owner
      const [owner, addr1] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address);

      //get owner
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      //transfer 1 Eth to accountAddress from owner
      await owner.sendTransaction({
        to: accountAddress,
        value: ethers.utils.parseEther("1"),
      });

      //check balance
      await ethers.provider.getBalance(accountAddress).then((res) => {
        expect(res).to.equal(ethers.utils.parseEther("1"));
      });

      //execute call
      const callData = ethers.utils.defaultAbiCoder.encode([], []);

      //transfer 1 Eth to addr1 from accountAddress
      await accountContract
        .connect(owner)
        .executeCall(addr1.address, ethers.utils.parseEther("1"), callData);

      //check balance
      await ethers.provider.getBalance(accountAddress).then((res) => {
        expect(res).to.equal(ethers.utils.parseEther("0"));
      });

      //check nonce
      await accountContract.nonce().then((res) => {
        expect(res).to.equal(1);
      });
    });

    it("should be execute call nft owner of", async function () {
      //mint a token to owner
      const [owner, addr1] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address);

      //get owner
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      //execute call NFT ownerOf(uint256 tokenId)
      //create call data with function selector and tokenId

      const callData = ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "uint256"],
        [ethers.utils.id("ownerOf(uint256)").slice(0, 10), 0]
      );

      console.log("callData", callData);

      //check nonce
      await accountContract.nonce().then((res) => {
        expect(res).to.equal(0);
      });

      //execute call
      await accountContract
        .connect(owner)
        .executeCall(testToken721.address, 0, callData);

      //check nonce
      await accountContract.nonce().then((res) => {
        expect(res).to.equal(1);
      });
    });

    it("fail to execute", async function () {
      //mint a token to owner
      const [owner, addr1] = await ethers.getSigners();
      const accountAddress = await createAccount(owner.address);

      //get owner
      const accountContract = await ethers.getContractAt(
        "StandardERC6551Account",
        accountAddress
      );

      //execute call NFT safeTransferFrom(address from, address to, uint256 tokenId)
      //create call data with function selector and tokenId

      const callData = ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "address", "address", "uint256"],
        [
          ethers.utils
            .id("safeTransferFrom(address,address,uint256)")
            .slice(0, 10),
          owner.address,
          addr1.address,
          0,
        ]
      );

      console.log("callData", callData);

      //execute call
      await expect(
        accountContract
          .connect(owner)
          .executeCall(testToken721.address, 0, callData)
      ).to.be.revertedWithoutReason();

      //check nonce
      await accountContract.nonce().then((res) => {
        expect(res).to.equal(0);
      });
    });
  });
});
