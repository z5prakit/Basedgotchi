'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectWallet } from '@/components/ConnectWallet'
import { useAppData } from '@/hooks/useAppData'
import Link from 'next/link'
import { BATTLE_CONTRACT_ADDRESS, BATTLE_CONTRACT_ABI } from '@/lib/contracts/battleContract'

// Available pets and their stages (excluding egg)
const PET_TYPES = ['base-bull', 'crypto-cat', 'defi-phoenix', 'eth-dragon', 'meme-dog']
const PET_STAGES = ['baby', 'teen', 'adult']

function getRandomOpponent(playerLevel: number) {
    const randomPet = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)]

    // Generate opponent level based on player level (±10 levels for fair match)
    const minLevel = Math.max(1, playerLevel - 10)
    const maxLevel = playerLevel + 10
    const opponentLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel

    // Determine stage based on level
    let stage = 'baby'
    if (opponentLevel > 20) stage = 'adult'
    else if (opponentLevel > 10) stage = 'teen'

    return {
        petType: randomPet,
        stage: stage,
        level: opponentLevel,
        address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}` as `0x${string}`
    }
}

// Calculate battle outcome based on levels and randomness
function calculateBattleOutcome(playerLevel: number, opponentLevel: number) {
    // Base win chance calculation
    const levelDiff = playerLevel - opponentLevel
    let winChance = 0.5 // 50% base chance

    // Each level difference adds/subtracts 5% win chance
    winChance += (levelDiff * 0.05)

    // Cap win chance between 5% and 95%
    winChance = Math.max(0.05, Math.min(0.95, winChance))

    // Add some randomness
    const roll = Math.random()
    const playerWins = roll < winChance

    // Calculate health remaining based on level difference
    let playerHealthRemaining = 100
    let opponentHealthRemaining = 100

    if (playerWins) {
        // Player wins - opponent health goes to 0
        opponentHealthRemaining = 0
        // Player health depends on level difference
        if (levelDiff > 10) {
            playerHealthRemaining = 70 + Math.random() * 30 // 70-100 health
        } else if (levelDiff > 0) {
            playerHealthRemaining = 40 + Math.random() * 40 // 40-80 health
        } else {
            playerHealthRemaining = 10 + Math.random() * 30 // 10-40 health
        }
    } else {
        // Opponent wins - player health goes to 0
        playerHealthRemaining = 0
        // Opponent health depends on level difference
        if (levelDiff < -10) {
            opponentHealthRemaining = 70 + Math.random() * 30 // 70-100 health
        } else if (levelDiff < 0) {
            opponentHealthRemaining = 40 + Math.random() * 40 // 40-80 health
        } else {
            opponentHealthRemaining = 10 + Math.random() * 30 // 10-40 health
        }
    }

    return {
        playerWins,
        playerHealth: Math.round(playerHealthRemaining),
        opponentHealth: Math.round(opponentHealthRemaining),
        winChance: Math.round(winChance * 100)
    }
}

export default function BattlePage() {
    const { isConnected, address } = useAccount()
    const { petData } = useAppData()
    const [gameState, setGameState] = useState<'lobby' | 'searching' | 'battle' | 'result'>('lobby')
    const [log, setLog] = useState<string[]>([])
    const [opponent, setOpponent] = useState<ReturnType<typeof getRandomOpponent> | null>(null)
    const [battleResult, setBattleResult] = useState<{ won: boolean; playerScore: number; opponentScore: number } | null>(null)
    const [playerHealth, setPlayerHealth] = useState(100)
    const [opponentHealth, setOpponentHealth] = useState(100)
    const [showSignButton, setShowSignButton] = useState(false)

    // Contract interactions
    const { writeContract, data: hash, isPending: isRecording, error: writeError } = useWriteContract()
    const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash })

    // Log errors
    useEffect(() => {
        if (writeError) {
            console.error('Write contract error:', writeError)
            setLog(prev => [...prev, `❌ Transaction failed: ${writeError.message}`])
            setShowSignButton(true)
        }
    }, [writeError])

    // Read player record from contract
    const { data: playerRecord, refetch: refetchRecord } = useReadContract({
        address: BATTLE_CONTRACT_ADDRESS,
        abi: BATTLE_CONTRACT_ABI,
        functionName: 'getPlayerRecord',
        args: address ? [address] : undefined,
    })

    // Get actual pet stage based on level
    const getPetStageForBattle = () => {
        if (petData.level === 0) return 'egg'
        if (petData.level <= 10) return 'baby'
        if (petData.level <= 20) return 'teen'
        if (petData.level <= 30) return 'adult'
        return 'adult'
    }

    const startBattle = async () => {
        setGameState('searching')
        setLog([])
        setBattleResult(null)
        setPlayerHealth(100)
        setOpponentHealth(100)
        setShowSignButton(false)

        // Generate random opponent based on player level
        const newOpponent = getRandomOpponent(petData.level || 1)
        setOpponent(newOpponent)

        // Simulate matchmaking
        setTimeout(() => {
            setGameState('battle')
            runBattleSimulation(newOpponent)
        }, 2000)
    }

    const runBattleSimulation = async (currentOpponent: ReturnType<typeof getRandomOpponent>) => {
        setLog([])

        // Calculate battle outcome based on levels
        const outcome = calculateBattleOutcome(petData.level || 1, currentOpponent.level)

        // Show win chance
        setLog(prev => [...prev, `Win chance: ${outcome.winChance}% (Level ${petData.level} vs Level ${currentOpponent.level})`])

        // Battle simulation with damage
        const battleSteps = outcome.playerWins ? [
            { message: "Battle Start! ⚔️", playerDamage: 0, opponentDamage: 0 },
            { message: "Your pet attacks!", playerDamage: 0, opponentDamage: 20 },
            { message: "Opponent strikes back!", playerDamage: 15, opponentDamage: 0 },
            { message: "Critical hit from your pet!", playerDamage: 0, opponentDamage: 35 },
            { message: "Opponent uses special move!", playerDamage: 20, opponentDamage: 0 },
            { message: "Your pet's ultimate attack!", playerDamage: 0, opponentDamage: 45 },
            { message: `Level advantage shows!`, playerDamage: 100 - outcome.playerHealth, opponentDamage: 100 - outcome.opponentHealth }
        ] : [
            { message: "Battle Start! ⚔️", playerDamage: 0, opponentDamage: 0 },
            { message: "Your pet attacks!", playerDamage: 0, opponentDamage: 15 },
            { message: "Opponent counter-attacks!", playerDamage: 25, opponentDamage: 0 },
            { message: "You try a special move!", playerDamage: 0, opponentDamage: 10 },
            { message: "Opponent's critical hit!", playerDamage: 35, opponentDamage: 0 },
            { message: "Opponent is too strong!", playerDamage: 20, opponentDamage: 0 },
            { message: `Level difference is too much!`, playerDamage: 100 - outcome.playerHealth, opponentDamage: 100 - outcome.opponentHealth }
        ]

        let currentPlayerHealth = 100
        let currentOpponentHealth = 100

        for (let i = 0; i < battleSteps.length; i++) {
            await new Promise(r => setTimeout(r, 1000))

            const step = battleSteps[i]
            setLog(prev => [...prev, step.message])

            currentPlayerHealth -= step.playerDamage
            currentOpponentHealth -= step.opponentDamage

            setPlayerHealth(Math.max(0, currentPlayerHealth))
            setOpponentHealth(Math.max(0, currentOpponentHealth))

            if (currentPlayerHealth <= 0 || currentOpponentHealth <= 0) {
                break
            }
        }

        // Set final health to match calculated outcome
        setPlayerHealth(outcome.playerHealth)
        setOpponentHealth(outcome.opponentHealth)

        const result = {
            won: outcome.playerWins,
            playerScore: outcome.playerHealth,
            opponentScore: outcome.opponentHealth
        }

        setBattleResult(result)

        setTimeout(async () => {
            if (outcome.playerWins) {
                setLog(prev => [...prev, "Victory! 🎉"])
                setLog(prev => [...prev, "You earned +1 Win!"])
            } else {
                setLog(prev => [...prev, "Defeat! 💔"])
                setLog(prev => [...prev, "Better luck next time!"])
            }

            setGameState('result')
            setShowSignButton(true)
        }, 1500)
    }

    const recordBattleOnChain = () => {
        if (!isConnected || !address || !opponent || !battleResult) {
            setLog(prev => [...prev, "⚠️ Please connect wallet first"])
            return
        }

        try {
            setLog(prev => [...prev, "Opening wallet for signature..."])
            writeContract({
                address: BATTLE_CONTRACT_ADDRESS,
                abi: BATTLE_CONTRACT_ABI,
                functionName: 'recordBattleResult',
                args: [
                    opponent.address,
                    battleResult.won,
                    BigInt(battleResult.playerScore),
                    BigInt(battleResult.opponentScore)
                ]
            })
            setShowSignButton(false)
        } catch (e: any) {
            console.error('Failed to record battle:', e)
            setLog(prev => [...prev, `❌ Error: ${e?.message || 'Failed to sign'}`])
            setShowSignButton(true)
        }
    }

    // Update UI when transaction is successful
    useEffect(() => {
        if (txSuccess) {
            setLog(prev => [...prev, "✅ Result recorded on Base Chain!"])
            setLog(prev => [...prev, "Check the leaderboard!"])
            refetchRecord()
        }
    }, [txSuccess, refetchRecord])

    // Get wins and losses from contract
    const wins = Number(playerRecord?.wins || 0)
    const losses = Number(playerRecord?.losses || 0)
    const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0

    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 max-w-[400px] mx-auto border-x border-slate-800 shadow-xl relative overflow-hidden">
            <header className="w-full flex justify-between items-center mb-8 z-10">
                <Link href="/" className="font-pixel text-xs text-gray-400 hover:text-white">‹ EXIT ARENA</Link>
                <div className="flex items-center gap-2">
                    <Link href="/leaderboard" className="font-pixel text-xs text-yellow-400 hover:text-yellow-300">🏆 LEADERBOARD</Link>
                    <ConnectWallet />
                </div>
            </header>

            {!isConnected ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="font-pixel text-xl text-red-500 mb-2">RESTRICTED AREA</h2>
                    <p className="text-gray-400 text-sm mb-6">You must connect your Base wallet to enter the Battle Arena and compete for rankings.</p>
                    <div className="p-4 bg-slate-800 rounded-lg text-xs text-gray-500">
                        Requires: Base Mainnet
                    </div>
                </div>
            ) : (
                <>
                    {gameState === 'lobby' && (
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center mb-8 relative">
                                <img
                                    src={`/sprites/pets/${petData.petType || 'base-bull'}-${getPetStageForBattle()}.png`}
                                    className="w-24 h-24 pixelated object-contain"
                                    alt="Your pet"
                                />
                                <div className="absolute -bottom-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                                    LVL {petData.level || 1}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 w-full mb-8 text-center">
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-500">{wins}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Wins</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-red-500">{losses}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Losses</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-500">{winRate}%</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Win Rate</div>
                                </div>
                            </div>

                            <button
                                onClick={startBattle}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-pixel py-4 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1 transition"
                                disabled={isRecording}
                            >
                                FIND MATCH
                            </button>

                            {petData.level === 0 && (
                                <p className="text-xs text-yellow-400 mt-4">⚠️ Your pet is level 0! Feed it first to improve win chances!</p>
                            )}
                        </div>
                    )}

                    {gameState === 'searching' && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                            <div className="text-4xl mb-4">🔍</div>
                            <div className="font-pixel">SEARCHING FOR OPPONENT...</div>
                            <div className="text-xs text-gray-400 mt-2">Finding fair match...</div>
                        </div>
                    )}

                    {(gameState === 'battle' || gameState === 'result') && (
                        <div className="flex-1 w-full flex flex-col">
                            {/* Battle View */}
                            <div className="flex-1 relative bg-slate-800 rounded-xl mb-4 overflow-hidden p-4 flex flex-col justify-between">
                                {/* Opponent */}
                                <div className="self-end flex flex-col items-end">
                                    {opponent && (
                                        <img
                                            src={`/sprites/pets/${opponent.petType}-${opponent.stage}.png`}
                                            className="w-20 h-20 pixelated object-contain mb-2"
                                            alt="Opponent pet"
                                        />
                                    )}
                                    <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-500"
                                            style={{ width: `${opponentHealth}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">LVL {opponent?.level}</span>
                                </div>

                                {/* VS indicator */}
                                <div className="text-center text-2xl font-bold text-yellow-400 my-4">VS</div>

                                {/* Player */}
                                <div className="self-start flex flex-col items-start">
                                    <span className="text-xs text-gray-400 mb-1">LVL {petData.level || 1}</span>
                                    <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{ width: `${playerHealth}%` }}
                                        />
                                    </div>
                                    <img
                                        src={`/sprites/pets/${petData.petType || 'base-bull'}-${getPetStageForBattle()}.png`}
                                        className="w-24 h-24 pixelated object-contain"
                                        alt="Your pet"
                                    />
                                </div>
                            </div>

                            {/* Log */}
                            <div className="h-48 bg-black/50 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-2 border border-slate-700">
                                {log.map((l, i) => (
                                    <div key={i} className="animate-fade-in">&gt; {l}</div>
                                ))}
                            </div>

                            {gameState === 'result' && (
                                <div className="mt-4 space-y-2">
                                    {showSignButton && !isRecording && !txSuccess && (
                                        <button
                                            onClick={recordBattleOnChain}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-pixel py-3 rounded-xl shadow-lg animate-pulse"
                                        >
                                            📝 SIGN TO RECORD ON LEADERBOARD
                                        </button>
                                    )}

                                    {isRecording && (
                                        <div className="w-full text-center py-3 text-yellow-400">
                                            Signing transaction...
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setGameState('lobby')}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-pixel py-3 rounded-xl"
                                    >
                                        RETURN TO LOBBY
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}