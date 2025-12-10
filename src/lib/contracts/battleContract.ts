// Clean and validate the contract address
const cleanAddress = (addr: string | undefined): `0x${string}` => {
    if (!addr) return '0x8853C1dA8CD2bb1701804039F1d5AEBDAe95b52A'
    // Remove any whitespace, newlines, and non-hex characters except 0x prefix
    const cleaned = addr.trim().replace(/[^\da-fA-Fx]/g, '')
    // Ensure it starts with 0x and is the right length
    if (cleaned.startsWith('0x') && cleaned.length === 42) {
        return cleaned as `0x${string}`
    }
    return '0x8853C1dA8CD2bb1701804039F1d5AEBDAe95b52A'
}

export const BATTLE_CONTRACT_ADDRESS = cleanAddress(process.env.NEXT_PUBLIC_BATTLE_CONTRACT_ADDRESS);

export const BATTLE_CONTRACT_ABI = [
  {
    "inputs": [
      { "name": "opponent", "type": "address" },
      { "name": "playerWon", "type": "bool" },
      { "name": "playerScore", "type": "uint256" },
      { "name": "opponentScore", "type": "uint256" }
    ],
    "name": "recordBattleResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "player", "type": "address" }],
    "name": "getPlayerRecord",
    "outputs": [
      {
        "components": [
          { "name": "player", "type": "address" },
          { "name": "wins", "type": "uint256" },
          { "name": "losses", "type": "uint256" },
          { "name": "totalBattles", "type": "uint256" },
          { "name": "lastBattleTime", "type": "uint256" },
          { "name": "winStreak", "type": "uint256" },
          { "name": "highestWinStreak", "type": "uint256" }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "limit", "type": "uint256" }],
    "name": "getLeaderboard",
    "outputs": [
      { "name": "", "type": "address[]" },
      { "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "player", "type": "address" }],
    "name": "canPlayerBattle",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "player", "type": "address" }],
    "name": "getTimeUntilNextBattle",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;