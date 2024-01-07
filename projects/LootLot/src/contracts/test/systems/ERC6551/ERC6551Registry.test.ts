import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("ERC6551Registry", function () {
  let erc6551Registry: Contract;
  let standardERC6551Account: Contract;
  let testToken721: Contract;

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
  });
  it("should be deployed", async function () {
    expect(erc6551Registry.address).to.not.equal(null);
  });

  describe("account", function () {
    it("should be able to register an account", async function () {
      //mint a token to owner
      const [owner] = await ethers.getSigners();
      await testToken721.connect(owner).safeMint(owner.address);

      //check nfTokenOwner
      const nfTokenOwner = await testToken721.ownerOf(0);
      expect(nfTokenOwner).to.equal(owner.address);

      const salt = ethers.utils.id("mySalt");
      const accountAddress = await erc6551Registry.account(
        standardERC6551Account.address,
        80001,
        testToken721.address,
        0,
        salt
      );

      expect(accountAddress).to.not.equal(null);
      console.log("accountAddress", accountAddress);

      //create a new account
      await expect(
        erc6551Registry.createAccount(
          standardERC6551Account.address,
          80001,
          testToken721.address,
          0,
          salt,
          []
        )
      )
        .to.emit(erc6551Registry, "AccountCreated")
        .withArgs(
          accountAddress,
          standardERC6551Account.address,
          80001,
          testToken721.address,
          0,
          salt
        );
    });
  });
});
