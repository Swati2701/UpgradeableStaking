// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FetchPrice {
  AggregatorV3Interface internal priceFeed;

  constructor() {
    //N/w: polygon mumbai testnet
    priceFeed = AggregatorV3Interface(
      0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 // 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada //  0xAB594600376Ec9fD91F8e885dADF0CE036862dE0 <-mainnet  //
    );
  }

  /**
   * Returns the latest price
   */
  function getLatestPrice() public view returns (uint256) {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price);
  }

  function decimal() external view returns (uint8) {
    return priceFeed.decimals();
  }
}
