const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require('ethers');
const {hashMessage} = require("@ethersproject/hash");
const {arrayify, BytesLike } = require("@ethersproject/bytes");

let fakeUSDT;
let openBuildParty;
let provider;
let endTime;
let owner;
let creator;
let acc1;
let acc2;
let acc3;
let acc4;
let acc5;
let acc6;

describe("deploy OpenBuildPartyV2, fakeUSDT", function () {
  this.timeout(600000);
  async function init() {

    // 获取默认的以太坊提供商
    provider = ethers.provider;
    [owner, creator, acc1 ,acc2, acc3, acc4,acc5, acc6] = await ethers.getSigners();
    //  const [owner, otherAccount] = await ethers.getSigners();
    const FakeUSDT = await ethers.getContractFactory("FakeUSDT");
    fakeUSDT = await FakeUSDT.deploy();
    console.log("fakeUSDT Address:" + fakeUSDT.target);


    const OpenBuildParty = await ethers.getContractFactory("OpenBuildPartyV2");
    openBuildParty = await OpenBuildParty.deploy();
    console.log("openBuildParty Address:" + openBuildParty.target);

    fakeUSDT.transfer(acc1, ethers.parseEther("1000"));
    fakeUSDT.transfer(acc2, ethers.parseEther("1000"));
    fakeUSDT.transfer(acc3, ethers.parseEther("1000"));

  }

  beforeEach(async function () {
    await init();
  });

  async function getBlockTime(){
    // 查询最新的区块号
    const block = await provider.getBlock();
    // console.log("最新区块号:", block.number);
    // console.log("最新区块时间:", block.timestamp);
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

  async function creatChallenge(){
    let nowTime = await getBlockTime();
    await openBuildParty.connect(creator).create(fakeUSDT.target, ethers.parseEther("500"), nowTime + 20);
  }

  async function joinChallenge(account, id){
    await fakeUSDT.connect(account).approve(openBuildParty.target, ethers.parseEther("500"));
    await openBuildParty.connect(account).join(id);
  }

  async function blockContinueChallengeInfoEnd(id){
    const challengeInfo = await openBuildParty.challengeInfo(id);
    let nowTime = await getBlockTime();
    while (nowTime <  challengeInfo[3]) {
      await blockContinue(5);
      nowTime = await getBlockTime();
    }
  }

  async function withdrawChallenge(account, id){
    await openBuildParty.connect(account).withdraw(id, account.address);
  }

  async function getPlayersList(id, start, end){
    return await openBuildParty.getPlayersList(id, start, end);
  }


  it("create challenge", async function () {

    await creatChallenge();
    expect(await openBuildParty.challengeNumber()).to.equal(1);

    let challengeInfo = await openBuildParty.challengeInfo(0);
    expect(challengeInfo[0]).to.equal(creator.address);

  });

  it("withdraw", async function () {
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(acc3)).to.equal(ethers.parseEther("1000"));

    await creatChallenge();

    await joinChallenge(acc1, 0);
    await joinChallenge(acc2, 0);
    await joinChallenge(acc3, 0);

    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("1500"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc3)).to.equal(ethers.parseEther("500"));

    await blockContinueChallengeInfoEnd(0);

    //acc1  未设置提取比例，revert
    await expect(withdrawChallenge(acc1, 0)).to.be.reverted;

    //设置提取比例
    await openBuildParty.connect(creator).setShares(0, [acc1.address, acc2.address], [0, 50]);
    await openBuildParty.connect(creator).setShares(0, [acc3.address], [100]);

    await withdrawChallenge(acc1, 0);
    await withdrawChallenge(acc2, 0);
    await withdrawChallenge(acc3, 0);

    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("750"));
    expect(await fakeUSDT.balanceOf(acc3)).to.equal(ethers.parseEther("500"));

    //活动结束
    await expect(openBuildParty.join(0)).to.be.reverted;

    //提取后再次提取
    await expect(withdrawChallenge(acc1, 0)).to.be.reverted;

    //提取后再次设置比例
    await expect(openBuildParty.connect(creator).setShares(0, [acc1.address], [20])).to.be.reverted;

  });

  it("setSharesAndwithdraw", async function () {
    await creatChallenge();
    await joinChallenge(acc1, 0);
    await openBuildParty.connect(creator).setSharesAndWithdraw(0, [acc1.address], [50]);
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("750"));

  });

  it("returnStake", async function () {

    await creatChallenge();
    await joinChallenge(acc1, 0);
    await joinChallenge(acc2, 0);

    await blockContinueChallengeInfoEnd(0);

    await openBuildParty.connect(owner).returnStake(0, [acc1.address, acc2.address], [ethers.parseEther("500"), ethers.parseEther("300")]);

    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("800"));
    expect(await fakeUSDT.balanceOf(creator)).to.equal(ethers.parseEther("200"));

  });


  it("addBlack", async function () {

    await creatChallenge();
    await joinChallenge(acc1, 0);
    await joinChallenge(acc2, 0);

    await openBuildParty.connect(owner).addBlack([acc1.address]);
    expect(await openBuildParty.blackPlayer(acc1.address)).to.equal(true);
    expect(await openBuildParty.blackPlayer(acc2.address)).to.equal(false);

    await blockContinueChallengeInfoEnd(0);

    await openBuildParty.connect(creator).setShares(0, [acc1.address, acc2.address], [50, 50]);

    await expect(withdrawChallenge(acc1, 0)).to.be.reverted;

    await withdrawChallenge(acc2, 0);

    await openBuildParty.connect(owner).returnStake(0, [acc1.address], [ethers.parseEther("300")]);

    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("800"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("750"));
    expect(await fakeUSDT.balanceOf(creator)).to.equal(ethers.parseEther("450"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));

  });

  it("removeBlack", async function () {

    await creatChallenge();
    await joinChallenge(acc1, 0);
    await openBuildParty.connect(creator).setShares(0, [acc1.address], [50]);
    await openBuildParty.connect(owner).addBlack([acc1.address]);
    expect(await openBuildParty.blackPlayer(acc1.address)).to.equal(true);

    await blockContinueChallengeInfoEnd(0);

    await expect(withdrawChallenge(acc1, 0)).to.be.reverted;

    await openBuildParty.connect(owner).removeBlack([acc1.address]);
    expect(await openBuildParty.blackPlayer(acc1.address)).to.equal(false);

    await withdrawChallenge(acc1, 0);

    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("750"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));

  });

  it("getPlayerList", async function () {

    await creatChallenge();
    await joinChallenge(acc1, 0);
    await joinChallenge(acc2, 0);
    await joinChallenge(acc3, 0);

    fakeUSDT.transfer(acc4, ethers.parseEther("1000"));
    fakeUSDT.transfer(acc5, ethers.parseEther("1000"));
    fakeUSDT.transfer(acc6, ethers.parseEther("1000"));

    await joinChallenge(acc4, 0);
    await joinChallenge(acc5, 0);
    await joinChallenge(acc6, 0);

    let count = await openBuildParty.getPlayersCount(0);
    expect (count).to.equal(6);

    expect(await getPlayersList(0, 0, 2)).to.deep.equal([acc1.address, acc2.address]);
    expect(await getPlayersList(0, 2, 4)).to.deep.equal([acc3.address, acc4.address]);
    expect(await getPlayersList(0, 4, 5)).to.deep.equal([acc5.address]);
    await expect(getPlayersList(0, 0, 3)).be.reverted;
    await expect(getPlayersList(0, 5, 7)).be.reverted;


    await openBuildParty.connect(creator).setShares(0, [acc1.address], [50]);
    await openBuildParty.connect(creator).setSharesAndWithdraw(0, [acc5.address, acc6.address], [50, 0]);

    let acc1Info = await openBuildParty.connect(acc1).getMyPlayerInfo(0);

    expect (acc1Info[0]).to.equal(1);
    expect (acc1Info[1]).to.equal(true);
    expect (acc1Info[2]).to.equal(ethers.parseEther("250"));

    let acc2Info = await openBuildParty.connect(acc2).getMyPlayerInfo(0);
    expect (acc2Info[0]).to.equal(1);
    expect (acc2Info[1]).to.equal(false);
    expect (acc2Info[2]).to.equal(ethers.parseEther("0"));

    let acc5Info = await openBuildParty.getPlayerInfo(0, acc5.address);
    expect (acc5Info[0]).to.equal(2);
    expect (acc5Info[1]).to.equal(true);
    expect (acc5Info[2]).to.equal(ethers.parseEther("250"));

    let acc6Info = await openBuildParty.getPlayerInfo(0, acc6.address);
    expect (acc6Info[0]).to.equal(3);
    expect (acc6Info[1]).to.equal(true);
    expect (acc6Info[2]).to.equal(ethers.parseEther("500"));



  });

});
