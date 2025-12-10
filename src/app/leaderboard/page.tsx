'use client'
import { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/ConnectWallet'
import Link from 'next/link'
import { BATTLE_CONTRACT_ADDRESS, BATTLE_CONTRACT_ABI } from '@/lib/contracts/battleContract'

interface PlayerData {
    address: string
    wins: number
    losses: number
    winRate: number
    totalBattles: number
}

export default function LeaderboardPage() {
    const { isConnected, address } = useAccount()
    const [leaderboardData, setLeaderboardData] = useState<PlayerData[]>([])
    const [playerRank, setPlayerRank] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    // Get leaderboard from contract
    const { data: leaderboard } = useReadContract({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: BATTLE_CONTRACT_ABI,
        functionName: 'getLeaderboard',
        args: [BigInt(100)] // Get top 100 players
    })

    // Get player's own record
    const { data: playerRecord } = useReadContract({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: BATTLE_CONTRACT_ABI,
        functionName: 'getPlayerRecord',
        args: address ? [address] : undefined,
    })

    useEffect(() => {
        if (leaderboard) {
            const [addresses, wins] = leaderboard as [string[], bigint[]]

            const formattedData: PlayerData[] = []

            // Process leaderboard data
            addresses.forEach((addr, index) => {
                if (addr !== '0x0000000000000000000000000000000000000000') {
                    const winCount = Number(wins[index])
                    formattedData.push({
                        address: addr,
                        wins: winCount,
                        losses: 0, // We'll need to fetch these separately if needed
                        winRate: 0,
                        totalBattles: winCount
                    })

                    // Check if this is the current player
                    if (address && addr.toLowerCase() === address.toLowerCase()) {
                        setPlayerRank(index + 1)
                    }
                }
            })

            setLeaderboardData(formattedData)
            setLoading(false)
        }
    }, [leaderboard, address])

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1: return '🥇'
            case 2: return '🥈'
            case 3: return '🥉'
            default: return `#${rank}`
        }
    }

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-yellow-400 bg-yellow-900/20'
            case 2: return 'text-gray-300 bg-gray-700/20'
            case 3: return 'text-amber-600 bg-amber-900/20'
            default: return 'text-gray-400 bg-slate-800/50'
        }
    }

    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 max-w-[600px] mx-auto">
            <header className="w-full flex justify-between items-center mb-8">
                <Link href="/battle" className="font-pixel text-xs text-gray-400 hover:text-white">‹ BACK TO BATTLE</Link>
                <h1 className="font-pixel text-xl text-yellow-400">🏆 LEADERBOARD</h1>
                <ConnectWallet />
            </header>

            {/* Player Stats */}
            {isConnected && playerRecord && (
                <div className="w-full bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4 mb-6 border border-purple-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Your Rank</p>
                            <p className="text-2xl font-bold text-yellow-400">
                                {playerRank ? getRankBadge(playerRank) : 'Unranked'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Your Record</p>
                            <div className="flex gap-4">
                                <div>
                                    <span className="text-green-400 font-bold">{Number(playerRecord.wins)}</span>
                                    <span className="text-xs text-gray-500 ml-1">W</span>
                                </div>
                                <div>
                                    <span className="text-red-400 font-bold">{Number(playerRecord.losses)}</span>
                                    <span className="text-xs text-gray-500 ml-1">L</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard Table */}
            <div className="w-full bg-slate-800/50 rounded-lg overflow-hidden">
                <div className="bg-slate-900 p-4 border-b border-slate-700">
                    <h2 className="font-pixel text-sm text-center">TOP 100 PLAYERS</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-pulse">Loading rankings...</div>
                    </div>
                ) : leaderboardData.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p>No battles recorded yet!</p>
                        <p className="text-sm mt-2">Be the first to claim the #1 spot!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700">
                        {leaderboardData.map((player, index) => {
                            const rank = index + 1
                            const isCurrentPlayer = address && player.address.toLowerCase() === address.toLowerCase()

                            return (
                                <div
                                    key={player.address}
                                    className={`flex items-center justify-between p-4 hover:bg-slate-700/30 transition ${
                                        isCurrentPlayer ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${getRankColor(rank)}`}>
                                            {getRankBadge(rank)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-sm">
                                                    {formatAddress(player.address)}
                                                </p>
                                                {isCurrentPlayer && (
                                                    <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">YOU</span>
                                                )}
                                            </div>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-green-400">{player.wins} wins</span>
                                                {player.losses > 0 && (
                                                    <span className="text-xs text-red-400">{player.losses} losses</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-yellow-400">{player.wins}</p>
                                        <p className="text-xs text-gray-500">victories</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="w-full mt-6 bg-slate-800/30 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400">
                    Rankings are updated in real-time on Base Mainnet
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Contract: {formatAddress(BATTLE_CONTRACT_ADDRESS)}
                </p>
            </div>

            {/* Call to Action */}
            {!isConnected && (
                <div className="w-full mt-8 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6 text-center">
                    <p className="text-yellow-400 mb-4">Connect your wallet to see your rank!</p>
                    <ConnectWallet />
                </div>
            )}

            {isConnected && !playerRank && (
                <Link
                    href="/battle"
                    className="w-full mt-8 bg-red-600 hover:bg-red-500 text-white text-center font-pixel py-4 rounded-xl shadow-lg transition"
                >
                    START BATTLING TO ENTER RANKINGS
                </Link>
            )}
        </main>
    )
}