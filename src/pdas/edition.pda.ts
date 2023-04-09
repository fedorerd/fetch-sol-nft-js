import { PublicKey } from "@solana/web3.js";
import { ConstantsClient } from "../constants";

export type EditionPdaArgs = {
    mint: PublicKey
}

export function deriveEditionPda({ mint }: EditionPdaArgs): PublicKey {
    const program = new ConstantsClient().tokenMetadataProgramId
    const [address] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), program.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
        program
    )
    return address
}