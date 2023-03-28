export type Data = {
    productId: number,
    productName: string,
    productOwnerName: string,
    Developers: string[],
    scrumMasterName: string,
    startDate: Date,
    methodology: string
}

export type ProductResponse = {
    response_code : number
    result? : Data[]
}

export type HealthResponse = {
    response_code : number
}