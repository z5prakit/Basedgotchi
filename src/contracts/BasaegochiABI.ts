export const BasaegochiABI = [
    {
        "type": "function",
        "name": "battlePoints",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPetStats",
        "inputs": [{ "name": "_owner", "type": "address", "internalType": "address" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct Basaegochi.PetStats",
                "components": [
                    { "name": "petType", "type": "uint8", "internalType": "uint8" },
                    { "name": "level", "type": "uint8", "internalType": "uint8" },
                    { "name": "wins", "type": "uint256", "internalType": "uint256" },
                    { "name": "losses", "type": "uint256", "internalType": "uint256" },
                    { "name": "lastBattleTime", "type": "uint256", "internalType": "uint256" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "recordBattleResult",
        "inputs": [
            { "name": "_winner", "type": "address", "internalType": "address" },
            { "name": "_loser", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registerPet",
        "inputs": [{ "name": "_petType", "type": "uint8", "internalType": "uint8" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registeredPets",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [
            { "name": "petType", "type": "uint8", "internalType": "uint8" },
            { "name": "level", "type": "uint8", "internalType": "uint8" },
            { "name": "wins", "type": "uint256", "internalType": "uint256" },
            { "name": "losses", "type": "uint256", "internalType": "uint256" },
            { "name": "lastBattleTime", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "BattleResult",
        "inputs": [
            { "name": "winner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "loser", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "wins", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "losses", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PetRegistered",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "petType", "type": "uint8", "indexed": false, "internalType": "uint8" }
        ],
        "anonymous": false
    }
] as const;
