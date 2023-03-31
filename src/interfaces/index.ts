import { Dispatch, SetStateAction } from "react";

export type Product = {
    productId? : string,
    productName? : string,
    productOwnerName? : string,
    developers? : string[],
    scrumMasterName? : string,
    startDate : Date,
    methodology? : string
}

export interface Response {
    response_code : number
}

export interface ProductResponse extends Response {
    result? : Product[]
}

export type FormInput = {
    name : string,
    value? : string
}

export type ProductFormInput = {
    productName : FormInput,
    productOwnerName : FormInput,
    developers : FormInput,
    scrumMasterName : FormInput,
    startDate : FormInput,
    methodology : FormInput
}

export type ReactTableNodes = {
    nodes : Product[]
}