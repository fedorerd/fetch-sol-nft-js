import { PublicKey } from "@solana/web3.js"

export type Mint = {
    mintAuthority: PublicKey | null,
    supply: number | string,
    decimals: number,
    isInitialized: boolean,
    freezeAuthority: PublicKey | null
}