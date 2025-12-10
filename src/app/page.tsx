'use client'
import { useState, useEffect } from 'react'
import { Onboarding } from '@/components/Onboarding'
import { Profile } from '@/components/Profile'
import { useAppData } from '@/hooks/useAppData'
import Link from 'next/link'

export default function Home() {
    const [showOnboarding, setShowOnboarding] = useState(false)
    const { isLoaded, petData } = useAppData()

    useEffect(() => {
        // Show onboarding if no pet created yet
        if (isLoaded && !petData.petType) {
            setShowOnboarding(true)
        }
    }, [isLoaded, petData.petType])

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center p-4 max-w-[400px] mx-auto border-x border-gray-200 shadow-xl bg-white">
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

            <header className="w-full flex justify-between items-center mb-6">
                <h1 className="font-pixel text-base-blue text-sm">BASAEGOCHI</h1>
                <Profile />
            </header>

            <section className="flex-1 flex flex-col items-center justify-center w-full gap-8">
                <div className="relative w-64 h-64 bg-blue-50 rounded-full border-4 border-base-blue flex items-center justify-center overflow-hidden">
                    {petData.petType ? (
                        <img src={`/sprites/pets/${petData.petType}-baby.png`} className="w-32 h-32 pixelated animate-bounce object-contain" />
                    ) : (
                        <img src="/sprites/pets/base-bull-egg.png" /* Placeholder for egg */ className="w-32 h-32 pixelated grayscale object-contain" />
                    )}
                </div>

                <div className="w-full space-y-4">
                    <Link href="/game">
                        <button className="w-full bg-base-blue text-white font-pixel py-4 rounded-xl shadow-b-4 hover:translate-y-1 transition active:translate-y-1 active:shadow-none border-b-4 border-blue-800">
                            {petData.petType ? "CONTINUE GAME" : "NEW GAME"}
                        </button>
                    </Link>

                    <Link href="/battle">
                        <button className="w-full bg-red-500 text-white font-pixel py-4 rounded-xl shadow-b-4 hover:translate-y-1 transition active:translate-y-1 active:shadow-none border-b-4 border-red-800 flex items-center justify-center gap-2">
                            <span>⚔️</span> BATTLE ARENA
                        </button>
                    </Link>
                </div>

                <div className="mt-8 text-xs text-gray-400 text-center">
                    Built on Base 🔵<br />
                    Playable on Farcaster
                </div>
            </section>
        </main>
    )
}
