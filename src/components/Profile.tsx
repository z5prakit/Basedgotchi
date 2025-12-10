'use client'
import { useState, useEffect } from 'react'
import sdk from '@farcaster/miniapp-sdk'
import { useAccount } from 'wagmi'

export function Profile() {
    const [context, setContext] = useState<any>(null)
    const { address } = useAccount()

    useEffect(() => {
        const loadContext = async () => {
            try {
                const ctx = await sdk.context
                setContext(ctx)
            } catch (e) {
                console.log("Not running in Farcaster frame")
            }
        }
        loadContext()
    }, [])

    const username = context?.user?.username || "Guest Player"
    const pfp = context?.user?.pfpUrl || "/sprites/ui/elements.png" // Fallback to a UI sprite or default

    return (
        <div className="flex items-center gap-2 p-2 bg-base-blue/10 rounded-lg border-2 border-base-blue/20">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-base-blue">
                <img
                    src={pfp}
                    alt={username}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold truncate max-w-[120px]">{username}</span>
                {address && (
                    <span className="text-[10px] opacity-60 font-mono">
                        {address.slice(0, 4)}...{address.slice(-4)}
                    </span>
                )}
            </div>
        </div>
    )
}
