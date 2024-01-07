//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../../interface/IERC721Ext.sol";
import "../../interface/IERC6551Account.sol";
import "../../interface/IERC6551Registry.sol";
import "../../tokens/LLTToken.sol";

contract LotLoot is
    Initializable,
    PausableUpgradeable,
    AccessControlEnumerableUpgradeable,
    UUPSUpgradeable
{
    event ParkCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );
    event UnParkCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );
    event FineCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );

    LLTToken lltToken;
    IERC721Ext carNFT;
    IERC721Ext parkingNFT;
    IERC6551Registry registry;
    IERC6551Account account;

    struct carInfo {
        uint startTime;
        uint parkTokenId;
    }
    struct parkInfo {
        uint startTime;
        uint carTokenId;
    }
    mapping(uint => carInfo) public cars;
    mapping(uint => parkInfo) public parks;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _lltToken,
        address _carNFT,
        address _parkingNFT,
        address _registry,
        address payable _account
    ) public initializer {
        lltToken = LLTToken(_lltToken);
        carNFT = IERC721Ext(_carNFT);
        parkingNFT = IERC721Ext(_parkingNFT);
        registry = IERC6551Registry(_registry);
        account = IERC6551Account(_account);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function parkCar(uint _carTokenId, uint _parkTokenId) public {
        require(
            carNFT.ownerOf(_carTokenId) == msg.sender,
            "You are not the owner of the car"
        );
        require(
            parkingNFT.ownerOf(_parkTokenId) != msg.sender,
            "You can not parking your park"
        );
        require(cars[_carTokenId].parkTokenId == 0, "Car is already parked");
        require(parks[_parkTokenId].carTokenId == 0, "Park is already full");
        cars[_carTokenId] = carInfo(block.timestamp, _parkTokenId);
        parks[_parkTokenId] = parkInfo(block.timestamp, _carTokenId);

        emit ParkCar(msg.sender, _carTokenId, _parkTokenId);
    }

    function unParkCar(uint _carTokenId) public {
        require(carNFT.ownerOf(_carTokenId) == msg.sender, "Not owner of car");
        require(cars[_carTokenId].parkTokenId != 0, "Car is not parked");

        _handleUnparkCar(_carTokenId);
        uint parkingTokenId = cars[_carTokenId].parkTokenId;

        parks[cars[_carTokenId].parkTokenId].carTokenId = 0;
        cars[_carTokenId].parkTokenId = 0;
        emit UnParkCar(msg.sender, _carTokenId, parkingTokenId);
    }

    function fineCar(uint _parkTokenId) public {
        require(
            parks[_parkTokenId].carTokenId != 0,
            "There are no cars in this space"
        );
        require(
            parkingNFT.ownerOf(_parkTokenId) == msg.sender,
            "Not owner of park"
        );
        _handleFineCar(_parkTokenId);
        uint carTokenId = parks[_parkTokenId].carTokenId;
        address carOwner = carNFT.ownerOf(carTokenId);

        cars[parks[_parkTokenId].carTokenId].parkTokenId = 0;
        parks[_parkTokenId].carTokenId = 0;
        emit FineCar(carOwner, carTokenId, _parkTokenId);
    }

    function viewCarOnPark(uint _carTokenId) public view returns (uint) {
        return cars[_carTokenId].parkTokenId;
    }

    function viewParkOnCar(uint _parkTokenId) public view returns (uint) {
        return parks[_parkTokenId].carTokenId;
    }

    function _handleFineCar(uint _parkTokenId) internal {
        address parkAddress = registry.account(
            address(account),
            block.chainid,
            address(parkingNFT),
            _parkTokenId,
            _parkTokenId
        );
        uint256 fineAmount = block.timestamp - parks[_parkTokenId].startTime;
        if (fineAmount > 1 days) {
            fineAmount = 1 days;
        }
        lltToken.mint(parkAddress, fineAmount);
    }

    function _handleUnparkCar(uint _carTokenId) internal {
        address carAddress = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        uint256 mintAmount = block.timestamp - cars[_carTokenId].startTime;
        if (mintAmount > 1 days) {
            mintAmount = 1 days;
        }
        lltToken.mint(carAddress, mintAmount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}
}
