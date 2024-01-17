// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WantToken is ERC721, ERC721Burnable, Ownable {
    constructor(address initialOwner)
        ERC721("WANT", "WANT")
        Ownable(initialOwner)
    {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}

contract GoodsOracle {
    function getPrice(address goods) public pure returns(uint256) {
        require(address(goods) != address(0));
        return 1 ether;
    }
}

contract Want3Protocol {

    struct UserInfo {
        address user;
        uint256 amount;
    }

    uint miniDUST = 0.1 ether; // i.e., max 10 users
    uint maxUsersPerGoods = 20;
    mapping(address=>address) public wantList; // from host to target goods
    mapping(address=>address[]) public accumulatedUserList;
    mapping(address=>mapping(address=>uint)) public accumulatedList; // for each host, maps from user to their sent amount
    mapping(address=>uint) public withdrawInfo; // remaining amount for user to withdraw
    mapping(address=>UserInfo) public toptierUser;
    uint mintId;
    WantToken public rewardNFT;
    GoodsOracle goodsOracle;
    address owner;

    constructor() {
        owner = msg.sender;
        goodsOracle = new GoodsOracle();
        rewardNFT = new WantToken(msg.sender);
    }

    function addWant(address targetGoods) public {
        address who = msg.sender;
        require(wantList[who] == address(0), "Can't add multiple goods");
        wantList[who] = targetGoods;
    }

    function setWant(address who, address targetGoods) public {
        require(msg.sender == owner);
        wantList[who] = targetGoods;
    }

    function donateFund(address to, uint amount) public payable returns(bool) {
        require(wantList[to] != address(0), "Host not found.");
        // TODO: recover this settings
        // uint amount = msg.value;
        // require(amount > miniDUST, "amount not enough");
        if (accumulatedList[to][msg.sender] == 0) {
            // for the first time
            accumulatedUserList[to].push(msg.sender);
        }
        // require(accumulatedUserList[to].length < maxUsersPerGoods,"too many users");
       
        if (toptierUser[to].user == address(0) || toptierUser[to].amount < amount) {
            toptierUser[to].user = msg.sender;
            toptierUser[to].amount = amount;
        }

        accumulatedList[to][msg.sender] += amount; // protected by safe math
        // return _buy(to);
        return true;
    }

    function couldBuy(address to) public view returns(bool) {
        require(wantList[to] != address(0), "Host not found.");
        // require(accumulatedUserList[to].length > 0, "Host not found.");

        uint targetPrice = goodsOracle.getPrice(wantList[to]);
        uint accumulatedAmount = 0;
        for (uint i = 0; i < accumulatedUserList[to].length; i+=1) {
            address user = accumulatedUserList[to][i];
            accumulatedAmount += accumulatedList[to][user];
            if (targetPrice < accumulatedAmount) {
                return true;
            }
        }
        return false;
    }

    function _buy(address to) public returns(bool) {
        require(wantList[to] != address(0), "Host not found.");

        if (!couldBuy(to)) {
            return false;
        }
        if (accumulatedUserList[to].length == 0 ){
            return false;
        }
        // require(accumulatedUserList[to].length > 0, "Host not found.");

        uint targetPrice = goodsOracle.getPrice(wantList[to]);

        address top = toptierUser[to].user;
        uint topAmount = toptierUser[to].amount;
        require(top != address(0));
         bool hasBought = false;

        if (targetPrice <= topAmount) {
            withdrawInfo[top] += topAmount - targetPrice;
            hasBought = true;
            targetPrice = 0;
            accumulatedList[to][top] = 0;
            rewardNFT.safeMint(top, mintId * 10);
            mintId += 1;
        }


        uint accumulatedAmount = 0;
       
        for (uint i = 0; i < accumulatedUserList[to].length; i+=1) {
            address user = accumulatedUserList[to][i];
            if (!hasBought) {
                accumulatedAmount += accumulatedList[to][user];
                
                if (targetPrice < accumulatedAmount) {
                    // we could buy it
                    withdrawInfo[user] += accumulatedAmount - targetPrice;
                    hasBought = true;
                    delete wantList[to]; // remove from want list
                }
                rewardNFT.safeMint(user, mintId * 10 + 1);
                mintId += 1;
            } else {
                withdrawInfo[user] += accumulatedList[to][user];
            }
            accumulatedList[to][user] = 0;
        }
        return hasBought;
    }

    function withdrawRefund() public {
        (bool success, /* bytes memory data */) = msg.sender.call{value: withdrawInfo[msg.sender]}("");
        withdrawInfo[msg.sender] = 0;
        require(success);
    }

    function withdrawAll() public returns(bool){
        require(msg.sender == owner);
        (bool success, /* bytes memory data */) = msg.sender.call{value: address(this).balance}("");
        return success;
    }
}
