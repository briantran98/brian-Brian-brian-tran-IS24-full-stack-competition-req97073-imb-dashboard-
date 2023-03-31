import { Product, ProductResponse } from "@/interfaces";

export async function postRequest<T,J>(url : string, body : T) : Promise<J> {
  const requestOptions = {
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": JSON.stringify(body)
  };
  
  const response : J = await fetch(url, requestOptions).then(res => res.json());
  
  return response;
}

export async function putRequest<T,J>(url: string, body : T) : Promise<J> {
  const requestOptions = {
    "method": "PUT",
    "headers": { "Content-Type": "application/json" },
    "body": JSON.stringify(body)
  };
  
  const response : J = await fetch(url, requestOptions).then(res => res.json());
  
  return response;
}