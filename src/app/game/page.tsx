'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppData } from '@/hooks/useAppData'
import { GAME_CONFIG, getPetStage, PetType, INITIAL_PET_STATE } from '@/lib/game-logic/core'
import { Profile } from '@/components/Profile'
import Link from 'next/link'

export default function GamePage() {
    const { petData, setPetData, isLoaded } = useAppData()
    const [activeAction, setActiveAction] = useState<string | null>(null)

    // Ensure hydration
    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    // Redirect to home if no pet (handled by user logic, but safe check here)
    if (!petData.petType) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="font-pixel mb-8 text-center">Select your Pet</h1>
                <div className="grid grid-cols-2 gap-4">
                    {['base-bull', 'eth-dragon', 'meme-dog', 'crypto-cat', 'defi-phoenix'].map(type => (
                        <button
                            key={type}
                            onClick={() => setPetData({ ...INITIAL_PET_STATE, petType: type as PetType, bornTime: Date.now() })}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-base-blue hover:bg-blue-50 transition flex flex-col items-center"
                        >
                            <img src={`/sprites/pets/${type}-baby.png`} className="w-16 h-16 pixelated object-contain" />
                            <span className="font-pixel text-[10px] mt-2 capitalize">{type.replace('-', ' ')}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const stage = getPetStage(petData.level, petData.health)

    // Calculate sprite offset based on stage
    // Assuming sprite sheet is 5 frames horizontal: Egg, Baby, Teen, Adult, Ghost
    const spriteOffsets = { egg: 0, baby: 1, teen: 2, adult: 3, ghost: 4 }
    const offset = spriteOffsets[stage] * -64 // 64px width

    const handleAction = (type: 'food' | 'play' | 'heal') => {
        setActiveAction(type)
        setTimeout(() => setActiveAction(null), 1000)

        setPetData(prev => {
            let newData = { ...prev }
            if (type === 'food') {
                newData.hunger = Math.min(100, prev.hunger + 30)
                newData.experience += 5
            } else if (type === 'play') {
                newData.happiness = Math.min(100, prev.happiness + 20)
                newData.hunger = Math.max(0, prev.hunger - 10)
                newData.experience += 10
            } else if (type === 'heal') {
                newData.health = Math.min(100, prev.health + 50)
                newData.happiness = Math.max(0, prev.happiness - 10)
            }

            // Level up check
            if (newData.experience >= GAME_CONFIG.expToLevelUp * newData.level) {
                newData.level += 1
                newData.experience = 0
            }

            return newData
        })
    }

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center p-4 max-w-[400px] mx-auto border-x border-gray-200 shadow-xl bg-white relative overflow-hidden">
            <header className="w-full flex justify-between items-center mb-4 z-10">
                <Link href="/" className="font-pixel text-xs text-gray-500 hover:text-base-blue">‹ BACK</Link>
                <Profile />
            </header>

            {/* Stats Layer */}
            <div className="w-full grid grid-cols-3 gap-2 mb-8 z-10">
                <div className="bg-red-100 p-2 rounded-lg border border-red-200">
                    <div className="text-[10px] text-red-500 font-bold mb-1">HEALTH</div>
                    <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${petData.health}%` }} />
                    </div>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg border border-yellow-200">
                    <div className="text-[10px] text-amber-600 font-bold mb-1">HAPPY</div>
                    <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${petData.happiness}%` }} />
                    </div>
                </div>
                <div className="bg-green-100 p-2 rounded-lg border border-green-200">
                    <div className="text-[10px] text-green-600 font-bold mb-1">HUNGER</div>
                    <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${petData.hunger}%` }} />
                    </div>
                </div>
            </div>

            {/* Pet Layer */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                {/* Background decorative elements would go here */}

                <div className="relative w-64 h-64 flex items-center justify-center">
                    {activeAction && (
                        <motion.div
                            initial={{ scale: 0, y: 0 }}
                            animate={{ scale: 1.5, y: -50, opacity: 0 }}
                            className="absolute z-20 text-4xl"
                        >
                            {activeAction === 'food' && '🍗'}
                            {activeAction === 'play' && '🎾'}
                            {activeAction === 'heal' && '💊'}
                        </motion.div>
                    )}

                    <img
                        src={`/sprites/pets/${petData.petType}-${stage}.png`}
                        alt={`${petData.petType} ${stage}`}
                        className="w-32 h-32 pixelated object-contain animate-bounce"
                        style={{
                            imageRendering: 'pixelated',
                            transform: 'scale(1.5)'
                        }}
                    />
                </div>

                <div className="mt-8 text-center">
                    <div className="font-pixel text-base-blue text-lg mb-1 capitalize">{petData.petType?.replace('-', ' ')}</div>
                    <div className="text-sm text-gray-400 font-mono">LVL {petData.level} • {stage.toUpperCase()}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full grid grid-cols-3 gap-4 mt-auto mb-4 z-10">
                <button
                    onClick={() => handleAction('food')}
                    className="flex flex-col items-center gap-2 p-3 bg-orange-50 rounded-xl border-2 border-orange-100 active:scale-95 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">🍗</div>
                    <span className="text-xs font-bold text-orange-800">FEED</span>
                </button>
                <button
                    onClick={() => handleAction('play')}
                    className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl border-2 border-blue-100 active:scale-95 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">🎾</div>
                    <span className="text-xs font-bold text-blue-800">PLAY</span>
                </button>
                <button
                    onClick={() => handleAction('heal')}
                    className="flex flex-col items-center gap-2 p-3 bg-pink-50 rounded-xl border-2 border-pink-100 active:scale-95 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">💊</div>
                    <span className="text-xs font-bold text-pink-800">HEAL</span>
                </button>
            </div>

        </main>
    )
}
