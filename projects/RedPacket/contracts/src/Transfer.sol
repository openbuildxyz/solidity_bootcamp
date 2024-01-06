// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
// 引入 ERC-20 接口
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Transfer  {
    IERC20 public token; // 代币合约
    address public owner;

    error BALANCE_NOT_ENOUGH(string); // 余额不足
    error CONTRACT_BALANCE_NOT_ENOUGH(string); // 合约余额不足
    error NOT_OWNER(); // 合约余额不足

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    modifier _onlyOwner() {
        if(msg.sender != owner){
            revert NOT_OWNER();
        }
        _; // 继续执行被修饰的函数
    }

    // 允许其他地址将 ERC-20 代币转移到合约
    function _receiveTokens(uint256 amount) internal {
        if (token.balanceOf(msg.sender) < amount) {
            revert BALANCE_NOT_ENOUGH("receiveTokens");
        }
        token.approve(address(this), amount);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function _extractTokens(uint256 amount) internal {
        if (token.balanceOf(msg.sender) < amount) {
            revert BALANCE_NOT_ENOUGH("receiveTokens");
        }

        token.transferFrom(msg.sender, address(this), amount);
    }

    // 获取合约中的代币余额
    function getContractBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // 合约拥有者可以提取代币
    function withdrawTokens(uint256 amount) public _onlyOwner {
        if (token.balanceOf(address(this)) >= amount) {
            revert CONTRACT_BALANCE_NOT_ENOUGH("receiveTokens");
        }
        token.transfer(owner, amount);
    }
}
