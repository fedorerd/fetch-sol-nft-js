import { decodeMetadataAccount } from "./metadata.coder";
import { decodeMintAccount } from "./mint-account.coder";
import { decodeTokenAccount } from "./token-account.coder";
import { decodeUriJson } from "./uri.coder";

export class CoderClient {

    public tokenAccount(bytes: Buffer) {
        return decodeTokenAccount(bytes)
    }

    public metadataAccount(bytes: Buffer) {
        return decodeMetadataAccount(bytes)
    }

    public mintAccount(bytes: Buffer) {
        return decodeMintAccount(bytes)
    }

    public uriJson(bytes: Buffer | ArrayBuffer) {
        return decodeUriJson(bytes)
    }
}