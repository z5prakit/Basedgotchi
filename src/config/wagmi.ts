import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: 'Basaegochi',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
    ssr: true,
})

export const BASAEGOCHI_CONTRACT = '0x0000000000000000000000000000000000000000' as const
