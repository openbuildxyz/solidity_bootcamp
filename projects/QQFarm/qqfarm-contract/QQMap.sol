// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./ReentrancyGuard.sol";
import "./Ownable.sol";


struct TrustContract {
    string contractType;
    bool trust;
}

struct Map {
    address landOwner;
    uint256 u;
    uint256 d;
    uint256 l;
    uint256 r;
    uint256 g;
    uint256 s;
    string[] data;
    uint256 landRewards;
    bool isInit;
}

enum Direction {
    u, // up 0
    d, // down 1
    l, // left 2
    r, // right 3
    g, // ground 4
    s // sky 5
}

contract QQMap is Ownable, ReentrancyGuard {
    uint256 public landCounts;
    address payable public protocolFeeDestination;
    uint256 public protocolFeePercent = 0.05 ether;
    uint256 public landlordFeePercent =  0.05 ether;
    uint256 public maxFeeHoldTime = 180 days;

    mapping(uint => Map) lands;

    constructor(){
        landCounts = 1;
        Map memory newLand = Map({
            landOwner: msg.sender,
            u : 0,
            d : 0,
            l : 0,
            r : 0,
            g : 0,
            s : 0,
            data : new string[](0),
            landRewards : 2,
            isInit : true
        });

        lands[0] = newLand;
    }

    function mintLand(uint256 landId, uint256 direction) public {
        //todo: add access controll, who can mintLand around you


        Map storage myLand = lands[landId];
        uint256 newLandId = landCounts++;
        Direction directionEnum = Direction(direction);

        // constract new land
        Map memory newLand = Map({
            landOwner: msg.sender,
            u : 0,
            d : 0,
            l : 0,
            r : 0,
            g : 0,
            s : 0,
            data : new string[](0),
            landRewards : 0,
            isInit : true
        });

        lands[newLandId] = newLand;

        // assign land
        if(Direction.u == directionEnum){
            myLand.u = newLandId;
            newLand.d = landId;
        }
        else if (Direction.d == directionEnum){
            myLand.d = newLandId;
            newLand.u = landId;
        }
        else if (Direction.l == directionEnum){
            myLand.l = newLandId;
            newLand.r = landId;
        }
        else if (Direction.r == directionEnum){
            myLand.r = newLandId;
            newLand.l = landId;
        }
        else if (Direction.g == directionEnum){
            myLand.g = newLandId;
            newLand.s = landId;
        }
        else if (Direction.s == directionEnum){
            myLand.s = newLandId;
            newLand.g = landId;
        }
        //todo: add logs
    }

    function setMapData(uint256 landId ,string[] memory data)public {
        //todo: add only owner allows 
        lands[landId].data = data;
    }

    function getMap(uint256 mapId)public view returns (Map memory){
        return lands[mapId];
    }

    // todo: add erc721 to implement the NFT for lands
    // todo: define element and add element to data
    // todo: add access control with owneronly
    // todo: add merkleproof to whitelist other contracts
    // todo: implement reward system with ERC20
    // todo: add security such as reentrency guard
}