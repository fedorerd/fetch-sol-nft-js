import { Connection, PublicKey } from "@solana/web3.js"
import { FetchSolNftClient } from "../client"
import { Metadata, Mint } from "../types"
import { NftWithToken } from "../types/nft.type"

export type FetchNftsByOwnerArgs = {
    client: FetchSolNftClient,
    connection: Connection,
    owner: PublicKey
}

export async function fetchNftsByOwner ({
    client, connection, owner
}: FetchNftsByOwnerArgs): Promise<NftWithToken[]> {
    const chunkLen = 100

    const tokens = await connection.getProgramAccounts(
        client.constants.tokenProgramId,
        {
            filters: [
                {
                    dataSize: 165
                },
                {
                    memcmp: {
                        offset: 32,
                        bytes: owner.toBase58()
                    }
                },
                {
                    memcmp: {
                        offset: 64,
                        bytes: "2"
                    }
                }
            ]
        }
    )
    .then(tkns => tkns.map(tkn => {
        const decoded = client.coder.tokenAccount(tkn.account.data)
        return {
            tokenAddress: tkn.pubkey,
            mintAddress: decoded.mintAddress,
            editionAddress: client.pdas.getEdition({ mint: decoded.mintAddress }),
            metadataAddress: client.pdas.getMetadata({ mint: decoded.mintAddress }),
            tokenDetails: decoded
        }
    }))

    const metadatas = await (async () => {
        const addresses = tokens.map(tkn => tkn.metadataAddress)
        const chunks: Metadata[] = []
        for (let i = 0; i < addresses.length; i += chunkLen) {
            const meta = await connection.getMultipleAccountsInfo(addresses.slice(i, i + chunkLen))
            .then(m => m
                .filter(d => d && d.data)
                .map(a => client.coder.metadataAccount(a!.data))
            )
            chunks.push(...meta)
        }
        return chunks
    })()

    const mints = await (async () => {
        const addresses = tokens.map(tkn => tkn.mintAddress)
        const chunks: { address: PublicKey, data: Mint }[] = []
        for (let i = 0; i < addresses.length; i += chunkLen) {
            const meta = await connection.getMultipleAccountsInfo(addresses.slice(i, i + chunkLen))
            .then(m => m
                .map((a, index) => ({
                    address: addresses.slice(i, i + chunkLen)[index],
                    data: (a && a.data) ? client.coder.mintAccount(a.data) : null
                }))
                .filter(a => a.data !== null) as { address: PublicKey, data: Mint }[]
            )
            chunks.push(...meta)
        }
        return chunks
    })()
    
    const nfts: NftWithToken[] = tokens
    .map(tkn => {
        let meta = metadatas.find(m => m.mintAddress.equals(tkn.mintAddress))
        let mint = mints.find(m => m.address.equals(tkn.mintAddress))

        if (!mint || !meta) return null

        if (mint.data.decimals > 0 || !mint.data.mintAuthority || !mint.data.mintAuthority.equals(tkn.editionAddress)) return null

        return {
            editionAddress: tkn.editionAddress,
            metadataAddress: tkn.metadataAddress,
            mintAddress: tkn.mintAddress,
            tokenAddress: tkn.tokenAddress,
            tokenDetails: tkn.tokenDetails,
            metadataDetails: meta,
            mintDetails: mint.data,
            uriJson: null
        } as NftWithToken
    })
    .filter(n => n !== null) as NftWithToken[]

    await Promise.all(
        nfts.map((nft, i) => fetch(
                nft.metadataDetails.uri
            )
            .catch(() => null)
            .then(r => r ? 
                r.arrayBuffer()
                .then(buf => nfts[i].uriJson = client.coder.uriJson(buf))
                .catch(() => null)
                : null
            )
        )
    )

    return nfts
}