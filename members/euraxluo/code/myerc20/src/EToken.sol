// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC20.sol";

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/// @custom:security-contact euraxluo@outlook.com
/// 练习，具有大量的bug

// 继承基本ERC20
contract EToken is ERC20 {
    // token 所有者的地址，这个地址会变，所以需要在构造函数中获取
    address public tokenOwner;

    // 契约构造者使用 _mint
    // represent 10000x10^18
    constructor() ERC20("EToken", "ETK") {
        // 初始化token 所有者
        tokenOwner = msg.sender;
        //固定供应
        _mint(msg.sender, 10 * 10 ** decimals);
    }

    // msg.value 是receive的wei
    // msg.sender 是 给我钱的人的地址
    //  接受eth来生成token
    receive() external payable {
        // 1 eth = 10 token
        // 1 eth = 10^18 wei == 10*10^18 represent
        // 1 wei*10 = token count
        uint256 _amount = msg.value * 10;

        // sol中有两种错误检测(require 和 assert)，require发生错误时不会产生gas
        require(balanceOf[tokenOwner] >= _amount, "Not enough tokens");

        // _transfer传输转移token给购买者
        _transfer(tokenOwner, msg.sender, _amount);

        // 发出Transfer事件
        emit Transfer(tokenOwner, msg.sender, _amount);
    }

    // 铸造代币,只允许 token ower 能够铸造代币
    function mint(uint _amount) external {
        require(tokenOwner == msg.sender, "Not authority mint token");
        _mint(tokenOwner, _amount);
    }

    // 赎回eth
    function redeem(address _buyer, uint256 _amount) public payable {
        // 买的时候 1wei=10amount，然后退还90%
        uint256 actalEthValue = ((_amount / 10) / 100) * 90 ether;
        require(balanceOf[_buyer] >= _amount, "Not enough tokens");
        // 销毁代币
        _burn(_buyer, _amount);
        // 退款
        payable(_buyer).transfer(actalEthValue);
        // 发出Transfer事件
        emit Transfer(_buyer, msg.sender, _amount);
    }
}
