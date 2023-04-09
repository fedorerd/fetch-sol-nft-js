import { PublicKey } from "@solana/web3.js"

export type Creator = {
    address: PublicKey,
    verified: boolean,
    share: number
}

export type Collection = {
    verified: boolean,
    address: PublicKey
}

export type Uses = {
    useMethod: "Burn" | "Multiple" | "Single",
    remaining: number | string,
    total: number | string
}

export interface CollectionDetailsV1 extends CollectionDetails {
    key: "V1",
    value: string | number
}

export interface CollectionDetailsUnknown extends CollectionDetails {
    key: "Unknown"
}

export type CollectionDetails = {
    key: "V1" | "Unknown"
}

export interface ProgrammableConfigV1 extends ProgrammableConfig {
    key: "V1",
    value: PublicKey | null
}

export interface ProgrammableConfigUnknown extends ProgrammableConfig {
    key: "Unknown"
}

export type ProgrammableConfig = {
    key: "Unknown" | "V1"
}

export type Metadata = {
    updateAuthorityAddress: PublicKey,
    mintAddress: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    sellerFeeBasisPoints: number,
    creators: Creator[] | null,
    primarySaleHappened: boolean,
    isMutable: boolean,
    editionNonce: number | null,
    tokenStandard: number | null
    collection: Collection | null,
    uses: Uses | null,
    collectionDetails: CollectionDetailsV1 | CollectionDetailsUnknown | null,
    programmableConfig: ProgrammableConfigV1 | ProgrammableConfigUnknown | null
}