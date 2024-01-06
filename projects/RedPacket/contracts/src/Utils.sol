// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

abstract contract Utils {
    // 设置percent的精确度，越大越精确
    uint64 private decimal = 10000;
    uint256 private seed;

    constructor() {
        // 初始化种子，可以选择任意值，比如当前区块的哈希值
        seed = 1;
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
    ) public view returns (uint256[] memory) {
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

     // 修改种子
    function setSeed(uint256 _seed) external {
        seed = _seed;
    }

    // 生成指定范围内的伪随机数
    function getRandomNumber(
        uint256 minValue,
        uint256 maxValue
    ) external returns (uint256) {
        require(minValue < maxValue, "Invalid range");

        // 使用keccak256哈希函数生成伪随机数
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), seed))
        );

        // 取模计算在范围内的随机数
        uint256 result = (randomNumber % (maxValue - minValue + 1)) + minValue;

        // 更新种子
        seed = randomNumber;

        return result;
    }
}
