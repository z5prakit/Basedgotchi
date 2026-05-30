import { http, createConfig } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'
import { BASE_CHAIN, BASE_MAINNET_CHAIN_ID, BASE_MAINNET_RPC_URL } from './base'

export const config = createConfig({
    chains: [BASE_CHAIN],
    connectors: [
        coinbaseWallet({
            appName: 'Basaegochi',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [BASE_MAINNET_CHAIN_ID]: http(BASE_MAINNET_RPC_URL),
    },
    ssr: true,
})

export const BASAEGOCHI_CONTRACT = '0x0000000000000000000000000000000000000000' as const
