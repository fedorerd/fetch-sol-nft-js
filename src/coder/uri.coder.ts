import { Uri } from "../types"

export function decodeUriJson (bytes: Buffer | ArrayBuffer): Uri | null {
    try {
        const json = JSON.parse(new TextDecoder("utf-8").decode(bytes))
        const description = json["description"] ? json["description"] as string : null
        const externalUrl = json["external_url"] ? json["external_url"] as string : null
        const imageUrl = json["image"] ? json["image"] as string : null
        const attributes = 
            json["attributes"] && 
            typeof json["attributes"] === "object" && 
            json["attributes"][0] && 
            json["attributes"][0]["trait_type"] && 
            json["attributes"][0]["value"] ? 
                json["attributes"] as {
                    trait_type: string,
                    value: string
                }[]
            : null
        
        const name = json["name"] ? json["name"] as string : null

        return {
            description,
            externalUrl,
            imageUrl,
            attributes,
            name
        }
    } catch {
        return null
    }
}