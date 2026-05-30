import { base } from 'wagmi/chains'

export const BASE_MAINNET_CHAIN_ID = 8453
export const BASE_MAINNET_RPC_URL = 'https://mainnet.base.org'
export const BASE_CHAIN = {
    ...base,
    id: BASE_MAINNET_CHAIN_ID,
    rpcUrls: {
        ...base.rpcUrls,
        default: {
            http: [BASE_MAINNET_RPC_URL],
        },
        public: {
            http: [BASE_MAINNET_RPC_URL],
        },
    },
} as const
