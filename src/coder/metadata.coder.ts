import { Collection, CollectionDetailsUnknown, CollectionDetailsV1, Creator, Metadata, ProgrammableConfigUnknown, ProgrammableConfigV1, Uses } from "../types"
import { decodeBN, decodeBoolean, decodeEnum, decodeOption, decodePubkey, decodeString, decodeU16, decodeU8, decodeVec, isNull } from "./basic.coder"

export function decodeMetadataAccount (bytes: Buffer): Metadata {
    let offset = 1

    const updateAuthorityAddress = decodePubkey(bytes.slice(offset, offset + 32))
    offset += 32

    const mintAddress = decodePubkey(bytes.slice(offset, offset + 32))
    offset += 32

    let name = decodeString(bytes.slice(offset, offset + 36))
    offset += 36

    const symbol = decodeString(bytes.slice(offset, offset + 14))
    offset += 14

    const uri = decodeString(bytes.slice(offset, offset + 204))
    offset += 204

    const sellerFeeBasisPoints = decodeU16(bytes.slice(offset, offset + 2))
    offset += 2

    const creators = decodeOption(
        bytes.slice(offset),
        (b): Creator[] => decodeVec(b, (b) => ({
            address: decodePubkey(b.slice(0, 32)),
            verified: decodeBoolean(b.slice(32)),
            share: decodeU8(b.slice(33))
        }),
        34
    ))
    offset += creators ? 5 + 34 * creators.length : 1

    const primarySaleHappened = decodeBoolean(bytes.slice(offset, offset + 1))
    offset += 1

    const isMutable = decodeBoolean(bytes.slice(offset, offset + 1))
    offset += 1

    const editionNonce = decodeOption(bytes.slice(offset, offset + 2), decodeU8)
    offset += isNull(editionNonce) ? 1 : 2

    const tokenStandard = decodeOption(bytes.slice(offset, offset + 2), decodeU8)
    offset += isNull(tokenStandard) ? 1 : 2

    const collection = decodeOption(bytes.slice(offset, offset + 34), (b): Collection => ({
        verified: decodeBoolean(b.slice(0, 1)),
        address: decodePubkey(b.slice(1))
    }))
    offset += isNull(collection) ? 1 : 34

    const uses = decodeOption(bytes.slice(offset, offset + 18), (b): Uses => ({
        useMethod: decodeEnum(b.slice(0, 1), ["Burn", "Multiple", "Single"]),
        remaining: decodeBN(b.slice(1, 9)),
        total: decodeBN(b.slice(9, 17))
    }))
    offset += isNull(uses) ? 1 : 18

    const collectionDetails = decodeOption(bytes.slice(offset, offset + 10), (b): CollectionDetailsUnknown | CollectionDetailsV1 => {
        const enumValue = decodeEnum(b, ["V1"])
        if (enumValue) return ({
            key: enumValue,
            value: decodeBN(b.slice(1, 9))
        })
        return ({
            key: "Unknown" as const
        })
    })
    offset += isNull(collectionDetails) ? 1 : collectionDetails!.key === "V1" ? 10 : 2

    const programmableConfig = decodeOption(bytes.slice(offset, offset + 35), (b): ProgrammableConfigUnknown | ProgrammableConfigV1 => {
        const enumValue = decodeEnum(b, ["V1"])
        if (enumValue) return ({
            key: enumValue,
            value: decodeOption(b.slice(1), decodePubkey)
        })
        else return ({
            key: "Unknown"
        })
    })

    return {
        updateAuthorityAddress,
        mintAddress,
        name,
        symbol,
        uri,
        sellerFeeBasisPoints,
        creators,
        primarySaleHappened,
        isMutable,
        editionNonce,
        tokenStandard,
        collection,
        uses,
        collectionDetails,
        programmableConfig
    }
}