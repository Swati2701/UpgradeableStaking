const { BigNumber } = require("@ethersproject/bignumber");
const chai = require("chai");
const { expect } = chai;
const { ethers, upgrades } = require("hardhat");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

let fetchPrice, owner, addr1, addr2, accounts;

const amount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(18));

describe("Fetch Price contract", () => {
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    [owner, addr1, addr2] = accounts;

    const FetchPrice = await ethers.getContractFactory("FetchPrice");
    fetchPrice = await FetchPrice.deploy();
    await fetchPrice.deployed();
  });

  describe("get price", () => {
    it("get ethereum price", async function () {
      const ethPrice = await fetchPrice.getLatestPrice();
      expect(ethPrice).to.be.equal(117061550184);
    });

    it("decimal", async function () {
      expect(await fetchPrice.decimal()).to.be.equal(8);
    });
  });
});
