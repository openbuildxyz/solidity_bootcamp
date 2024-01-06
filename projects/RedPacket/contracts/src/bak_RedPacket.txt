// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import {VRFv2Consumer} from "./ChainLinkVRF.sol";
import {Utils} from "./Utils.sol";
import {Transfer} from "./Transfer.sol";
import "./Struct.sol";

contract RedPacket is VRFv2Consumer, Utils, Transfer {
    uint256 public contractBalance;
    mapping(address => User) private userMap;
    mapping(uint256 => Packet) private packetMap;
    // 随机数ID对应的红包
    mapping(uint256 => uint256) private requestIdToPacketId;
    // 小钱钱

    error LIMIT_ERROR(string); // 红包人数限制异常
    error TIMES_ERROR(string); // 红包次数限制异常
    error NOT_ENOUGH_DEPOSIT(string); // 押金不够
    error NO_PACKET(string); // 没有找到对应红包
    error FULL_USER(string); // 用户满了
    error NOT_ENOUGH_USER(string); // 参加的用户不够
    error NO_USER(string); // 没有对应用户
    error ALREADY_ATTEND(string); // 已经参加红包

    event StartPacket(uint256 packetId); // 人数凑齐，开始红包开始
    event EndPacket(uint256 packetId); // 红包整体结束
    event ContinuePacket(uint256 packetId); // 单次红包结束
    event Log(uint256 msg); // debug日志

    constructor(
        uint64 _subscriptionId,
        address _subscriptionAddr,
        address _tokenAddress
    )
        VRFv2Consumer(_subscriptionId, _subscriptionAddr)
        Transfer(_tokenAddress)
    {}

    // 获取发起人对应的红包
    function getPacket(uint256 _id) public view returns (Packet memory) {
        Packet memory currentPacket = packetMap[_id];
        if (!currentPacket.exist) {
            revert NO_PACKET("getPacket");
        }
        return currentPacket;
    }


    // 创建一个新钱包
    function createPacket(
        uint256 _amount,
        string memory collectType,
        uint32 _limit,
        uint8 _times
    ) external returns (uint256 packetId) {
        if (_limit != 5 && _limit != 10) {
            revert LIMIT_ERROR("createPacket");
        }
        if (_times != 5 && _times != 10) {
            revert TIMES_ERROR("createPacket");
        }
        uint256 deposit = getDeposit();
        if (deposit < _amount * 10) {
            revert NOT_ENOUGH_DEPOSIT("createPacket");
        }
        address[] memory users = new address[](1);
        users[0] = msg.sender;
        uint256 id = generateUniqueID(msg.sender);
        // 创建一个新的钱包
        Packet memory packet = Packet(
            id,
            block.timestamp,
            _amount,
            collectType,
            false,
            1,
            _times,
            _limit,
            users,
            msg.sender,
            msg.sender,
            true,
            0
        );
        packetMap[id] = packet;
        return id;
    }

    function subDeposit(uint256 _num, address userAddress) internal {
        User memory user = userMap[userAddress];
        if (user.deposit < _num) {
            revert NOT_ENOUGH_DEPOSIT("subDeposit");
        }
        userMap[userAddress].deposit = user.deposit - _num;
    }

    function addDeposit(uint256 _num, address userAddress) internal {
        User memory user = userMap[userAddress];
        userMap[userAddress].deposit = user.deposit + _num;
    }

    function getBalance()external view returns(uint256){
        return contractBalance;
    }

    // 参与到红包中
    function attendPacket(uint256 _id) external {
        Packet memory packet = packetMap[_id];
        uint256 deposit = getDeposit();
        if (!packet.exist) {
            revert NO_PACKET("attendPacket");
        }
        if (packet.lock) {
            revert FULL_USER("attendPacket");
        }
        if (userMap[msg.sender].lock) {
            revert ALREADY_ATTEND("attendPacket");
        }
        if (deposit < packet.amount * 10) {
            revert NOT_ENOUGH_DEPOSIT("attendPacket");
        }

        packetMap[_id].users.push(msg.sender);
        userMap[msg.sender].packetId = _id;
        userMap[msg.sender].lock = true;
        // 减少访问packetMap的gas
        if (packet.users.length + 1 == packet.limit) {
            startPacket(packet.id);
        }
    }

    // 追加押金
    function addDeposit(uint256 _deposit) external returns (uint256 deposit) {
        initUser();
        User memory userInfo = userMap[msg.sender];
        _receiveTokens(_deposit);
        userMap[msg.sender].deposit = userInfo.deposit + _deposit;

        return userMap[msg.sender].deposit;
    }

    function getDeposit() public view returns (uint256 deposit) {
        return userMap[msg.sender].deposit;
    }

    // 初始化个人信息
    function initUser() internal {
        if (!userMap[msg.sender].exist) {
            userMap[msg.sender] = User(0, false, true, true, 0);
        }
    }

    // 开始抢红包
    function startPacket(uint256 _id) internal returns (uint256 requestId) {
        Packet memory packet = getPacket(_id);
        if (!packet.exist) {
            revert NO_PACKET("startPacket");
        }
        if (packet.users.length != packet.limit) {
            revert NOT_ENOUGH_USER("startPacket");
        }
        subDeposit(packet.amount, packet.currentUser);
        requestId = requestRandomWords(packet.limit);
        packetMap[_id].requestId = requestId;
        requestIdToPacketId[requestId] = _id;
        emit StartPacket(_id);
        return requestId;
    }

    // VRF回调，继续抢红包
    function continuePacket(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal {
        uint256 packetId = requestIdToPacketId[_requestId];
        Packet memory packet = getPacket(packetId);
        // 按照随机数字获取百分比然后获取每个用户分到的amount
        uint256[] memory amounts = getCountByPercent(
            _randomWords,
            packet.amount
        );
        uint256 balance = packet.amount;
        uint256 max = 0;
        address maxUser;
        for (uint8 i = 0; i < amounts.length; i++) {
            uint256 amount = amounts[i];
            address userAddress = packet.users[i];
            if (amount >= max) {
                maxUser = userAddress;
                max = amount;
            }
            balance = balance - amount;
            addDeposit(amount, userAddress);
        }
        contractBalance += balance;
        if (packet.currentTimes >= packet.times) {
            unlock(packetId);
            emit EndPacket(packetId);
        } else {
            packetMap[packetId].currentTimes = packet.currentTimes + 1;
            packetMap[packetId].currentUser = maxUser;
            // 测试需要把这个注释掉
            startPacket(packetId);
        }

        emit ContinuePacket(packetId);
    }

    function unlock(uint256 packetId) internal {
        address[] memory userAddresses = getPacket(packetId).users;
        for (uint256 i = 0; i < userAddresses.length; i++) {
            address userAddress = userAddresses[i];
            userMap[userAddress].lock = false;
        }
    }

    function withdrawalDeposit(uint256 deposit) public {
        _extractTokens(deposit);
    }

    // 合约拥有者可以提取合约余额
    function withdrawContractBalance() public {
        // require(
        //     msg.sender == owner,
        //     "Only the owner can withdraw contract balance"
        // );
        // payable(owner).transfer(address(this).balance);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        setRandomWords(_requestId, _randomWords);
        emit RequestFulfilled(_requestId, _randomWords);

        continuePacket(_requestId, _randomWords);
    }
}
