// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

contract OpenBuildToken is ERC20 {
    constructor() ERC20("OpenBuildToken123aa","OBT") {
        _mint(msg.sender, 10000000000 * 10 ** 6);
    }
    function decimals() public view virtual override returns (uint8){
        return 6;
    }

}
