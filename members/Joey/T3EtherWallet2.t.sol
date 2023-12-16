// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/forge-std/src/Test.sol";
import "src/EtherWallet.sol"; // 路径替换为EtherWallet合约的实际路径

contract EtherWalletTest is Test {
    EtherWallet private etherWallet;
    address payable private owner;
    
    function setUp() public {
        // 创建合约的实例
        owner = payable(address(this)); // 当前测试合同将作为所有者
        etherWallet = new EtherWallet();
        
    }
    receive() external payable { }

    // 测试发送ETH到合约地址
    function testReceiveEth() public {
        // Arrange
        uint256 sendAmount = 1 ether;

        // Act
        payable(address(etherWallet)).transfer(sendAmount);

        // Assert
        assertEq(etherWallet.getBalance(), sendAmount, "Balance should equal sent amount");
    }

    // 测试只有所有者可以提现
    function testWithdrawByOwner() public {
        
        vm.deal(address(this), 10 ether);
        uint256 initialBalance = address(this).balance;
        uint256 sendAmount = 1 ether;
        payable(address(etherWallet)).transfer(sendAmount);
        uint256 withdrawAmount = 0.5 ether;

     
        etherWallet.withdraw(withdrawAmount);

        
        assertEq(address(this).balance, initialBalance - sendAmount + withdrawAmount);
    }

    // 测试非所有者不能提现
    function testFailWithdrawByNonOwner() public {
        // Arrange
        uint256 sendAmount = 1 ether;
        payable(address(etherWallet)).transfer(sendAmount);
        
        // Act / Assert
        address nonOwner = address(0x1);
        vm.startPrank(nonOwner); // 不再是合约的所有者，而是冒充另外的账户
        
        // 这一步应该是会失败的，因为非所有者不应该能提现（所以用了 testFail 前缀）
        etherWallet.withdraw(sendAmount);
        
        vm.stopPrank();
    }
    
    // 测试合约的余额是否正确
    function testGetBalance() public {
        // Arrange
        uint256 sendAmount = 1 ether;

        // Act
        payable(address(etherWallet)).transfer(sendAmount);

        // Assert
        assertEq(etherWallet.getBalance(), sendAmount, "The balance should be equal to the sent amount");
    }
}