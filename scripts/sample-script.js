const hre = require("hardhat");

async function main() {
  //Deployed MY Token contract
  const MYToken = await ethers.getContractFactory("MYToken");
  myToken = await upgrades.deployProxy(MYToken);
  await myToken.deployed();

  console.log("ERC20 Token Deployed to:", myToken.address);

  // Deployed fetch Price contract
  const FetchPrice = await ethers.getContractFactory("FetchPrice");
  fetchPrice = await FetchPrice.deploy();
  await fetchPrice.deployed();

  console.log("Fetch Price contract deployed to:", fetchPrice.address);

  // Deployed upgradeable staking contract
  const UpgradeableStaking = await ethers.getContractFactory(
    "UpgradeableStaking"
  );
  upgradeableStaking = await upgrades.deployProxy(UpgradeableStaking, [
    myToken.address,
    fetchPrice.address,
  ]);
  await upgradeableStaking.deployed();

  console.log(
    "upgradeable staking contract deployed to:",
    upgradeableStaking.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
