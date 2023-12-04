const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require('ethers');
let fakeUSDT;


describe("FakeUSDT", function () {
  async function init() {
    const [owner, otherAccount] = await ethers.getSigners();
    const FakeUSDT = await ethers.getContractFactory("FakeUSDT");
    fakeUSDT = await FakeUSDT.deploy();
   // await fakeUSDT.deployed();
    console.log("fakeUSDT:" + fakeUSDT.address);
  }

  before(async function () {
    await init();
  });

  //
  it("otherAccount balance equal 0", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    expect(await fakeUSDT.balanceOf(otherAccount)).to.equal(0);
  });

  it("total supply is 10000", async function () {
      expect(await fakeUSDT.totalSupply()).to.equal(ethers.parseEther("10000"));
    });

  it("transfer 1 fakeUSDT from owner to otherAccount ", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    let tx = await fakeUSDT.transfer(otherAccount, ethers.parseEther("1"));
    await tx.wait();
    expect(await fakeUSDT.balanceOf(otherAccount)).to.equal(ethers.parseEther("1"));
    expect(await fakeUSDT.balanceOf(owner)).to.equal(ethers.parseEther("9999"));
  });

});
