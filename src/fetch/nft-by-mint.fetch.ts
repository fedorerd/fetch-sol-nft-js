import { Connection, PublicKey } from "@solana/web3.js"
import { FetchSolNftClient } from "../client"
import { NftWithToken } from "../types/nft.type"

export type FetchNftByMintArgs = {
    client: FetchSolNftClient,
    connection: Connection,
    mint: PublicKey,
    token?: PublicKey,
    tokenOwner?: PublicKey
}

export async function fetchNftByMint ({
    client, connection, mint, token, tokenOwner
}: FetchNftByMintArgs): Promise<NftWithToken> {
    
    const mintAddress = mint
    const metadataAddress = client.pdas.getMetadata({ mint })
    let tokenAddress = token ? token : tokenOwner ? client.pdas.getAssociatedToken({ mint, owner: tokenOwner }) : null
    const editionAddress = client.pdas.getEdition({ mint })

    const fetchQueue = [mintAddress, metadataAddress]
    if (tokenAddress) fetchQueue.push(tokenAddress)

    const accounts = await connection.getMultipleAccountsInfo(fetchQueue)
        .then(accs => accs.map(a => a ? a.data : null))
    
    if (accounts[0] === null) throw new Error("Mint account not found at provided address.")
    if (accounts[1] === null) throw new Error("Metadata account not found for provided mint.")
    if (accounts[2] === null) throw new Error("Token account not found at provided address (for provided owner)")

    const mintAccount = client.coder.mintAccount(accounts[0])
    const metadataAccount = client.coder.metadataAccount(accounts[1])
    let tokenAccount = accounts[2] ? client.coder.tokenAccount(accounts[2]) : null

    if (!tokenAccount || !tokenAddress) {
        const currentToken = await connection.getProgramAccounts(
            client.constants.tokenProgramId,
            {
                filters: [
                    {
                        dataSize: 165
                    },
                    {
                        memcmp: {
                            offset: 0,
                            bytes: mintAddress.toBase58()
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
        ).then(accs => accs.length > 0 ? ({
            address: accs[0].pubkey,
            data: accs[0].account.data
        }) : null)

        if (!currentToken) throw new Error("Token account not found for provided mint address.")

        tokenAddress = currentToken.address
        tokenAccount = client.coder.tokenAccount(currentToken.data)
    }

    if (
        mintAccount.decimals > 0 || 
        !mintAccount.mintAuthority || 
        !mintAccount.mintAuthority.equals(editionAddress)
    ) throw new Error("Token at the provided address is not an NFT")
    
    const uriJson = await fetch(
        metadataAccount.uri
    )
    .catch(() => null)
    .then(r => r ? r.arrayBuffer().then(buf => client.coder.uriJson(buf)).catch(() => null) : null)

    if (uriJson) {
        if (uriJson.name && uriJson.name.length > metadataAccount.name.length) {
            metadataAccount.name = uriJson.name
        }
    }
    
    return {
        mintAddress,
        editionAddress,
        metadataAddress,
        tokenAddress,
        uriJson,
        mintDetails: mintAccount,
        metadataDetails: metadataAccount,
        tokenDetails: tokenAccount
    }

}