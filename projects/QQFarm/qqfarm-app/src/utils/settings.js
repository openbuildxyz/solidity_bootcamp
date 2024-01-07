export const ProjectSettings = {
  projectName: "Landlord",
};

export const GameSettings = {
  gameWidth: 928,
  gameHeight: 512,
  playerDefaultSpeed: 2,
};

export const ContractSettings = {
  contractAddress: "0xff69F24493a2D614Ab97919e15BE0985b730aBE5",
  // contractProvider:    
  //"https://polygon-mumbai.g.alchemy.com/v2/f76qIXHZ88jMheR5VxonWdUoXFTqcCr_",
  contractProvider:
    "https://polygon-mumbai.infura.io/v3/5c1ebd7f484d44228a54a5e2d669e29f",
  alchemyApiKey: "f76qIXHZ88jMheR5VxonWdUoXFTqcCr_",
  alchemyProjectId: "fb3959e4d4a2e4654b70f711216dbe63",
  contractABI: [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "RenounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "mapId", type: "uint256" }],
      name: "getMap",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "landId", type: "uint256" },
            { internalType: "address", name: "landOwner", type: "address" },
            { internalType: "uint256", name: "u", type: "uint256" },
            { internalType: "uint256", name: "d", type: "uint256" },
            { internalType: "uint256", name: "l", type: "uint256" },
            { internalType: "uint256", name: "r", type: "uint256" },
            { internalType: "uint256", name: "g", type: "uint256" },
            { internalType: "uint256", name: "s", type: "uint256" },
            { internalType: "string[]", name: "data", type: "string[]" },
            { internalType: "uint256", name: "landRewards", type: "uint256" },
            { internalType: "bool", name: "isInit", type: "bool" },
          ],
          internalType: "struct Map",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "landCounts",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "landlordFeePercent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxFeeHoldTime",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "landId", type: "uint256" },
        { internalType: "uint256", name: "direction", type: "uint256" },
      ],
      name: "mintLand",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "protocolFeeDestination",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "protocolFeePercent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "landId", type: "uint256" },
        { internalType: "string[]", name: "data", type: "string[]" },
      ],
      name: "setMapData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
