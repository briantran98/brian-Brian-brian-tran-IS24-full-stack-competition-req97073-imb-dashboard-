import { Dispatch, forwardRef, MutableRefObject, SetStateAction, useEffect, useState, MouseEvent, useRef, ChangeEvent } from "react";
import { ProductResponse, Product, ProductFormInput } from "@/interfaces/index";
import ProductFormStyles from "@/styles/ProductForm.module.css";
import { Inter } from "next/font/google";
import HomeStyles from "@/styles/Home.module.css";
import { postRequest, putRequest } from "@/lib/apiCalls";

const inter = Inter({ subsets: ["latin"] });

function ProductForm(
  { setData, isHidden, product, isEditForm, setIsHidden } :
  { 
    setData: Dispatch<SetStateAction<ProductResponse>>,
    product? : Product,
    isHidden : boolean,
    isEditForm? : boolean,
    setIsHidden: Dispatch<SetStateAction<boolean>>
  },
  ref : any) : JSX.Element {
  // Initializing state to control the input values for the form
  const [ formInputs, setFormInputs ] = useState<ProductFormInput>({
    "productName": { "name": "Product Name", "value": ""},
    "productOwnerName": { "name": "Product Owner", "value":   ""},
    "developers": { "name": "Developer Names", "value": ""},
    "scrumMasterName": { "name": "Scrum Master", "value":   ""},
    "startDate": { "name": "Start Date", "value": ""},
    "methodology": { "name": "Methodology ", "value":   "Waterfall"},
  });

  const saveRef : MutableRefObject<any> = useRef(null); 

  // Adding default values to the form if product prop is supplied for edit function
  useEffect(() => {
    if (product && product.developers && product.startDate) {
      setFormInputs({
        "productName": { "name": "Product Name", "value": product.productName},
        "productOwnerName": { "name": "Product Owner", "value":  product.productOwnerName},
        "developers": { "name": "Developer Names", "value":  product.developers.toString()},
        "scrumMasterName": { "name": "Scrum Master", "value":  product.scrumMasterName},
        "startDate": { "name": "Start Date", "value":  new Date(product.startDate).toISOString().substring(0, 10)},
        "methodology": { "name": "Methodology ", "value":  product.methodology},
      });
    }
  }, [product]);

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
    };
  };

  const addHandler = async () => {
    const product: Product = createProduct();
    const response = await postRequest<Product, ProductResponse>("api/products", product);

    // Add response to the list of products
    setData(prev => {
      if (prev.result && response.result) {
        prev.result = [...prev.result, ...response.result];
      }
      return {...prev};
    });

    // Clear the form and reset fields to empty string
    setFormInputs(prev => {
      prev.developers.value = "";
      prev.methodology.value = "";
      prev.productName.value = "";
      prev.productOwnerName.value = "";
      prev.scrumMasterName.value = "";
      prev.startDate.value = "";
      return prev;
    });
  };

  // Save button handler for the edit form
  const saveHandler = () => {
    const updatedProduct = createProduct();

    // Update the specific product with the new information
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

    if (!product) return;
    let response : ProductResponse;
    putRequest<Product, ProductResponse>(`api/products/${updatedProduct.productId}`, updatedProduct).then(res => response = res);
  };

  // Handler for on submit to send post request to api/products
  const submitHandler = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Checks to see if the ref is currently on the edit page or the add new product page
    // If true on edit page then pass off to saveHandler() else createa product and make post request
    if (saveRef.current && saveRef.current.contains((e.target as Node).lastChild)) {
      saveHandler();
    } else {
      addHandler();
    }
  
    // Update the hiding state
    setIsHidden(prev => !prev);
  };

  // Function to handle state changes on element change
  const onChangeHandler = (e : React.ChangeEvent<HTMLInputElement>, keyString : string ) => {
    const target : EventTarget & HTMLInputElement = e.target;
    const key : keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs(prev => {
      prev[key] .value = target.value;
      return {...prev};
    });
  };
  
  // Function to handle state changes on element change
  const onTextAreaChangeHandler = (e : React.ChangeEvent<HTMLTextAreaElement>, keyString : string ) => {
    const target : EventTarget & HTMLTextAreaElement = e.target;
    const key : keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs(prev => {
      prev[key] .value = target.value;
      return {...prev};
    });
  };

  const onSelectChangeHandler = (e : ChangeEvent<HTMLSelectElement>, keyString : string) => {
    const target : EventTarget & HTMLSelectElement = e.target;
    const key : keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs(prev => {
      prev[key] .value = target.value;
      return {...prev};
    });
  };

  const formFields : JSX.Element[] = new Array();
  let key : keyof typeof formInputs;
  for (key in formInputs) {
    const keyCopy = key as string;
    formFields.push(
      <div key={keyCopy} className={ProductFormStyles["form-input-wrapper"]}>
        <label>{formInputs[key].name}</label>
        {key === "startDate" ? <input className={inter.className} type="date" onChange={e => onChangeHandler(e, keyCopy)} required={true} value={formInputs[key].value}/> :
          key === "developers" ? <textarea className={`${ProductFormStyles["text-area-input"]} ${inter.className}`} required={true} onChange={e => onTextAreaChangeHandler(e, keyCopy)} value={formInputs[key].value}/>:
            key === "methodology" ? <select id="methodology" value={formInputs[key].value} onChange={e => onSelectChangeHandler(e, keyCopy)}><option value="Waterfall">Waterfall</option><option value="Agile">Agile</option></select> : <input className={`${inter.className} ${ProductFormStyles["product-input"]}`} type={"text"} required={true} onChange={e => onChangeHandler(e, keyCopy)} value={formInputs[key].value}/>}
      </div>
    );
  }

  return(
    <>
      <div className={ProductFormStyles["overlay"]}/>
      <form ref={isHidden ? null : ref} className={`${ProductFormStyles["product-form-wrapper"]}` } onSubmit={submitHandler}>
        {formFields}
        {!isEditForm && <input className={ProductFormStyles["submit"]} type="submit" value={"Submit"}/>}
        {isEditForm && <input className={ProductFormStyles["submit"]} ref={saveRef} type="submit" value={"Save"}/>}
      </form>
    </>
  );
}

export default forwardRef(ProductForm);