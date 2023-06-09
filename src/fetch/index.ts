import { Connection } from "@solana/web3.js";
import { FetchSolNftClient } from "../client";
import { fetchNftByMint, FetchNftByMintArgs } from "./nft-by-mint.fetch";
import { fetchNftsByOwner, FetchNftsByOwnerArgs } from "./nfts-by-owner.fetch";

export class FetchClient {
    private connection: Connection
    private client: FetchSolNftClient

    constructor(connection: Connection, client: FetchSolNftClient) {
        this.connection = connection
        this.client = client
    }

    public nftByMint(args: Omit<FetchNftByMintArgs, "client" | "connection">) {
        return fetchNftByMint({
            client: this.client,
            connection: this.connection,
            ...args
        })
    }

    public nftsByOwner(args: Omit<FetchNftsByOwnerArgs, "client" | "connection">) {
        return fetchNftsByOwner({
            client: this.client,
            connection: this.connection,
            ...args
        })
    }


}