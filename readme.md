# __Fetch Sol Nft__

##### Package for fetching Solana NFTs. Built on-top of `@solana/web3.js`.

### __Npm__
###### [@fedorerd/fetch-sol-nft](https://www.npmjs.com/package/@fedorerd/fetch-sol-nft)

## __Installation__

Install the dependency.
```sh
npm i @fedorerd/fetch-sol-nft
```
Create new instance of FetchSolNftClient.
```ts
import { FetchSolNftClient } from "@fedorerd/fetch-sol-nft"

const RPC: string = "https://api.mainnet-beta.solana.com"
// You may pass instance of @solana/web3.js Connection instead of rpc url string
const client = new FetchSolNftClient(RPC)
```

## __Usage__
Client provides multiple subclient, which do different things.

#### 0. __Fetch__
Fetch client provides function to fetch Solana NFTs.
```ts
const MINT = new PublicKey("3Z3HYn4TW9bnUrd58j6wKzQgmz23JPzS4PN12JXamZ9n")
const nft = await client.fetch.nftByMint({
    mint: MINT
})
```
Available functions: `nftByMint`.
_More functions, such as nftsByOwner, nftsByMintList to be added soon._

#### 1. __Constants__
Constants client contains on-chain program IDs needed for working with NFTs.
```ts
const METAPLEX_TOKEN_METADATA_PROGRAM_ID = client.constants.tokenMetadataProgramId
```
Programs available: `tokenMetadataProgramId`, `associatedTokenProgramId`, `tokenProgramId`.

#### 2. __Pdas__
Pdas client provides functions to derive program derived addresses.
```ts
const NFT_MINT_ADDRESS: string = "3Z3HYn4TW9bnUrd58j6wKzQgmz23JPzS4PN12JXamZ9n"
const nftMetadataAddress = client.pdas.getMetadata({
    mint: new PublicKey(NFT_MINT_ADDRESS)
})
```
Available functions: `getMetadata`, `getEdition` (NFT edition/master edition), `getTokenRecord` (pNFT token record), `getAssociatedToken` (associated token address).

#### 3. __Coder__
Coder client provides function to decode accounts. It takes Buffer data and returns deserialized account data.
```ts
const RPC = "https://api.mainnet-beta.solana.com"
const MINT = new PublicKey("3Z3HYn4TW9bnUrd58j6wKzQgmz23JPzS4PN12JXamZ9n")
const data = await new Connection(RPC).getAccountInfo(MINT).then(a => a?.data)
if (!data) return
const decoded = client.coder.mintAccount(data)
console.log(decoded)
```
Available decoders: `mintAccount`, `metadataAccount`, `tokenAccount`, `uriJson` (additional decoder for offchain json uri, which contains NFT attributes, description, etc.).

###### This package is not audited. Use at your own risk.
###### This package has no license yet, since I don't know which one to use lol. But feel free to use, idc.