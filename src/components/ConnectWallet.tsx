'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-500/20"
            >
                Disconnect
            </button>
        )
    }

    // Find Coinbase Wallet or generic Injected
    const connector = connectors.find(c => c.name.includes("Coinbase")) || connectors[0]

    return (
        <button
            onClick={() => connect({ connector })}
            className="px-4 py-2 bg-base-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-sm"
        >
            Connect Wallet
        </button>
    )
}
