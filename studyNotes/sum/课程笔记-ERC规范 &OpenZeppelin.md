# **ERC 规范 & OpenZeppelin**

    本文是openbuild发起的《Solidity入门到精通》课程笔记，主讲老师pseudoyu是一名合约&后端开发工程师，阅读本文前，建议先阅读前solidty开发前两节课程，对solidity基本语法及合约开发框架、部署流程有一定了解。

    本文主要分3个部分：EIP及ERC介绍、OpenZeppelin介绍、ERC20/ERC721/ERC1155代码走读。

## EIP及ERC介绍

- Ethereum Improvement Proposals(EIPs)是以太坊区块链上进行更新和决策的核心方法，包括核心协议规范，客户端 API和合同标准。 任何人都可以参与以太坊的改进。可以在[这里](https://eips.ethereum.org/)查看所有的EIPs。

一个“成功的”EIP会经过以下几个状态：

`草案（Draft -> 最后召集（Last Call） -> 已接受（Accepte） -> 最终（Final）`

- Ethereum Request for Comment(ERC)是开发人员撰写的原始提案草案，通常指应用程序标准或约定，包含如：代币标准合约(**[ERC20](https://learnblockchain.cn/docs/eips/eip-20.html)**)，名称注册(**[ERC137](https://learnblockchain.cn/docs/eips/eip-137.html)**)，URI schemes (**[ERC681](https://learnblockchain.cn/docs/eips/eip-681.html)**)，库/包格式 (**[EIP190](https://learnblockchain.cn/docs/eips/eip-190.html)**)， 钱包格式 (**[EIP85](https://github.com/ethereum/EIPs/issues/85)**)等。

截止目前，ERC的token标准有ERC20、ERC721、ERC777、ERC1155、ERC4626。例如：ERC20定义了一个同质代币的基本功能，包括供应量、账户余额、转移、授权等，基于该标准开发人员可以构建可与其他产品和服务互操作的代币应用程序，同时允许钱包和去中心化交易所等应用重复使用该代币。

## OpenZeppelin介绍
OpenZeppelin是一个开源的以太坊智能合约代码库，它为开发人员提供了一套安全、可靠且可复用的合约组件和工具。[官网地址](https://www.openzeppelin.com/)

使用OpenZeppelin代码库好处就是**安全**+**丰富**+**可扩展**。
- **安全**: 指合约建立在社区安全审查的基础上，经过大量项目实践验证其安全性。
- **丰富**: 指它支持了几乎全部的ERC标准，包含各种token标准、权限控制、基础功能库(ECDSA、Merkel、Math、Structures、Muticall等）、投票治理等。
- **可扩展**: 大部分OpenZeppelin合约都是可继承的，开发者即可以通过继承将父合约的功能添加到自己的合约中，还可以使用重载来改变父合约的某些方法，也可以定义新的方法。

另外，OpenZeppelin提供了一整套用于部署和保护可升级智能合约的工具。

OpenZeppelin对常见的合约开发框架如Hardhat、Truffle、foundry均有很好的支持，基于OpenZeppelin可以快速进行合约开发，如实现一个NFT token只需要引入ERC721.sol并继承及即可。

OpenZeppelin详细的文档介绍可以参见文末[3]，登链社区有OpenZeppelin精读专题，感兴趣的同学可以阅读，[链接](https://learnblockchain.cn/column/30)。

## ERC20

ERC20由Fabian Vogelsteller于2015年11月提出，是一种在智能合约中实现同质代币的标准，它使每个代币与另一个代币具有完全相同的属性（类型和价值）。

ERC20要求实现下文的方法和事件。

方法

```
function name() public view returns (string)  //代币名称
function symbol() public view returns (string)  //代币符号
function decimals() public view returns (uint8) //精度，由于evm不支持小数，精度用来表示token的最小单位
function totalSupply() public view returns (uint256) //总供应量
function balanceOf(address _owner) public view returns (uint256 balance) //余额
function transfer(address _to, uint256 _value) public returns (bool success) //转移代币
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) //转移代币
function approve(address _spender, uint256 _value) public returns (bool success) //授权
function allowance(address _owner, address _spender) public view returns (uint256 remaining) //查询授权
```

事件

```
event Transfer(address indexed _from, address indexed _to, uint256 _value) //当成功转移token时一定要触发Transfer事件
event Approval(address indexed _owner, address indexed _spender, uint256 _value) //当approve方法执行成功时一定要触发Approval事件
```

#### 基于OpenZeppelin实现ERC20
```
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 固定总量代币
contract ERC20FixedSupply is ERC20 {
constructor(
string memory name, // 代币名称
string memory symbol, // 代币缩写
uint256 totalSupply // 发行总量
) ERC20(name, symbol) {
_mint(msg.sender, totalSupply);
}
}
```

### 核心方法走读
#### transfer方法
```
/**
* @dev Transfer token for a specified address
* @param to The address to transfer to.
* @param value The amount to be transferred.
*/
function transfer(address to, uint256 value) public returns (bool) {
    //判断msg.sender是否拥有足够数量的token
    require(value <= _balances[msg.sender]);
    //判断to不为0地址
    require(to != address(0));

    //发送者余额减少value，接受者增加value
    _balances[msg.sender] = _balances[msg.sender] - value;
    _balances[to] = _balances[to] + value;
    emit Transfer(msg.sender, to, value); //事件
    return true;
  }
```

> 1. 合约代码要求严谨，对参数和代码逻辑有严格校验，transfer方法需要校验发送者即方法调用者的余额充足，接受地址非0地址(0地址会导致token消失无法找回)。
> 2. transfer方法中涉及计算，0.8.20之前的版本要注意溢出问题。
> 3. 非标transfer方法问题：由于ERC20标准不对transfer的具体实现做要求，很多项目会在transfer中实现各种逻辑，如扣除手续费、权限控制、token通缩等，使用时一定要仔细查看实现逻辑。

#### transferFrom方法
```
function transferFrom(address from, address to, uint256 value) public returns (bool){
    //判断from是否拥有足够数量的token
    require(value <= _balances[from]);
    
    //判断from是否给msg.sender授权了足够数量的token
    require(value <= _allowed[from][msg.sender]);
    //判断to不为0地址
    require(to != address(0));
    
    //更新from和to的余额
    _balances[from] = _balances[from] - value;
    _balances[to] = _balances[to] + value;
    
    //更新from对msg.sender的授权额度
    _allowed[from][msg.sender] = _allowed[from][msg.sender] - value;
    emit Transfer(from, to, value);
    return true;
}
```
> 1. transferFrom方法功能和transfer一样，from参数是授权帐户，to是余额接受帐户，value是转帐额度，该函数的功能是将from帐户的余额转移value个数据至to用户帐户中，调用者必须是from帐户通过_approve对其进行过授权，并且还有剩余的授权额度。
> 2. transferFrom方法中token转移后需记得把授权额度减少value。

#### approve方法
```
/**
* @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
* Beware that changing an allowance with this method brings the risk that someone may use both the old
* and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
* race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
* https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
* @param spender The address which will spend the funds.
* @param value The amount of tokens to be spent.
  */
  function approve(address spender, uint256 value) public returns (bool) {
  require(spender != address(0));

    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
}
```
> approve方法用于token转移授权，approve后被授权账户可以通过调用transferFrom方法将授权账户token转移给任意用户。

#### ERC20扩展
项目方发币有各种不同需求，OpenZeppelin实现了ERC20扩展[文档链接](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)，具体如下:
- ERC20Burnable.sol 可销毁的ERC20代币
- ERC20WithMintable.sol 可增发的ERC20代币
- ERC20WithCapped.sol 有发行上限的ERC20代币
- ERC20WithPausable.sol 可暂停transfer的ERC20代币
- ERC20FlashMint.sol 支持闪电借贷的ERC20代币
- ERC20Permit.sol 支持离线授权的ERC20代币，该方式节省approve gas费
- ERC20Votes.sol 支持投票和投票委托的ERC20代币
- ERC20Wrapper.sol 基础ERC token的ERC20包装合约。

## ERC721
和ERC20一样，ERC721(Ethereum Request for Comments 721)也是一个代币标准,由 William Entriken、Dieter Shirley、Jacob Evans、Nastassia Sachs在2018年1月提出，ERC721官方简要解释是Non-Fungible Token Standard，简写为NFTs，多翻译为非同质代币，ERC721的Token最小的单位为1，无法再分割。ERC721代币一般用于具有唯一性的物品，如收藏品、密钥、彩票、音乐会座位编号、体育比赛等。

每个ERC721标准合约需要实现ERC721及ERC165接口，ERC721接口要求实现如下方法和事件。

方法
```
function balanceOf(address _owner) external view returns (uint256); //返回由_owner持有的NFTs的数量
function ownerOf(uint256 _tokenId) external view returns (address); //返回_tokenId代币持有者的地址
function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable; //转移NFT所有权同时发送data数据
function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;//转移NFT所有权
function transferFrom(address _from, address _to, uint256 _tokenId) external payable;//转移NFTs,与safeTransferFrom不同，调用者自己确认_to地址能正常接收NFT，否则将丢失此NFT
function approve(address _approved, uint256 _tokenId) external payable; //授予地址_to具有_tokenId的控制权
function setApprovalForAll(address _operator, bool _approved) external; //授予地址_operator具有所有NFTs的控制权
function getApproved(uint256 _tokenId) external view returns (address); //查询授权
function isApprovedForAll(address _owner, address _operator) external view returns (bool); //查询授权
```

事件
```
event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId); //nft成功转移必须发起Transer事件
event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId); //approve方法执行成功后需触发Approval事件
event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved); //setApprovalForAll方法执行成功后需触发ApprovalForAll事件
```

ERC165[官方提案链接](https://github.com/ethereum/ercs/blob/master/ERCS/erc-165.md)的接口定义如下文，它要求合约提供其实现了哪些接口，这样再与合约进行交互的时候可以先调用此接口进行查询。

```
function supportsInterface(bytes4 interfaceID) external view returns (bool);
```
interfaceID为函数选择器，计算方式有两种，如：bytes4(keccak256('supportsInterface(bytes4)'));或ERC165.supportsInterface.selector

### 基于OpenZeppelin实现ERC721

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}
}
```

### 核心方法走读
#### transferFrom方法
```
function transferFrom(address from, address to, uint id) public {
   //判断from账户拥有id
   require(from == _ownerOf[id], "from != owner");
   //判断to是否是0地址
   require(to != address(0), "transfer to zero address");
   //判断from是否将id授权给msg.sender
   require(_isApprovedOrOwner(from, msg.sender, id), "not authorized");

   //from拥有的token数量减1，to拥有的它token数量加1
   _balanceOf[from]--;
   _balanceOf[to]++;
   
   //id的拥有权改为to地址
   _ownerOf[id] = to;

    //删除原授权
   delete _approvals[id];

   //触发Transfer事件
   emit Transfer(from, to, id);
}
```
> 1. id在合约中用唯一的uint265进行标识，每个NFT的ID在智能合约的生命周期内不允许改变。实现方式可以从0开始，每新加一个NFT，id加1
> 2. 在transferFrom方法中需进行id的owner校验、to地址校验、授权校验，完成from/to的余额更新和id的owner更新后需要把原approve信息删除。

#### safeTransferFrom方法

```
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual {
        //转移tokenId
        transferFrom(from, to, tokenId);
        //校验to地址是否可以接受token
        _checkOnERC721Received(from, to, tokenId, data);
    }

    /**
     * @dev Private function to invoke {IERC721Receiver-onERC721Received} on a target address. This will revert if the
     * recipient doesn't accept the token transfer. The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
        //to.code.length大于0表示to是合约
        if (to.code.length > 0) {
            //调用to合约的onERC721Received方法并校验返回值是否等于IERC721Receiver.onERC721Received.selector
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721Receiver.onERC721Received.selector) {
                    revert ERC721InvalidReceiver(to);
                }
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert ERC721InvalidReceiver(to);
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }
```
> 1. safeTransferFrom在transferFrom方法之后执行了_checkOnERC721Received方法，在_checkOnERC721Received中检测如果to地址是合约地址且没有实现onERC721Received方法或onERC721Received返回值不等于`bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`则revert，说明合约不具备接受ERC721 token的能力。
> 2. 正是由于safeTransferFrom会调用合约的onERC721Received方法可能会导致安全漏洞，需要仔细阅读onERC721Received方法的实现逻辑。

## ERC1155
ERC1155是ERC20与ERC721的结合，可以代表和控制任何数量的同质化和非同质化代币类型。该方式为需要多个代币的项目节省大量的Gas成本，项目方无需为每种代币类型部署新合约，单个ERC1155代币合约可以保存整个系统状态，从而降低部署成本和复杂性。
ERC1155要求实现如下方法和事件。

方法

```
    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external; //将value数量的token _id从from账户转移给to账户
    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external; //批量转移，相当于调用多次safeTransferFrom
    function balanceOf(address _owner, uint256 _id) external view returns (uint256); //返回_owner账户拥有代币_id的数量
    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory); //返回批量_owners账户拥有代币_ids的数量
    function setApprovalForAll(address _operator, bool _approved) external; //授予地址_operator具有所有id的控制权，考虑到简洁性，该方法直接设置操作帐户为已批准或未批准，而不区分代币类型和数量。
    function isApprovedForAll(address _owner, address _operator) external view returns (bool); //查询授权
```

事件

```
    event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value); //单笔转移safeTransferFrom执行成功后必须触发TransferSingle事件
    event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values); //批量转移safeBatchTransferFrom执行成功后必须触发TransferBatch事件
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved); //授权操作setApprovalForAll执行成功后必须触发ApprovalForAll事件
    event URI(string _value, uint256 indexed _id);//URI的值改变时触发该事件，记录信息
```
#### 基于OpenZeppelin实现ERC1155
```
// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**27, "");
        //供应量为1说明是NFT
        _mint(msg.sender, THORS_HAMMER, 1, "");
        _mint(msg.sender, SWORD, 10**9, "");
        _mint(msg.sender, SHIELD, 10**9, "");
    }
}
```
上面是一个游戏项目的代币合约，GOLD是一种可替代的代币，和ERC20一致，供应量有10**18个，而THORS_HAMMER是一种不可替代的代币，因为我们只铸造了一个，相当于ERC721。

### 核心方法走读
#### balanceOfBatch方法
```
// 返回account账号列表对应的id代币的数量
    /**
     * @dev See {IERC1155-balanceOfBatch}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) public view virtual returns (uint256[] memory) {
        //账户数量和id数量长度校验
        if (accounts.length != ids.length) {
            revert ERC1155InvalidArrayLength(ids.length, accounts.length);
        }
        //申请内存数组
        uint256[] memory batchBalances = new uint256[](accounts.length);

        //将account[i]账户的ids[i]的余额记录到batchBalances[i]中
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts.unsafeMemoryAccess(i), ids.unsafeMemoryAccess(i));
        }

        return batchBalances;
    }
```
> 支持批量操作是ERC1155的一大特点，支持批量查询余额、批量审批、批量转账。balanceOfBatch就是将balanceOf方法多次执行结果存入申请的batchBalances数组中。

#### safeTransferFrom方法
```
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external {
    
        //判断是否经过授权
        require(
            msg.sender == from || isApprovedForAll[from][msg.sender],
            "not approved"
        );
        //判断to不为0地址
        require(to != address(0), "to = 0 address");
        //from的id余额减少value数量，同时to的id余额增加value
        balanceOf[from][id] -= value;
        balanceOf[to][id] += value;
        
        //事件
        emit TransferSingle(msg.sender, from, to, id, value);
        
        //to是合约时，要求实现onERC1155Received方法并返回IERC1155TokenReceiver.onERC1155Received.selector
        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155Received(
                    msg.sender,
                    from,
                    id,
                    value,
                    data
                ) == IERC1155TokenReceiver.onERC1155Received.selector,
                "unsafe transfer"
            );
        }
    }
```

OpenZeppelin工程代码结构比较复杂涉及到多个内部方法调用，考虑到篇章长度使用了solidity合约example合约中的方法。
> 1. 和ERC721一样，在实现token交易逻辑后面，同样也判断了to地址是否为合约地址，是合约地址时需要实现onERC1155Received方法并返回`bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`，否则to合约无法接受ERC1155 token，同样hook机制可能会导致合约产生安全漏洞。
> 2. data数据没有格式限制，在调用to地址的onERC1155Received方法时需要不做修改的传递。

#### safeBatchTransferFrom方法
```
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
) external {
        require(msg.sender == from || isApprovedForAll[from][msg.sender],"not approved");
        require(to != address(0), "to = 0 address");
        require(ids.length == values.length, "ids length != values length");

        for (uint256 i = 0; i < ids.length; i++) {
            balanceOf[from][ids[i]] -= values[i];
            balanceOf[to][ids[i]] += values[i];
        }

        emit TransferBatch(msg.sender, from, to, ids, values);

        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155BatchReceived(
                    msg.sender,
                    from,
                    ids,
                    values,
                    data
                ) == IERC1155TokenReceiver.onERC1155BatchReceived.selector,
                "unsafe transfer"
            );
        }
    }
```
> 1. safeBatchTransferFrom是safeTransferFrom的批量操作，表示将from账户的ids token转移给to地址，数量是对应values数组，因此要求ids长度和values长度相等，from账户中ids的数量大于等于values。
> 2. 与safeTransferFrom不同的是，safeBatchTransferFrom回调to合约的onERC1155BatchReceived方法，执行成功后发送的是TransferBatch事件。

**最后，强烈推荐初学者阅读solidity合约example合集，该网站提供了solidity的基本语法、应用、安全漏洞、defi项目示例，并且可以直接链接到remix中部署和测试，是学习solidity的宝贵资源。网站链接见相关文档资料[4]。**

## 相关文档资料：

[1] 关于EIP和ERC的关系[链接](https://www.coindesk.com/learn/what-are-eip-and-erc-and-how-are-they-connected/)

[2] 全部EIPs中文翻译[链接](https://learnblockchain.cn/docs/eips/)

[3] OpenZeppelin合约文档[链接](https://docs.openzeppelin.com/contracts/5.x/)

[4] solidity合约example合集[链接](https://solidity-by-example.org/)

[5] Cobo：解析 ERC20 代币非标准 transfer 函数引入的安全风险[链接](https://foresightnews.pro/article/detail/10615)
