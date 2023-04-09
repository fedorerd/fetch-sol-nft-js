import { PublicKey } from "@solana/web3.js";
import { AssociatedTokenPdaArgs, deriveAssociatedTokenPda } from './associated-token.pda'
import { deriveEditionPda, EditionPdaArgs } from './edition.pda'
import { MetadataPdaArgs, deriveMetadataPda } from './metadata.pda'
import { deriveTokenRecordPda, TokenRecordPdaArgs } from "./token-record.pda";

export class PdasClient {
    
    public getMetadata(args: MetadataPdaArgs): PublicKey {
        return deriveMetadataPda(args)
    }
    
    public getEdition(args: EditionPdaArgs): PublicKey {
        return deriveEditionPda(args)
    }

    public getAssociatedToken(args: AssociatedTokenPdaArgs): PublicKey {
        return deriveAssociatedTokenPda(args)
    }

    public getTokenRecord(args: TokenRecordPdaArgs): PublicKey {
        return deriveTokenRecordPda(args)
    }
}