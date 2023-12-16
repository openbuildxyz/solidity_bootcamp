const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require('ethers');
let bcNFT;

describe("depoly BootcampNFT", function () {
  async function init() {
    const [owner, otherAccount] = await ethers.getSigners();
    const BootcampNFT = await ethers.getContractFactory("BootcampNFT");
    bcNFT = await BootcampNFT.deploy();
    console.log("bcNFT address:" + bcNFT.target);
  }

  before(async function () {
    await init();
  });

  //
  it("init balanceOf alice and bob equal 0", async function () {
    const [alice, bob] = await ethers.getSigners();
    expect(await bcNFT.balanceOf(alice)).to.equal(0);
    expect(await bcNFT.balanceOf(bob)).to.equal(0);
  });

  it("alice mint id 1", async function () {
    const [alice, bob] = await ethers.getSigners();
    let tx = await bcNFT.mint(alice, 1);
    await tx.wait()
    console.log("tx is : " + tx[0]);
    expect(await bcNFT.ownerOf(1)).to.equal(alice.address);
    expect(await bcNFT.balanceOf(alice)).to.equal(1);
    });

  it("alice send token1 to bob ", async function () {
    const [alice, bob] = await ethers.getSigners();
    let tx = await bcNFT.safeTransferFrom(alice, bob, 1);
    await tx.wait();
    expect(await bcNFT.ownerOf(1)).to.equal(bob.address);
    expect(await bcNFT.balanceOf(alice)).to.equal(0);
    expect(await bcNFT.balanceOf(bob)).to.equal(1);
  });

});
