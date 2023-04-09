import { PublicKey } from "@solana/web3.js";
import { ConstantsClient } from "../constants";

export type TokenRecordPdaArgs = {
    mint: PublicKey,
    token: PublicKey
}

export function deriveTokenRecordPda({ mint, token }: TokenRecordPdaArgs): PublicKey {
    const program = new ConstantsClient().tokenMetadataProgramId
    const [address] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), program.toBuffer(), mint.toBuffer(), Buffer.from("token_record"), token.toBuffer()],
        program
    )
    return address
}