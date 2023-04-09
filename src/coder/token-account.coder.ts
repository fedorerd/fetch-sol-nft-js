import { Token } from "../types"
import { decodeBN, decodeCOption, decodeEnum, decodeOption, decodePubkey } from "./basic.coder"

export function decodeTokenAccount (bytes: Buffer): Token {
    let offset = 0

    const mintAddress = decodePubkey(bytes.slice(offset))
    offset += 32

    const ownerAddress = decodePubkey(bytes.slice(offset))
    offset += 32

    const amount = decodeBN(bytes.slice(offset, offset + 8))
    offset += 8

    const delegate = decodeCOption(bytes.slice(offset), decodePubkey)
    offset += 4 + 32

    const state = decodeEnum(bytes.slice(offset), [
        "Unitiailized", "Initialized", "Frozen"
    ])
    offset += 1

    const isNative = decodeCOption(bytes.slice(offset), (b) => decodeBN(b.slice(0, 8))) || false
    offset += 4 + 8

    const delegatedAmount = decodeBN(bytes.slice(offset, offset + 8))
    offset += 8

    const closeAuthority = decodeOption(bytes.slice(offset), decodePubkey)

    return {
        mintAddress,
        ownerAddress,
        amount,
        delegate,
        state,
        isNative,
        delegatedAmount,
        closeAuthority
    }
}