import { default as BN } from "bn.js"
import { pubkey } from "../utils"

export function decodeString (bytes: Buffer) {
    const coder = new TextDecoder("utf-8")
    return coder.decode(bytes.slice(4)).replace(/^\x00+|\x00+$/gm,'')  
}

export function decodeCOption <T>(bytes: Buffer, decoder: (bytes: Buffer) => T): T | null {
    if (!decodeBoolean(bytes)) return null
    return decoder(bytes.slice(4))
}


export function decodeOption <T>(bytes: Buffer, decoder: (bytes: Buffer) => T): T | null {
    if (!decodeBoolean(bytes)) return null
    return decoder(bytes.slice(1))
}

export function decodeVec <T>(bytes: Buffer, decoder: (bytes: Buffer) => T, itemLen: number): T[] {
    const len = decodeBN(bytes.slice(0, 4))
    const buffer = bytes.slice(4)
    const result: T[] = []

    for (let i = 0; i < Number(len); i++) {
        result.push(decoder(buffer.slice(i * itemLen)))
    }

    return result
}

export function decodePubkey (bytes: Buffer) {
    return pubkey(bytes.slice(0, 32))
}

export function decodeBoolean (bytes: Buffer) {
    return decodeU8(bytes) == 1
}

export function decodeU8 (bytes: Buffer) {
    return new BN(bytes.slice(0, 1)).toNumber()
}

export function decodeU16 (bytes: Buffer) {
    return new BN(bytes.slice(0, 2)).toNumber()
}

export function decodeU32 (bytes: Buffer) {
    return new BN(bytes.slice(0, 4)).toNumber()
}

export function decodeBN (bytes: Buffer, endian: "be" | "le" = "le") {
    const bn = new BN(bytes, endian)
    try {
        return bn.toNumber()
    } catch {
        return bn.toString()
    }
}

export function isNull <T>(value: null | T) {
    return value === null
}

export function decodeEnum <T extends string>(bytes: Buffer, variants: T[]) {
    return variants[decodeU8(bytes)]
}