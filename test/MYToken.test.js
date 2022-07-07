const { BigNumber } = require("@ethersproject/bignumber");
const chai = require("chai");
const { expect } = chai;
const { ethers, upgrades } = require("hardhat");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

let myToken, owner, addr1, addr2, accounts;

const amount = BigNumber.from(1000).mul(BigNumber.from(10).pow(18));

describe("MY Token", () => {
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    [owner, addr1, addr2] = accounts;

    //Deployed MY Token contract
    const MYToken = await ethers.getContractFactory("MYToken");
    myToken = await upgrades.deployProxy(MYToken);
    await myToken.deployed();
  });

  describe("MY Token Contract", () => {
    it("Should have name", async function () {
      expect(await myToken.name()).to.be.equal("MYToken");
    });

    it("Should have symbol", async function () {
      expect(await myToken.symbol()).to.be.equal("MT");
    });

    it("Should have decimals", async function () {
      expect(await myToken.decimals()).to.be.equal(18);
    });

    it("Should Mint token", async function () {
      await myToken.mint(addr1.address, amount);
      expect((await myToken.balanceOf(addr1.address)).toString()).to.be.equal(
        amount.toString()
      );
    });
  });
});
