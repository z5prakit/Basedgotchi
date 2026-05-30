export const POLYMARKET_INTEGRATION_ENABLED = false
export const REAL_TRADING_ENABLED = false

export const TRADING_CONFIG = {
    polymarketIntegrationEnabled: POLYMARKET_INTEGRATION_ENABLED,
    realTradingEnabled: REAL_TRADING_ENABLED,
    mode: 'disabled-base-farcaster-gotchi',
    reason: 'Basedgotchi is a Base/Farcaster gotchi app and has no Polymarket trading integration.',
} as const

export function assertTradingDisabled() {
    if (POLYMARKET_INTEGRATION_ENABLED || REAL_TRADING_ENABLED) {
        throw new Error('Trading integrations must remain disabled for Basedgotchi.')
    }

    return TRADING_CONFIG
}
