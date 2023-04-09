import { PublicKey } from "@solana/web3.js";

export function pubkey(value: string | Buffer) {
    return new PublicKey(value)
}