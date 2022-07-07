const { BigNumber } = require("@ethersproject/bignumber");
const chai = require("chai");
const { expect } = chai;
const { ethers, upgrades } = require("hardhat");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

let myToken, upgradeableStaking, fetchPrice, owner, addr1, addr2, accounts;

const amount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(18));

describe("Upgradeable staking contract", () => {
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    [owner, addr1, addr2] = accounts;

    //Deployed MY Token contract
    const MYToken = await ethers.getContractFactory("MYToken");
    myToken = await upgrades.deployProxy(MYToken);
    await myToken.deployed();

    const FetchPrice = await ethers.getContractFactory("FetchPrice");
    fetchPrice = await FetchPrice.deploy();
    await fetchPrice.deployed();

    const UpgradeableStaking = await ethers.getContractFactory(
      "UpgradeableStaking"
    );
    upgradeableStaking = await upgrades.deployProxy(UpgradeableStaking, [
      myToken.address,
      fetchPrice.address,
    ]);
  });

  describe("Stake token", () => {
    it("If stake amount less than zero", async function () {
      await expect(
        upgradeableStaking.connect(addr1).stake(0)
      ).to.be.revertedWith("Amount less than zero");
    });

    it("If different user unstake tokens", async function () {
      await upgradeableStaking.connect(addr1).stake(10000);
      await expect(
        upgradeableStaking.connect(addr2).unstake(1)
      ).to.be.revertedWith("user staking id is different");
    });

    it("Stake amount", async function () {
      await upgradeableStaking.connect(addr1).stake(1000);
      expect(await upgradeableStaking.totalStaked()).to.be.equal(1000);

      const stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());
    });

    it("if unstakeTokens before 1 month", async function () {
      await myToken.mint(upgradeableStaking.address, amount);
      await upgradeableStaking.connect(addr1).stake(1000000000000);
      expect(await upgradeableStaking.totalStaked()).to.be.equal(1000000000000);

      const stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());

      let openTimes = 30 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );
    });

    it("unstake amount after 30 days", async function () {
      await myToken.mint(upgradeableStaking.address, amount);
      await upgradeableStaking.connect(addr1).stake(200000000000000);

      const stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());

      let openTimes = 56 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );
    });

    it("unstake amount after 180 days", async function () {
      await myToken.mint(upgradeableStaking.address, amount);
      stakeAmount = BigNumber.from(5000000).mul(BigNumber.from(10).pow(1));
      await upgradeableStaking.connect(addr1).stake(stakeAmount);
      expect(await upgradeableStaking.totalStaked()).to.be.equal(stakeAmount);

      const stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());

      let openTimes = 181 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );
    });

    it("unstake amount after 365 days", async function () {
      await myToken.mint(upgradeableStaking.address, amount);
      await upgradeableStaking.connect(addr1).stake(1000000000);
      expect(await upgradeableStaking.totalStaked()).to.be.equal(1000000000);

      stake = await upgradeableStaking.stakeInfo(1);
      expect(stake[0]).to.be.equal(addr1.address);
      expect(stake[2]).to.be.equal(await upgradeableStaking.totalStaked());

      let openTimes = 366 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());
      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );
    });

    it("same user stake more amount", async function () {
      await myToken.mint(upgradeableStaking.address, amount);
      //Stake amount by addr1
      await upgradeableStaking.connect(addr1).stake(5555555555);
      let stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());

      //Stake amount addr1
      await upgradeableStaking.connect(addr1).stake(11111111111111);
      stakeData = await upgradeableStaking.stakeInfo(2);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(11111111111111);

      let openTimes = 181 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );

      openTimes = 36 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(2);
      // console.log(await upgradeableStaking.priceInDollar());
    });

    it("Different user stake more amount", async function () {
      await myToken.mint(upgradeableStaking.address, amount);

      // stake amount for addr1
      await upgradeableStaking.connect(addr1).stake(11100000);
      let stakeData = await upgradeableStaking.stakeInfo(1);
      expect(stakeData[0]).to.be.equal(addr1.address);
      expect(stakeData[2]).to.be.equal(await upgradeableStaking.totalStaked());

      //stake amount for addr2
      await upgradeableStaking.connect(addr2).stake(10845200000);
      stakeData = await upgradeableStaking.stakeInfo(2);
      expect(stakeData[0]).to.be.equal(addr2.address);
      expect(stakeData[2]).to.be.equal(10845200000);

      openTimes = 36 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [openTimes]);
      await network.provider.send("evm_mine");

      await upgradeableStaking.connect(addr1).unstake(1);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr1.address)
      );

      await upgradeableStaking.connect(addr2).unstake(2);
      // console.log(await upgradeableStaking.priceInDollar());

      expect(await upgradeableStaking.rewardAmount()).to.be.equal(
        await myToken.balanceOf(addr2.address)
      );
    });
  });
});
