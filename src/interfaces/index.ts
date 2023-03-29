export type Product = {
    productId: string,
    productName: string,
    productOwnerName: string,
    Developers: string[],
    scrumMasterName: string,
    startDate: Date,
    methodology: string
}

export type ProductResponse = {
    response_code : number,
    result? : Product[]
}

export type HealthResponse = {
    response_code : number
}

export type FormInput = {
    name : string,
    value : string,
    error : boolean
}

export type ProductFormInput = {
    productName: FormInput,
    productOwnerName: FormInput,
    developers: FormInput,
    scrumMasterName: FormInput,
    startDate: FormInput,
    methodology: FormInput
}