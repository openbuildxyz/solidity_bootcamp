// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "ds-test/test.sol";
import "../src/DutchAuction.sol";
import "../lib/forge-std/src/Test.sol";
import "../lib/forge-std/test/mocks/MockERC721.t.sol";

contract DutchAuctionTest is DSTest, Test, Token_ERC721 {
    DutchAuction auction;
    Token_ERC721 nft;
    address seller;
    address buyer;

    constructor() Token_ERC721("DutchAuction","DCAN") {

    }

    function setUp() public {
        seller = address(this);
        buyer = address(0x1);
        vm.deal(buyer, 100 ether);
        nft = new Token_ERC721('DutchAuction', 'DCAN');
        nft.mint(seller, 1);
        auction = new DutchAuction(1 ether, 0.000001 ether, address(nft), 1);
    }

    function testSuccessBuy() public {
        nft.approve(address(auction),1);
        uint price = auction.getPrice();
        vm.prank(buyer);
        auction.buy{value: price}();
        assertEq(nft.ownerOf(1), buyer);
    }

    function testFailBuyAfterExpiration() public {
        nft.approve(address(auction), 1);
        uint price = auction.getPrice();
        console.log('block.Timestamp before skip:', block.timestamp);
        skip(1);
        console.log('block.Timestamp after skip:', block.timestamp);
        vm.expectRevert("auction expired");
        vm.prank(buyer);
        auction.buy{value: price}();
    }

    function skip(uint256 time) internal override {
        vm.warp(block.timestamp + time);
    }
}
