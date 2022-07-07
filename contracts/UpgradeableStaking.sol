//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./FetchPrice.sol";

contract UpgradeableStaking {
  IERC20Upgradeable private rewardTokens;
  FetchPrice private stakeToken;

  uint256 public stakeId;
  uint256 public totalStaked;
  uint256 public rewardAmount;
  uint256 public priceInDollar;

  struct StakingInfo {
    address user;
    uint256 stakingTime;
    uint256 stakingBalance;
  }

  /* *@dev Mapping from uint256 stakeId to get stakeInfo
  uint256 => StakingInfo struct
  */
  mapping(uint256 => StakingInfo) public stakeInfo;

  event Stake(address user, uint256 stakingAmount);

  function initialize(IERC20Upgradeable _token, FetchPrice _stakeToken)
    external
  {
    rewardTokens = _token;
    stakeToken = _stakeToken;
    stakeId = 1;
  }

  /*
   *@dev A stake function to stake amount
   *@param  stakeAmount uint256 stakeAmount
   * Emits a {Stake} event
   */
  function stake(uint256 stakeAmount) external {
    StakingInfo storage stake_ = stakeInfo[stakeId];
    require(msg.sender != address(0), "zero address");
    require(stakeAmount > 0, "Amount less than zero");

    stake_.user = msg.sender;
    stake_.stakingTime = block.timestamp;
    stake_.stakingBalance = stakeAmount;
    stakeId++;

    totalStaked += stakeAmount;
    emit Stake(msg.sender, stakeAmount);
  }

  /*
   *@dev unstake a token after some time using stakeId
   *@param _stakeId uint256 stakeId
   */
  function unstake(uint256 _stakeId) external {
    StakingInfo storage stake_ = stakeInfo[_stakeId];
    uint256 stakeAmount = stake_.stakingBalance;
    require(stake_.user == msg.sender, "user staking id is different");

    uint256 totalIntrestRate;
    uint256 stakeDuration = block.timestamp - stake_.stakingTime;
    if (stakeDuration <= 30 days) {
      totalIntrestRate = 5 + toGetPerk(_stakeId);
      rewardAmount = calculateReward(
        totalIntrestRate,
        stakeAmount,
        stakeDuration
      );
    } else if (stakeDuration >= 30 days && stakeDuration <= 180 days) {
      totalIntrestRate = 10 + toGetPerk(_stakeId);
      rewardAmount = calculateReward(
        totalIntrestRate,
        stakeAmount,
        stakeDuration
      );
    } else if (stakeDuration >= 180 days && stakeDuration <= 365 days) {
      totalIntrestRate = 15 + toGetPerk(_stakeId);
      rewardAmount = calculateReward(
        totalIntrestRate,
        stakeAmount,
        stakeDuration
      );
    } else {
      totalIntrestRate = 18 + toGetPerk(_stakeId);
      rewardAmount = calculateReward(
        totalIntrestRate,
        stakeAmount,
        stakeDuration
      );
    }

    rewardTokens.transfer(msg.sender, rewardAmount);
    totalStaked -= stakeAmount;
    stake_.stakingBalance -= stakeAmount;
  }

  /*
  @dev calculateReward function is used to calculate a reward according to interest rate & stakeAmount
  @param APR uint256 is a interest rate
  @param _stakeAmount uint256 is a stakeAmount
  @param _stakeduration uint256 is a time at which user unstake amount
   */
  function calculateReward(
    uint256 APR,
    uint256 _stakeAmount,
    uint256 _stakeDuration
  ) internal pure returns (uint256) {
    uint256 _reward = (APR * _stakeAmount * _stakeDuration) / (100 * 365);
    return _reward;
  }

  /*
   * @dev toGetPerk is  function which used to calculate extra perk based on dollar amount
   *@param _stakeId uint256 stakeId
   */
  function toGetPerk(uint256 _stakeId) internal returns (uint256) {
    uint256 _stakeAmount = stakeInfo[_stakeId].stakingBalance;
    priceInDollar =
      (_stakeAmount * uint256(stakeToken.getLatestPrice())) /
      (10**stakeToken.decimal() + 10**18);

    if (priceInDollar < 100) {
      return 0;
    } else if (priceInDollar >= 100 && priceInDollar < 500) {
      return 2;
    } else if (priceInDollar >= 500 && priceInDollar < 1000) {
      return 5;
    } else {
      return 10;
    }
  }
}
