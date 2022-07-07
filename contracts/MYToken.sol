//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MYToken is ERC20Upgradeable {
  function initialize() external initializer {
    __ERC20_init("MYToken", "MT");
  }

  function mint(address to, uint256 initalSupply) external {
    _mint(to, initalSupply);
  }
}
