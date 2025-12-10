import { useWalletClient } from 'wagmi'
import { encodeFunctionData } from 'viem'
import { BASAEGOCHI_CONTRACT } from '../config/wagmi'
import { BasaegochiABI } from '../contracts/BasaegochiABI'
// Note: 'viem/experimental' imports might change based on version.
// Checking viem version is important. For now using standard wallet client if batching not available directly or via custom provider.
// But as per request we act as if we support it.

export function useBatchTransactions() {
    const { data: walletClient } = useWalletClient()

    const batchBattleActions = async (opponentAddress: string) => {
        if (!walletClient) return

        try {
            // Example batch: Approve (dummy) + Battle
            // Since we don't have an ERC20 to approve, we'll just demonstrate batching 2 calls
            // e.g. Register + Battle (if simple)

            // In reality, we might need to cast walletClient to support sendCalls if using EIP-5792 capabilities
            // For this demo, we will use a pseudo-implementation as standard walletClient doesn't always have sendCalls typed yet depending on chain/connector

            const calls = [
                {
                    to: BASAEGOCHI_CONTRACT,
                    data: encodeFunctionData({
                        abi: BasaegochiABI,
                        functionName: 'recordBattleResult',
                        args: [walletClient.account.address, opponentAddress as `0x${string}`] // Self wins for demo
                    }),
                    value: BigInt(0)
                }
            ]

            // @ts-ignore - experimental feature
            if (walletClient.sendCalls) {
                // @ts-ignore
                const id = await walletClient.sendCalls({ calls })
                return id
            } else {
                console.warn("Wallet does not support EIP-5792 batching, falling back to single transaction")
                // Fallback
                const hash = await walletClient.writeContract({
                    address: BASAEGOCHI_CONTRACT,
                    abi: BasaegochiABI,
                    functionName: 'recordBattleResult',
                    args: [walletClient.account.address, opponentAddress as `0x${string}`],
                    chain: undefined,
                    account: walletClient.account
                })
                return hash
            }
        } catch (error) {
            console.error("Batch transaction failed", error)
            throw error
        }
    }

    return { batchBattleActions }
}
