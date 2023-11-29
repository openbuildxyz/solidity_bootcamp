// SPDX-License-Identifier: MIT
//https://eips.ethereum.org/EIPS/eip-20
pragma solidity ^0.8.13;

// ERC20 Contract Interface
interface IERC20 {
    // emit condition: when value uint token transfer from  address(owner) to address(spender)
    event Transfer(address indexed from, address indexed to, uint256 value);

    // emit condition: when value uint token approve from  address(owner) to address(spender)
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // return total supply
    function totalSupply() external view returns (uint256);

    // return account token balanceOf
    function balanceOf(address account) external view returns (uint256);


    // owner authorize to spender ,return authorize token unit
    function allowance(address owner, address spender)
    external
    view
    returns (uint256);

    // transfer amount unit token, from msg.sender to address(to)
    // if success return True and emit  {Transfer} event
    function transfer(address to, uint256 amount) external returns (bool);



    // msg.sender approve amount unit token to spender
    // if success return True and emit {Approval} event
    function approve(address spender, uint256 amount) external returns (bool);

    // use allowance ,transfer amount unit token from address(from) to address(to)
    // if success return True and emit {Transfer} event
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
