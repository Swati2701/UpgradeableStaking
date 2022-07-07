// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FetchPrice {
  AggregatorV3Interface internal priceFeed;

  constructor() {
    //N/w: ethereum mainnet
    priceFeed = AggregatorV3Interface(
      0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    );
  }

  /**
   * Returns the latest price
   */
  function getLatestPrice() public view returns (uint256) {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price);
  }

  /**
   * Returns the decimal
   */
  function decimal() external view returns (uint8) {
    return priceFeed.decimals();
  }
}
