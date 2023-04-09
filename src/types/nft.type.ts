import { PublicKey } from "@solana/web3.js"
import { Metadata } from "./metadata.type"
import { Mint } from "./mint.type"
import { Token } from "./token.type"
import { Uri } from "./uri.type"

export interface NftWithToken extends Nft {
    tokenAddress: PublicKey,
    tokenDetails: Token
}

export type Nft = {
    mintAddress: PublicKey,
    editionAddress: PublicKey,
    metadataAddress: PublicKey,
    uriJson: Uri | null,
    mintDetails: Mint,
    metadataDetails: Metadata
}