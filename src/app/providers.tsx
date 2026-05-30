'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import sdk from '@farcaster/miniapp-sdk'
import { config } from '../config/wagmi'
import { BASE_CHAIN } from '../config/base'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        const initSDK = async () => {
            await sdk.actions.ready()
        }
        initSDK()
    }, [])

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={BASE_CHAIN}
                    config={{
                        appearance: {
                            mode: 'dark',
                            theme: 'base'
                        }
                    }}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
