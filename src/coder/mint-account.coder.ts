import { Mint } from "../types"
import { decodeBN, decodeBoolean, decodeCOption, decodePubkey, decodeU8 } from "./basic.coder"

export function decodeMintAccount (bytes: Buffer): Mint {
    let offset = 0

    const mintAuthority = decodeCOption(bytes, decodePubkey)
    offset += 36

    const supply = decodeBN(bytes.slice(offset, offset + 8))
    offset += 8

    const decimals = decodeU8(bytes.slice(offset))
    offset += 1

    const isInitialized = decodeBoolean(bytes.slice(offset))
    offset += 1

    const freezeAuthority = decodeCOption(bytes, decodePubkey)

    
    return {
        mintAuthority,
        supply,
        decimals,
        isInitialized,
        freezeAuthority
    }
}