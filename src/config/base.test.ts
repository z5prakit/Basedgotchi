import { describe, expect, it } from 'vitest'
import { base } from 'wagmi/chains'
import { BASE_CHAIN, BASE_MAINNET_CHAIN_ID, BASE_MAINNET_RPC_URL } from './base'

describe('Base mainnet config', () => {
    it('uses Base mainnet chain id 8453', () => {
        expect(BASE_MAINNET_CHAIN_ID).toBe(8453)
        expect(BASE_CHAIN.id).toBe(base.id)
    })

    it('uses the Base mainnet public RPC fallback', () => {
        expect(BASE_CHAIN.rpcUrls.default.http).toEqual([BASE_MAINNET_RPC_URL])
        expect(BASE_CHAIN.rpcUrls.public.http).toEqual([BASE_MAINNET_RPC_URL])
    })
})
