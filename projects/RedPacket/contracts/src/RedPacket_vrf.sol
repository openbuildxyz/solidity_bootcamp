// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract RedPacket is VRFConsumerBaseV2, ConfirmedOwner {
    mapping(address => User) private userMap;
    mapping(uint256 => Packet) public packetMap;
    uint256[] public allPacketIds;
    // 随机数ID对应的红包
    mapping(uint256 => uint256) private requestIdToPacketId;
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;
    // 小钱钱
    uint256 public contractBalance;
    // 设置percent的精确度，越大越精确
    uint64 private decimal = 10000;
    IERC20 public token; // 代币合约
    address public _owner;
    // Your subscription ID.
    uint64 public s_subscriptionId;
    // past requests Id.
    uint256[] private requestIds;
    uint256 private lastRequestId;
    bytes32 keyHash;
    uint32 callbackGasLimit = 1000000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    error LIMIT_ERROR(string); // 红包人数限制异常
    error TIMES_ERROR(string); // 红包次数限制异常
    error NOT_ENOUGH_DEPOSIT(string); // 押金不够
    error NO_PACKET(string); // 没有找到对应红包
    error FULL_USER(string); // 用户满了
    error NOT_ENOUGH_USER(string); // 参加的用户不够
    error NO_USER(string); // 没有对应用户
    error ALREADY_ATTEND(string); // 已经参加红包
    error BALANCE_NOT_ENOUGH(string); // 余额不足
    error CONTRACT_BALANCE_NOT_ENOUGH(string); // 合约余额不足
    error NOT_OWNER(); // 合约余额不足

    event StartPacket(uint256 packetId); // 人数凑齐，开始红包开始
    event EndPacket(uint256 packetId); // 红包整体结束
    event ContinuePacket(uint256 packetId); // 单次红包结束
    event Log(uint256 msg); // debug日志
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event createPacketSuccess(uint256 packetId); // 创建红包成功
    event attendPacketSuccess(uint256 packetId); // 参加红包成功

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    // 红包信息
    struct Packet {
        uint256 id; // id
        uint256 startTime; // 发起红包时间
        uint256 amount; // 单个红包金额
        string collectType; // 红包类型
        bool lock; // 红包锁
        uint8 currentTimes; // 当前次数
        uint8 times; // 当前次数
        uint32 limit; // 限制人数
        address[] users; // 当前参加的人数
        address creator; // 发起人
        address currentUser; // 当前需要发红包的人
        bool exist; // 是否存在
        uint256 requestId; // 随机数映射id，方便vrf回调
    }

    // 个人用户信息
    struct User {
        uint256 deposit;
        bool lock;
        bool active;
        bool exist;
        uint256 packetId; // 正在参加的红包ID
        uint256[] packetIds; // 参加过的红包ID
    }

    struct RandomArrayResult {
        uint256[] array;
        uint256 maxIndex;
    }

    constructor(
        uint64 _subscriptionId,
        address _subscriptionAddr,
        bytes32 _keyHash,
        address _tokenAddress
    ) VRFConsumerBaseV2(_subscriptionAddr) ConfirmedOwner(msg.sender) {
        _owner = msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(_subscriptionAddr);
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        token = IERC20(_tokenAddress);
    }

    modifier _onlyOwner() {
        if (msg.sender != _owner) {
            revert NOT_OWNER();
        }
        _; // 继续执行被修饰的函数
    }

    // 获取发起人对应的红包
    function getPacket(uint256 _id) public view returns (Packet memory) {
        Packet memory currentPacket = packetMap[_id];
        if (!currentPacket.exist) {
            revert NO_PACKET("getPacket");
        }
        return currentPacket;
    }

    // 获取发起人对应的红包
    function getUser() public view returns (User memory) {
        User memory currentUser = userMap[msg.sender];
        if (!currentUser.exist) {
            revert NO_USER("getUser");
        }
        return currentUser;
    }

    // 获取发起人对应的红包
    function getPackets(
        uint256[] memory _ids
    ) public view returns (Packet[] memory) {
        Packet[] memory packets = new Packet[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 _id = _ids[i];
            Packet memory currentPacket = packetMap[_id];
            if (!currentPacket.exist) {
                revert NO_PACKET("getPackets");
            }
            packets[i] = currentPacket;
        }

        return packets;
    }

    // 获取发起人对应的红包
    function getAllPackets() public view returns (Packet[] memory) {
        uint256[] memory _ids = allPacketIds;
        return getPackets(_ids);
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
        userMap[msg.sender].packetId = id;
        userMap[msg.sender].packetIds.push(id);
        allPacketIds.push(id);
        packetMap[id] = packet;
        emit createPacketSuccess(id);
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

    function getBalance() external view returns (uint256) {
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
        userMap[msg.sender].packetIds.push(_id);
        userMap[msg.sender].lock = true;
        emit attendPacketSuccess(_id);
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
            uint256[] memory packetIds = new uint256[](0);
            userMap[msg.sender] = User(0, false, true, true, 0, packetIds);
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
            // startPacket(packetId);
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

    // function withdrawalDeposit(uint256 deposit) public {
    //     _extractTokens(deposit);
    // }

    // 合约拥有者可以提取合约余额
    function withdrawContractBalance() public _onlyOwner {
        // require(
        //     msg.sender == _owner,
        //     "Only the _owner can withdraw contract balance"
        // );
        // payable(_owner).transfer(address(this).balance);
        token.transfer(_owner, contractBalance);
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

    // 计算随机数的百分比
    function calculatePercentages(
        uint256[] memory _randomWords
    ) public view returns (uint256[] memory) {
        uint256[] memory percentages = new uint256[](_randomWords.length);
        uint256 total = 0;

        // 计算总和
        for (uint256 i = 0; i < _randomWords.length; i++) {
            total += _randomWords[i] / decimal;
        }

        // 计算百分比
        for (uint256 i = 0; i < _randomWords.length; i++) {
            percentages[i] = (_randomWords[i]) / total;
        }

        return percentages;
    }

    function getCountByPercent(
        uint256[] memory _randomWords,
        uint256 _amount
    ) private returns (uint256[] memory) {
        uint256[] memory percentages = calculatePercentages(_randomWords);
        uint256[] memory amounts = new uint256[](percentages.length);
        // 计算总和
        for (uint256 i = 0; i < percentages.length; i++) {
            uint256 percentage = percentages[i];
            amounts[i] = (_amount * percentage) / decimal;
        }
        return amounts;
    }

    // 生成唯一id
    function generateUniqueID(
        address userAddress
    ) public view returns (uint256) {
        return
            uint256(keccak256(abi.encodePacked(block.timestamp, userAddress)));
    }

    // 允许其他地址将 ERC-20 代币转移到合约
    function _receiveTokens(uint256 amount) internal {
        if (token.balanceOf(msg.sender) < amount) {
            revert BALANCE_NOT_ENOUGH("receiveTokens");
        }
        token.transferFrom(msg.sender, address(this), amount);
    }

    function _extractTokens(uint256 amount) internal {
        if (token.balanceOf(msg.sender) < amount) {
            revert BALANCE_NOT_ENOUGH("_extractTokens");
        }

        token.transferFrom(msg.sender, address(this), amount);
    }

    // 获取合约中的代币余额
    function getContractBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // 用户提取提取代币
    function withdrawTokens(uint256 amount) public {
        if (getDeposit() >= amount) {
            revert BALANCE_NOT_ENOUGH("withdrawTokens");
        }
        token.transfer(msg.sender, amount);
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords(
        uint32 numWords
    ) public returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function setRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}
