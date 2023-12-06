// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Test.sol";

contract ForkTest is Test {
	uint256[2] fork;

	function setUp() public {
	// Ethereum:
	fork[0] = vm.createFork("https://ethereum.publicnode.com");                          // 如果部分 rpc node 不允许 fork，则更换 rpc node
    // BSC:
	fork[1] = vm.createFork("https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3", 33760000);      // 如果部分 rpc node 未保存完整 blockchain，则可能未包含指定高度的区块，则更换 rpc node
	}

    // 创建 fork + 选中 fork
    function testSelectFork() public {
        vm.selectFork(fork[0]);
        console.log("the fork 0 chainId is", block.chainid);

        vm.selectFork(fork[1]);
        console.log("the fork 1 chainId is %s, and the block.number is %s", block.chainid, block.number);
    }

    // 创建并选中 fork（此方法不能保存 fork 实例）
    function testCreateSelectFork() public {
        vm.createSelectFork("https://ethereum.publicnode.com");
        console.log("the fork 0 chainId is", block.chainid);

        vm.createSelectFork("https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3", 33760000);
        console.log("the fork 1 chainId is %s, and the block.number is %s", block.chainid, block.number);
    }

    // 指定区块高度
    function testRollFork() public {
        vm.createSelectFork("https://ethereum.publicnode.com");
        console.log("the fork 0 BlockNumberBefore is: ", block.number);
        vm.rollFork(18639900);
        console.log("the fork 0 BlockNumberAfter is: ", block.number);

        vm.selectFork(fork[1]);
        console.log("the fork 1 BlockNumberBefore is: ", block.number);
        vm.rollFork(33750000);
        console.log("the fork 1 BlockNumberAfter is: ", block.number);
    }
}

contract AssertionsTest is Test {
    function setUp() public {}
    event AssertFnTest(bool a);
    function assertFn(bool a) public {
        require(a == true, "a should be true!");
    }

    function testExpectRevert() public {
        // Vm 库内包含了 3 种 expectRevert，对应如下的三个函数调用形式
        // 都是放在待测试的函数调用之前
        // 1. 不传参，期望后续的函数调用会 revert 。
        vm.expectRevert();
        assertFn(false);

        // 2. 传入参数（字符串），期望后续的函数调用会 revert 且返回的错误信息字符串与传入的参数相同。
        vm.expectRevert("a should be true!");
        assertFn(false);

        // 3. 传入函数选择器（bytes4类型），期望该函数选择器对应的函数的调用会 revert 。
        vm.expectRevert(bytes4(keccak256("assertFn(bool)")));
        assertFn(false);
    }

    // topic
    // a
    // b
    // d
    // data:
    // c
    // e
    event EmitFn(address indexed a, uint256 indexed b, uint256 c, uint256 indexed d, uint256 e);  // 标记了的 indexed 修饰符的变量优先打印在事件中 topic 结构体中（最多 3 个）

    function emitFn(address a, uint256 b, uint256 c , uint256 d, uint256 e) public {
        emit EmitFn(a, b, c, d, e);
    }

    function testEmit() public {
        // Vm 库内包含了 4 种 expectEmit 函数，要求先使用 vm.expect 函数，然后触发事件，再调用对应的函数。
        // 1. 无输入，检查所有 topic 和 data
        vm.expectEmit();                                 // 检查所有的 topics
        emit EmitFn(address(0x1), 1, 2, 3, 4);           // emit 1
        
        // 2. 输入 4 个布尔值，表示是否检查 topic(前 3 个)和 data（第 4 个）
        // 检查 topic 1 和 topic 2 ，但是不检查 topic 3, 第 4 个参量为 true，由于只有 3 个topic，因此第 4 个参量表示是否检查 data
        vm.expectEmit(true, true, false, true);
        // topic: 检查 address(0x1) 和 1 ，但是不检查 0 
        // data: 检查 2 和 4
        emit EmitFn(address(0x1), 1, 2, 0, 4);           // emit 2

        // 3. 输入 4 个布尔值和 1 个地址，表示是否检查 topic(前 3 个)和 data（第 4 个）以及调用者是否是某个特定地址
        vm.expectEmit(true, true, true, false, address(this));        // emit 3
        emit EmitFn(address(0x1), 1, 0, 3, 0);

        // 4. 输入 1 个地址，检查调用者是否是某个特定地址
        vm.expectEmit(address(this));        // emit 4
        emit EmitFn(address(0x1), 1, 2, 3, 4);

        // vm.expectEmit();
        // emit EmitFn(address(0x1), 1, 2, 3, 4);
        emitFn(address(0x1), 1, 2, 3, 4);             // emit 1
        // vm.expectEmit(true, true, false, true);
        // emit EmitFn(address(0x1), 1, 2, 0, 4); 
        emitFn(address(0x1), 1, 2, 9, 4);             // emit 2
        // vm.expectEmit(true, true, false, true, address(this));      
        // emit EmitFn(address(0x1), 1, 0, 3, 0);
        emitFn(address(0x1), 1, 8, 3, 7);             // emit 3
        // vm.expectEmit(address(this));
        // emit EmitFn(address(0x2), 8, 7, 6, 5);
        emitFn(address(0x1), 1, 2, 3, 4);             // emit 4


    // 注意：Foundry 在这个测试功能上有bug
    // 如果将各事件分开单独 vm.expectEmit、emit 事件、调用函数，这会导致报错！
    // 例如按照以下如此测试会报错：

        // vm.expectEmit();
        // emit EmitFn(address(0x1), 1, 2, 3, 4);
        // emitFn(address(0x1), 1, 2, 3, 4);             // emit 1

        // vm.expectEmit(true, true, false, true);
        // emit EmitFn(address(0x1), 1, 2, 0, 4); 
        // emitFn(address(0x1), 1, 2, 9, 4);             // emit 2

        // vm.expectEmit(true, true, false, true, address(this));      
        // emit EmitFn(address(0x1), 1, 0, 3, 0);
        // emitFn(address(0x1), 1, 2, 3, 4);             // emit 3

        // vm.expectEmit(address(this));
        // emit EmitFn(address(0x2), 8, 7, 6, 5);
        // emitFn(address(0x1), 1, 2, 3, 4);             // emit 4
    }

}