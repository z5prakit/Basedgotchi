# Basaegochi 🐾

A generic Tamagotchi-style pet game on Base chain. Raise, train, and battle your digital pets!

## Features

- **Guest Mode**: Play immediately without wallet connection. Your pet lives on your device!
- **5 Unique Pets**: Base Bull, ETH Dragon, Meme Dog, Crypto Cat, DeFi Phoenix.
- **Evolution System**: Egg → Baby → Teen → Adult → Ghost based on care.
- **PvP Arena**: Connect your Base wallet to battle other players and rank up.
- **On-Chain Stats**: Battle results are verified and stored on Base.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Blockchain**: Wagmi + Viem + Tanstack Query
- **Platform**: Farcaster Frame / MiniApp compatible

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
/basaegochi
  /public/          # Static assets (sprites, frame manifest)
  /src/
    /app/           # Next.js App Router pages
    /components/    # React components (Profile, Onboarding, etc)
    /hooks/         # Custom hooks (useAppData, useContract)
    /lib/           # Game logic and utils
    /contracts/     # Smart contract ABI and source
```

## Verification

This project is ready for Base Mini App verification.
- ✅ `/.well-known/farcaster.json` is configured.
- ✅ Guest mode works via LocalStorage.
- ✅ No raw addresses shown (User profiles used).
- ✅ EIP-5792 Transaction Batching prepared.

## Deployment

1. Deploy to Vercel.
2. Disable "Deployment Protection" in Vercel settings.
3. Verify frame at https://warpcast.com/~/developers/frames
4. Submit to https://build.base.org

## Smart Contract

**Battle Arena Contract**: `0x8853C1dA8CD2bb1701804039F1d5AEBDAe95b52A`

[View on BaseScan](https://basescan.org/address/0x8853C1dA8CD2bb1701804039F1d5AEBDAe95b52A)

The battle contract is deployed and live on Base Mainnet. It handles:
- Battle result recording
- Win/loss tracking
- Leaderboard management
- Cooldown system (60 seconds between battles)
