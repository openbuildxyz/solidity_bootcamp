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


describe("deploy OpenBuildParty, fakeUSDT", function () {
  this.timeout(600000);
  async function init() {

    // 获取默认的以太坊提供商
    provider = ethers.provider;
    [owner, creator, acc1 ,acc2, acc3, acc4,acc5, acc6] = await ethers.getSigners();
    //  const [owner, otherAccount] = await ethers.getSigners();
    const FakeUSDT = await ethers.getContractFactory("FakeUSDT");
    fakeUSDT = await FakeUSDT.deploy();
    console.log("fakeUSDT Address:" + fakeUSDT.target);


    const OpenBuildParty = await ethers.getContractFactory("OpenBuildParty");
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

  async function withdrawChallenge(account, id, amount){
    // const message = await openBuildParty.getHashMessage(account.address, id, amount);
    // let nonce = await openBuildParty.nonces(creator.address);
    // this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);

    const network = await provider.getNetwork();
    const chainId = network.chainId;

    const domain = {
      name: 'OpenBuildParty',
      version: '1',
      chainId: chainId,
      verifyingContract: openBuildParty.target
    }


    const struct_message = {
      player: account.address,
      id: id,
      amount: amount
    }

    const types = {
      Sign: [{ name: 'player', type: 'address' }, { name: 'id', type: 'uint8' }, { name: 'amount', type: 'uint256' }],
    //  EIP712Domain: [{ name: 'name', type: 'string' }, { name: 'version', type: 'string' }, { name: 'chainId', type: 'uint256' }, { name: 'verifyingContract', type: 'address' }]
    }

    const sign = await creator.signTypedData(domain, types, struct_message);

    await openBuildParty.connect(account).withdrawBySignature(account.address, id, amount, sign);
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

    await creatChallenge();

    await joinChallenge(acc1, 0);
    await joinChallenge(acc2, 0);
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("500"));

    await blockContinueChallengeInfoEnd(0);

    //acc1 全部提取
    await withdrawChallenge(acc1, 0, ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("1000"));

    //acc2 部分提取
    let balanceOfCreator = await fakeUSDT.balanceOf(creator.address);
    await withdrawChallenge(acc2, 0, ethers.parseEther("300"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("800"));
    expect(await fakeUSDT.balanceOf(creator.address)).to.equal(balanceOfCreator + (ethers.parseEther("200")));

    //活动结束
    await expect(openBuildParty.join(0)).to.be.reverted;

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

    await expect(withdrawChallenge(acc1, 0, ethers.parseEther("500"))).to.be.reverted;

    await withdrawChallenge(acc2, 0, ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("500"));
    expect(await fakeUSDT.balanceOf(acc2)).to.equal(ethers.parseEther("1000"));

    await openBuildParty.connect(owner).returnStake(0, [acc1.address], [ethers.parseEther("300")]);

    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("800"));
    expect(await fakeUSDT.balanceOf(creator)).to.equal(ethers.parseEther("200"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));

  });

  it("removeBlack", async function () {

    await creatChallenge();
    await joinChallenge(acc1, 0);

    await openBuildParty.connect(owner).addBlack([acc1.address]);
    expect(await openBuildParty.blackPlayer(acc1.address)).to.equal(true);

    await blockContinueChallengeInfoEnd(0);

    await expect(withdrawChallenge(acc1, 0, ethers.parseEther("500"))).to.be.reverted;

    await openBuildParty.connect(owner).removeBlack([acc1.address]);
    expect(await openBuildParty.blackPlayer(acc1.address)).to.equal(false);

    await withdrawChallenge(acc1, 0, ethers.parseEther("500"));

    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("1000"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));

  });

  it("withdrawBySignatureMessage", async function () {
    await creatChallenge();
    await joinChallenge(acc1, 0);

    let message = await openBuildParty.getHashMessage(acc1.address, 0, ethers.parseEther("300"));
    let sign = await creator.signMessage(arrayify(message));

    let singer =await openBuildParty.getMessageSinger(acc1.address, 0, ethers.parseEther("300"), sign);
    expect(singer).to.equal(creator.address);

    let challengeInfo = await openBuildParty.challengeInfo(0);
    expect(challengeInfo[5]).to.equal(ethers.parseEther("500"));

    await blockContinueChallengeInfoEnd(0);

    await openBuildParty.withdrawBySignatureMessage(acc1.address, 0, ethers.parseEther("300"), sign);

    challengeInfo = await openBuildParty.challengeInfo(0);
    expect(challengeInfo[4]).to.equal(1);
    expect(challengeInfo[5]).to.equal(0);
    expect(await fakeUSDT.balanceOf(acc1)).to.equal(ethers.parseEther("800"));
    expect(await fakeUSDT.balanceOf(openBuildParty.target)).to.equal(ethers.parseEther("0"));

    await expect(openBuildParty.withdrawBySignatureMessage(acc1.address, 0, ethers.parseEther("500"), sign)).to.be.reverted;
  });

});
