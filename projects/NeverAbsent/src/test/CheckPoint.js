const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require('ethers');
let fakeUSDT;
let checkpoint;
let provider;
let endTime;


describe("deploy Checkpoint, fakeUSDT", function () {
  this.timeout(600000);
  async function init() {

    // 获取默认的以太坊提供商
    provider = ethers.provider;
    //  const [owner, otherAccount] = await ethers.getSigners();
    const FakeUSDT = await ethers.getContractFactory("FakeUSDT");
    fakeUSDT = await FakeUSDT.deploy();
    console.log("fakeUSDT:" + fakeUSDT.target);


    const blockTime = await getBlockTime();
    endTime = blockTime + 180;
    console.log("blockTime: " + blockTime);
    const Checkpoint = await ethers.getContractFactory("Checkpoint");
    checkpoint = await Checkpoint.deploy(fakeUSDT.target, blockTime, endTime, ethers.parseEther("3000"));
    console.log("checkpoint:" + checkpoint.target);

    await fakeUSDT.transfer(checkpoint.target, ethers.parseEther("3000"));

  }

  beforeEach(async function () {
    await init();
  });

  async function getBlockTime(){
    // 查询最新的区块号
    const block = await provider.getBlock();
    console.log("最新区块号:", block.number);
    console.log("最新区块时间:", block.timestamp);
    return block.timestamp;
  }

  async function sleep(seconds){
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async function blockContinue(times){
    const [owner, acc1,acc2, acc3, acc4,acc5, acc6] = await ethers.getSigners();
    for(i=0; i< times; i++){
      await fakeUSDT.transfer(acc6, ethers.parseEther("1"));
    }
  }


  it("single team", async function () {
    expect(await fakeUSDT.balanceOf(checkpoint.target)).to.equal(ethers.parseEther("3000"));
    const [owner, account1, account2] = await ethers.getSigners();
    expect(await fakeUSDT.balanceOf(account1)).to.equal(0);
    expect(await fakeUSDT.balanceOf(account2)).to.equal(0);

    await checkpoint.connect(account1).createTeam(0);
    await checkpoint.connect(account2).createTeam(0);

    await checkpoint.connect(account1).checkIn();
    await checkpoint.connect(account2).checkIn();

    await blockContinue(15);

    await checkpoint.connect(account1).checkIn();
    await checkpoint.connect(account2).checkIn();

    await blockContinue(15);
    await checkpoint.connect(account1).checkIn();

    await blockContinue(10);

    let blockTime = await getBlockTime();
    console.log("blockTime:" + blockTime);
    while (blockTime < endTime){
      blockTime =await  blockContinue(5);
    }

    let player1 =  await checkpoint.playerInfo(account1);
    console.log(player1);

    let rewards1 = await checkpoint.getPlayerRewards(account1);
    let rewards2 = await checkpoint.getPlayerRewards(account2);
    console.log("rewards1:" + rewards1);
    console.log("rewards2:" + rewards2);

    await checkpoint.withdrawReward(account1);
    await checkpoint.withdrawReward(account2);

    expect(await fakeUSDT.balanceOf(account1)).to.equal(ethers.parseEther("1800"));
    expect(await fakeUSDT.balanceOf(account2)).to.equal(ethers.parseEther("1200"));

  });

  it("double team", async function () {
    const [owner, account1, account2, account3, account4, account5] = await ethers.getSigners();

    await checkpoint.connect(account1).createTeam(1);
    await checkpoint.connect(account2).join(1);

    await checkpoint.connect(account3).createTeam(1);
    await checkpoint.connect(account4).join(2);

    await checkpoint.connect(account1).checkIn();
    await checkpoint.connect(account2).checkIn();
    await checkpoint.connect(account3).checkIn();
    await checkpoint.connect(account4).checkIn();

    await blockContinue(15);

    await checkpoint.connect(account1).checkIn();
    await checkpoint.connect(account2).checkIn();

    await blockContinue(15);
    await checkpoint.connect(account1).checkIn();
    await checkpoint.connect(account2).checkIn();
    await checkpoint.connect(account3).checkIn();

    await blockContinue(10);

    let blockTime = await getBlockTime();
    console.log("blockTime:" + blockTime);
    while (blockTime < endTime){
      blockTime =await  blockContinue(5);
    }

    let player1 =  await checkpoint.playerInfo(account1);
    let player2 =  await checkpoint.playerInfo(account2);
    let player3 =  await checkpoint.playerInfo(account3);
    let player4 =  await checkpoint.playerInfo(account4);
    console.log(player1);
    console.log(player2);
    console.log(player3);
    console.log(player4);

    let rewards1 = await checkpoint.getPlayerRewards(account1);
    let rewards2 = await checkpoint.getPlayerRewards(account2);
    let rewards3 = await checkpoint.getPlayerRewards(account3);
    let rewards4 = await checkpoint.getPlayerRewards(account4);
    console.log("rewards1:" + rewards1);
    console.log("rewards2:" + rewards2);
    console.log("rewards3:" + rewards3);
    console.log("rewards4:" + rewards4);

    await checkpoint.withdrawReward(account1);
    await checkpoint.withdrawReward(account2);
    await checkpoint.withdrawReward(account3);
    await checkpoint.withdrawReward(account4);

  });

  it("destory contract", async function () {
    const [owner, account1, account2, account3, account4, account5] = await ethers.getSigners();
    expect(await fakeUSDT.balanceOf(checkpoint.target)).to.equal(ethers.parseEther("3000"));
    let balanceOld = await fakeUSDT.balanceOf(owner);
    console.log(balanceOld);

    await checkpoint.withDrawAllRewardToOwner();

    let balanceNew = await fakeUSDT.balanceOf(owner);
    console.log(balanceNew);

    expect(balanceNew).to.equal(balanceOld + ethers.parseEther("3000"));

  });

});
