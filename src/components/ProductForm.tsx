import { Dispatch, SetStateAction, useState } from "react";
import { ProductResponse, Product, ProductFormInput } from "@/interfaces/index";

export default function ProductForm(props : {setData: Dispatch<SetStateAction<ProductResponse>>}) : JSX.Element{
  const [ formInputs, setFormInputss ] = useState<ProductFormInput>({
    "productName": { "name": "Product Name", "value": "", "error": false},
    "productOwnerName": { "name": "Product Owner", "value": "", "error": false},
    "developers": { "name": "Developer Names", "value": "", "error": false},
    "scrumMasterName": { "name": "Scrum Master", "value": "", "error": false},
    "startDate": { "name": "Start Date", "value": "", "error": false},
    "methodology": { "name": "Methodology ", "value": "", "error": false},
  });

  // Function to handle state changes on element change
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, keyString : string ) => {
    const target : EventTarget & HTMLInputElement = e.target;
    const key : keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputss(prev => {
      prev[key] .value = target.value;
      prev[key].error = false;
      return {...prev};
    });

  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors : boolean = false;
    let key : keyof typeof formInputs;
    for (key in formInputs) {
      if (!formInputs[key].value)
      {
        formInputs[key].error = true;
        errors = true;
      }
    }
    // If there was an and an input was null then return out of function
    if (errors) return;
    // Make post call to api
    const developers : string[] = formInputs.developers.value.split(",");
    const startDate : Date = new Date(formInputs.startDate.value);
    const product: Product = {
      "productName": formInputs.productName.value, 
      "productOwnerName": formInputs.productOwnerName.value, 
      "Developers": developers, 
      "scrumMasterName": formInputs.scrumMasterName.value, 
      "startDate": startDate, 
      "methodology": formInputs.methodology.value, 
      "productId": ""
    };
    const requestOptions = {
      "method": "POST",
      "headers": { "Content-Type": "application/json" },
      "body": JSON.stringify(product)
    };

    const response : ProductResponse = await fetch("api/products", requestOptions).then(res => res.json());
    props.setData(prev => {
      if (prev.result && response.result)
      {
        prev.result = [...prev.result, ...response.result];
      }
      return {...prev};
    });
  };  

  const formFields : JSX.Element[] = new Array();
  let key : keyof typeof formInputs;
  for (key in formInputs) {
    const keyCopy = key as string;
    formFields.push(
      <>
        <label key={keyCopy}>{formInputs[key].name}</label>
        <input type="text" onChange={e => onChangeHandler(e, keyCopy)} value={formInputs[key].value}></input>
      </>
    );
  }

  return(
    <form onSubmit={submitHandler}>
      {formFields}
      <input type="submit"/>
    </form>
  );
}