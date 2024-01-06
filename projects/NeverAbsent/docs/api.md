组队打卡项目web页有一个打卡记录，demo中直接调用json-rpc的eth_getLogs获得。
接口说明[参见](https://docs.infura.io/networks/arbitrum/json-rpc-methods/eth_getlogs)

**REQUEST**

```curl https://sepolia.infura.io/v3/api-key \
-X POST \
-H "Content-Type: application/json" \
-d '{"method":"eth_getLogs","params":[{"topics":["0xed72c97b088105886a888bb13d240aed854fd0693a7b27f6d22e1c1b9e5a2523","0x0000000000000000000000003e1c2514810ce662dfde8f6e0f59432c85beb2c5"],"fromBlock":"0x4c8d5b"}],"id":1,"jsonrpc":"2.0"}'
```

**RESPONSE**

```json
{
"jsonrpc": "2.0",
"id": 1,
"result": [
{
"address": "0x9713b7cb3da2ed58acdb5b971cbeb0bd3a36d77e",
"blockHash": "0xae23b19fd44b1c156c737e30685fc583cca6f05a73f23a7f5244000d8a80aef6",
"blockNumber": "0x4c8d7e",
"data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006596094c0000000000000000000000000000000000000000000000000000000000000006",
"logIndex": "0x21",
"removed": false,
"topics": [
"0xed72c97b088105886a888bb13d240aed854fd0693a7b27f6d22e1c1b9e5a2523",
"0x0000000000000000000000003e1c2514810ce662dfde8f6e0f59432c85beb2c5"
],
"transactionHash": "0xcae7aef682ddce95241984fe499da642a5f04b645dbfdb3f080f3fab6319f518",
"transactionIndex": "0x15"
}
]
}