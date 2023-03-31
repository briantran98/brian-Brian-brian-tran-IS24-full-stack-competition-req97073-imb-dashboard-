import { Dispatch, forwardRef, MutableRefObject, SetStateAction, useEffect, useState, MouseEvent } from "react";
import { ProductResponse, Product, ProductFormInput } from "@/interfaces/index";
import ProductFormStyles from "@/styles/ProductForm.module.css";
import HomeStyles from "@/styles/Home.module.css";
import { postRequest, putRequest } from "@/lib/apiCalls";

function ProductForm(
  { setData, isHidden, product, isEditForm } : { setData: Dispatch<SetStateAction<ProductResponse>>, product? : Product, isHidden : boolean, isEditForm? : boolean },
  ref : any) : JSX.Element {
  const [ formInputs, setFormInputs ] = useState<ProductFormInput>({
    "productName": { "name": "Product Name", "value": "", "error": false},
    "productOwnerName": { "name": "Product Owner", "value":   "", "error": false},
    "developers": { "name": "Developer Names", "value": "", "error": false},
    "scrumMasterName": { "name": "Scrum Master", "value":   "", "error": false},
    "startDate": { "name": "Start Date", "value": "", "error": false},
    "methodology": { "name": "Methodology ", "value":   "", "error": false},
  });

  useEffect(() => {
    if (product && product.developers && product.startDate) {
      setFormInputs({
        "productName": { "name": "Product Name", "value": product.productName, "error": false},
        "productOwnerName": { "name": "Product Owner", "value":  product.productOwnerName, "error": false},
        "developers": { "name": "Developer Names", "value":  product.developers.toString(), "error": false},
        "scrumMasterName": { "name": "Scrum Master", "value":  product.scrumMasterName, "error": false},
        "startDate": { "name": "Start Date", "value":  new Date(product.startDate).toISOString().substring(0, 10), "error": false},
        "methodology": { "name": "Methodology ", "value":  product.methodology, "error": false},
      });
    }
  }, [product]);

  // Function to handle state changes on element change
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, keyString : string ) => {
    const target : EventTarget & HTMLInputElement = e.target;
    const key : keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs(prev => {
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
      if (!formInputs[key].value) {
        formInputs[key].error = true;
        errors = true;
      }
    }
    // If there was an and an input was null then return out of function
    if (errors) return;
    // Make post call to api
    const product: Product = createProduct();

    const response = await postRequest<Product, ProductResponse>("api/products", product);
    setData(prev => {
      if (prev.result && response.result) {
        prev.result = [...prev.result, ...response.result];
      }
      return {...prev};
    });
    setFormInputs(prev => {
      prev.developers.value = "";
      prev.methodology.value = "";
      prev.productName.value = "";
      prev.productOwnerName.value = "";
      prev.scrumMasterName.value = "";
      prev.startDate.value = "";
      return prev;
    });
    (ref as MutableRefObject<any>).current.className += HomeStyles["hidden"];
  };

  const saveButtonHandler = (event : MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    const updatedProduct = createProduct();
    setData(prev => {
      if (!prev.result) return prev;
      const foundIndex = prev.result?.findIndex(resultProduct => {
        const result = resultProduct.productId === product?.productId;
        return result;
      });
      if (!(foundIndex >= 0)) return prev;
      prev.result[foundIndex] = updatedProduct;
      prev.result[foundIndex].productId = product?.productId;
      updatedProduct.productId = product?.productId;
      return {...prev};
    });
    //TODO : ADD PUT REQUEST TO UPDATE THE SERVER
    if (!product) return;
    let response : ProductResponse;
    putRequest<Product, ProductResponse>(`api/products/${updatedProduct.productId}`, updatedProduct).then(res => response = res);
    (ref as MutableRefObject<any>).current.className += HomeStyles["hidden"];
  };

  const createProduct = () : Product => {
    if (formInputs.developers.value && formInputs.startDate.value) {
      const developers : string[] = formInputs.developers.value.split(",");
      const startDate : Date = new Date(formInputs.startDate.value);
      return {
        "productName": formInputs.productName.value, 
        "productOwnerName": formInputs.productOwnerName.value, 
        "developers": developers, 
        "scrumMasterName": formInputs.scrumMasterName.value, 
        "startDate": startDate, 
        "methodology": formInputs.methodology.value, 
        "productId": ""
      };
    }
    return {
      "productName": "", 
      "productOwnerName": "", 
      "developers": undefined, 
      "scrumMasterName": "", 
      "startDate": new Date(Date.now()), 
      "methodology": "", 
      "productId": ""
    };;
  };

  const formFields : JSX.Element[] = new Array();
  let key : keyof typeof formInputs;
  for (key in formInputs) {
    const keyCopy = key as string;
    formFields.push(
      <div>
        <label key={keyCopy}>{formInputs[key].name}</label>
        {key === "startDate" ? <input type="date" onChange={e => onChangeHandler(e, keyCopy)} value={formInputs[key].value}/> : <input type="text" onChange={e => onChangeHandler(e, keyCopy)} value={formInputs[key].value}/>}
      </div>
    );
  }

  return(
    <form ref={isHidden ? null : ref} className={`${ProductFormStyles["product-form-wrapper"]}` } onSubmit={submitHandler}>
      {formFields}
      {!isEditForm && <input type="submit"/>}
      {isEditForm && <input type="button" value={"Save"} onClick={saveButtonHandler}/>}
    </form>
  );
}

export default forwardRef(ProductForm);