export type Attribute = {
    trait_type: string,
    value: string
}

export type Uri = {
    description: string | null,
    externalUrl: string | null,
    imageUrl: string | null,
    attributes: Attribute[] | null,
    name: string | null
}