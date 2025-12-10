'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { GAME_CONFIG, INITIAL_PET_STATE, PetData } from '../lib/game-logic/core'
import { BASAEGOCHI_CONTRACT } from '../config/wagmi'
import { BasaegochiABI } from '../contracts/BasaegochiABI'

export function useAppData() {
    const { address, isConnected } = useAccount()
    const { writeContract } = useWriteContract()

    // State initialization with hydration check
    const [petData, setPetData] = useState<PetData>(INITIAL_PET_STATE)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('basaegochi_pet')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    setPetData({ ...INITIAL_PET_STATE, ...parsed })
                } catch (e) {
                    console.error("Failed to parse save data", e)
                }
            }
            setIsLoaded(true)
        }
    }, [])

    // Auto-save to localStorage whenever data changes
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem('basaegochi_pet', JSON.stringify(petData))
        }
    }, [petData, isLoaded])

    // Periodic degradation check
    useEffect(() => {
        const interval = setInterval(() => {
            setPetData(prev => {
                if (!prev.petType) return prev;

                // Simple degradation
                const newHunger = Math.max(0, prev.hunger - 1);
                const newHappiness = Math.max(0, prev.happiness - 1);
                // Health degrades if hungry or unhappy
                let healthLoss = 0;
                if (newHunger < 20) healthLoss += 1;
                if (newHappiness < 20) healthLoss += 1;
                const newHealth = Math.max(0, prev.health - healthLoss);

                return {
                    ...prev,
                    hunger: newHunger,
                    happiness: newHappiness,
                    health: newHealth
                }
            })
        }, 60000) // Check every minute (fast for demo, usually hourly)

        return () => clearInterval(interval)
    }, [isLoaded])

    const saveToBlockchain = async () => {
        if (!isConnected || !address) {
            alert("Connect wallet to save battle results on-chain!")
            return
        }
        // Only saving pet type registration essentially in this simple contract
        // Real sync requires more logic
    }

    return { petData, setPetData, saveToBlockchain, isConnected, isLoaded }
}
