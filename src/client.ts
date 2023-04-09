import { Connection } from "@solana/web3.js";
import { CoderClient } from "./coder";
import { ConstantsClient } from "./constants";
import { FetchClient } from "./fetch";
import { PdasClient } from "./pdas";

export class FetchSolNftClient {
    private coderClient = new CoderClient()
    private pdasClient = new PdasClient()
    private constantsClient = new ConstantsClient()
    private fetchClient: FetchClient

    constructor(connection: string | Connection) {
        this.fetchClient = new FetchClient(typeof connection === "string" ? new Connection(connection) : connection, this)
    }

    public updateConnection(connection: string | Connection) {
        this.fetchClient = new FetchClient(typeof connection === "string" ? new Connection(connection) : connection, this)
    }

    public get coder() {
        return this.coderClient
    }

    public get pdas() {
        return this.pdasClient
    }

    public get constants() {
        return this.constantsClient
    }

    public get fetch() {
        return this.fetchClient
    }
}
