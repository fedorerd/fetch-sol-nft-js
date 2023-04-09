import { PublicKey } from "@solana/web3.js";
import { ConstantsClient } from "../constants";

export type MetadataPdaArgs = {
    mint: PublicKey
}

export function deriveMetadataPda({ mint }: MetadataPdaArgs): PublicKey {
    const program = new ConstantsClient().tokenMetadataProgramId
    const [address] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), program.toBuffer(), mint.toBuffer()],
        program
    )
    return address
}