export const findWalletAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseFee",
        type: "uint256",
      },
      {
        internalType: "address[2]",
        name: "owners",
        type: "address[2]",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "uint256[2]",
        name: "shares",
        type: "uint256[2]",
      },
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "interval",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "callbackGasLimit",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "vrfCoordinator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__AlreadyVoted",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__InvalidShare",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__NotAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__NotMatchedLength",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__NotOpen",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__PaymentFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "patients",
        type: "uint256",
      },
    ],
    name: "WalletCenter__UpkeepNotNeeded",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__VoteFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__WithdrawFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__YourTagNameIsTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "WalletCenter__YourTagWeightIsNotEnough",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tagWeight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tagName",
        type: "string",
      },
    ],
    name: "AddTag",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "isSupporting",
        type: "uint256",
      },
    ],
    name: "EnterVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "PickWinner",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tag",
        type: "string",
      },
    ],
    name: "addTag",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBaseFee",
    outputs: [
      {
        internalType: "uint256",
        name: "baseFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCenterState",
    outputs: [
      {
        internalType: "enum WalletCenter.CenterStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInterval",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastTimeStamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumWords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getPatients",
    outputs: [
      {
        internalType: "address payable[]",
        name: "patients",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRequestConfirmations",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getShare",
    outputs: [
      {
        internalType: "uint256",
        name: "share",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
    ],
    name: "getTags",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "tagName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tagWeight",
            type: "uint256",
          },
        ],
        internalType: "struct WalletCenter.TagInfo[]",
        name: "tags",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWalletIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "walletIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
    ],
    name: "getWalletInfoHistory",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "supporting",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unSupporting",
            type: "uint256",
          },
        ],
        internalType: "struct WalletCenter.WalletInfoHistory",
        name: "walletInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
    ],
    name: "getWalletInfoQuarter",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "supporting",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unSupporting",
            type: "uint256",
          },
        ],
        internalType: "struct WalletCenter.WalletInfoQuarter",
        name: "walletInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinner",
    outputs: [
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseFee",
        type: "uint256",
      },
    ],
    name: "setBaseFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "shares",
        type: "uint256[]",
      },
    ],
    name: "setShare",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "walletId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "isSupporting",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
