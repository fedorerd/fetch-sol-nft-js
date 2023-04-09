import { pubkey } from "../utils"

export class ConstantsClient {
    private TOKEN_METADATA_PROGRAM_ID = pubkey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    private TOKEN_PROGRAM_ID = pubkey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    private ASSOCIATED_TOKEN_PROGRAM_ID = pubkey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")

    public get tokenMetadataProgramId () {
        return this.TOKEN_METADATA_PROGRAM_ID
    }

    public get tokenProgramId () {
        return this.TOKEN_PROGRAM_ID
    }

    public get associatedTokenProgramId () {
        return this.ASSOCIATED_TOKEN_PROGRAM_ID
    }
}