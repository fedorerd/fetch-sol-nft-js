import { PublicKey } from "@solana/web3.js"

export type Token = {
    mintAddress: PublicKey,
    ownerAddress: PublicKey,
    amount: string | number,
    delegate: PublicKey | null,
    state: "Unitiailized" | "Initialized" | "Frozen",
    isNative: string | number | false,
    delegatedAmount: string | number,
    closeAuthority: PublicKey | null
}