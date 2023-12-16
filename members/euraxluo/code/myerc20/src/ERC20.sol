// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    // auto generate totalSupply getter function
    uint256 public override totalSupply;

    // auto generate balanceOf getter function
    mapping(address => uint256) public override balanceOf;


    // auto generate allowance getter function
    mapping(address => mapping(address => uint256)) public override allowance;

    // contract name
    string public name;
    // contract symbol
    string public symbol;

    // decimal digits
    uint8 public decimals = 18;

    // owner address
    address public owner;


    // revert error message
    error onlyOwnerError(address sender);
    error transferFromZeroAddress();
    error transferToZeroAddress();
    error approveFromZeroAddress();
    error approveToZeroAddress();
    error insufficientAllowanceError(uint256, uint256);
    error transferAmountExceedsBalance();
    error burnAmountExceedsBalance();


    // only owner
    modifier onlyOwner {
        if (msg.sender != owner) {
            revert onlyOwnerError(msg.sender);
        }
        _;
    }

    // constructor function
    constructor(string memory _name, string memory _symbol){
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
    }

    // impl transfer function
    function transfer(address _recipient, uint256 _amount) external override returns (bool){
        _transfer(msg.sender, _recipient, _amount);
        return true;
    }

    // impl approve function
    function approve(address _spender, uint256 _amount) external override returns (bool){
        _approve(msg.sender, _spender, _amount);
        return true;
    }

    // impl transferFrom function
    function transferFrom(address _sender, address _recipient, uint256 _amount) external override returns (bool){
        uint256 curAllowance = allowance[_sender][msg.sender];
        if (curAllowance < _amount) {
            revert insufficientAllowanceError(curAllowance, _amount);
        }
        _approve(_sender, msg.sender, curAllowance - _amount);
        _transfer(_sender, _recipient, _amount);
        return true;
    }

    // _approve
    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal {
        if (_owner == address(0)) {
            revert approveFromZeroAddress();
        }
        if (_spender == address(0)) {
            revert approveFromZeroAddress();
        }

        allowance[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    // _transfer
    function _transfer(address _from, address _to, uint256 _amount) internal {
        if (_from == address(0)) {
            revert transferFromZeroAddress();
        }
        if (_to == address(0)) {
            revert transferToZeroAddress();
        }
        uint256 fromBalance = balanceOf[_from];
        if (fromBalance < _amount) {
            revert transferAmountExceedsBalance();
        }
    unchecked {
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
    }
        emit Transfer(_from, _to, _amount);
    }

    // mint
    function _mint(address _account, uint256 _amount) onlyOwner internal virtual  {
        balanceOf[_account] += _amount;
        totalSupply += _amount;
        emit Transfer(address(0), _account, _amount);
    }

    // _burn
    function _burn(address _account, uint256 _amount) onlyOwner internal virtual  {
        if (balanceOf[_account] < _amount) {
            revert burnAmountExceedsBalance();
        }
    unchecked{
        balanceOf[_account] -= _amount;
        totalSupply -= _amount;

    }
        emit Transfer(_account, address(0), _amount);
    }
}