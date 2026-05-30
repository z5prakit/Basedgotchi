import { describe, expect, it } from 'vitest'
import {
    assertTradingDisabled,
    POLYMARKET_INTEGRATION_ENABLED,
    REAL_TRADING_ENABLED,
    TRADING_CONFIG,
} from './trading-config'

describe('trading config guard', () => {
    it('keeps Polymarket and real trading integrations disabled', () => {
        expect(POLYMARKET_INTEGRATION_ENABLED).toBe(false)
        expect(REAL_TRADING_ENABLED).toBe(false)
        expect(assertTradingDisabled()).toBe(TRADING_CONFIG)
    })
})
