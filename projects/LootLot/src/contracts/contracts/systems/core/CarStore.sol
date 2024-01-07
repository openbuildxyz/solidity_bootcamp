//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../../interface/IERC721Ext.sol";
import "../../interface/IERC6551Account.sol";
import "../../interface/IERC6551Registry.sol";

contract CarStore is
    Initializable,
    PausableUpgradeable,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event CarMint(address indexed to, uint256 indexed tokenId, address account);

    IERC721Ext _carERC721;
    IERC6551Account _erc6551Account;
    IERC6551Registry _erc6551Registry;

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    //TODO initial token id
    uint256 internal _initialTokenId;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address carERC721_,
        address erc6551Registry_,
        address payable erc6551Account_
    ) public initializer {
        _carERC721 = IERC721Ext(carERC721_);
        _erc6551Registry = IERC6551Registry(erc6551Registry_);
        _erc6551Account = IERC6551Account(erc6551Account_);

        __Pausable_init();
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        _initialTokenId = 1000;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function currentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current() + _initialTokenId;
    }

    function _mintCar(address _address, uint256 _tokenId) internal {
        _carERC721.safeMint(_address, _tokenId);
    }

    function mint() public whenNotPaused nonReentrant returns (uint256) {
        uint256 _tokenId = currentTokenId();
        _tokenIdCounter.increment();
        address _to = _msgSender();

        _mintCar(_to, _tokenId);

        address account = _erc6551Registry.createAccount(
            address(_erc6551Account),
            block.chainid,
            address(_carERC721),
            _tokenId,
            _tokenId,
            new bytes(0)
        );

        emit CarMint(_to, _tokenId, account);

        return _tokenId;
    }
}
