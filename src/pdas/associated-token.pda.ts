import { PublicKey } from "@solana/web3.js";
import { ConstantsClient } from "../constants";

export type AssociatedTokenPdaArgs = {
    mint: PublicKey,
    owner: PublicKey
}

export function deriveAssociatedTokenPda({ mint, owner }: AssociatedTokenPdaArgs): PublicKey {
    const constants = new ConstantsClient()
    const program = constants.associatedTokenProgramId
    const tokenProgram = constants.tokenProgramId
    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), tokenProgram.toBuffer(), mint.toBuffer()],
        program
    )
    return address
}