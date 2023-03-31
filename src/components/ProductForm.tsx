import {
  Dispatch,
  forwardRef,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import { ProductResponse, Product, ProductFormInput } from "@/interfaces/index";
import ProductFormStyles from "@/styles/ProductForm.module.css";
import localFont from "next/font/local";
import { postRequest, putRequest } from "@/lib/apiCalls";

const myFont = localFont({
  src: "../fonts/Inter/Inter-VariableFont_slnt,wght.ttf",
});

/**
 * ProductForm component used to fill out details of a product to either be add or edited. Makes post and put requests to the server
 * @param setData type callback Dispatch<SetStateAction<ProductResponse>>. Update the data of products once post is made
 * @param isHidden type boolean. State of the hiding status
 * @param product type product. Used when editing a table entry the prepopulate input fields
 * @param isEditForm type boolean. Set to true when using as editing form and adding form when false
 * @param setIsHidden type callback Dispatch<SetStateAction<boolean>>. Update the hiding state of the component and overlay
 * @param ref
 * @returns JSX.Element
 */
function ProductForm(
  {
    setData,
    isHidden,
    product,
    isEditForm,
    setIsHidden,
    setError
  }: {
    setData: Dispatch<SetStateAction<ProductResponse>>;
    product?: Product;
    isHidden: boolean;
    isEditForm?: boolean;
    setIsHidden: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<boolean>>
  },
  ref: any
): JSX.Element {
  // Initializing state to control the input values for the form
  const [formInputs, setFormInputs] = useState<ProductFormInput>({
    productName: { name: "Product Name", value: "" },
    productOwnerName: { name: "Product Owner", value: "" },
    developers: { name: "Developer Names", value: "" },
    scrumMasterName: { name: "Scrum Master", value: "" },
    startDate: { name: "Start Date", value: "" },
    methodology: { name: "Methodology ", value: "Waterfall" },
  });
  const saveRef: MutableRefObject<any> = useRef(null);

  // Adding default values to the form if product prop is supplied for edit function
  useEffect(() => {
    if (product && product.developers && product.startDate) {
      setFormInputs({
        productName: { name: "Product Name", value: product.productName },
        productOwnerName: {
          name: "Product Owner",
          value: product.productOwnerName,
        },
        developers: {
          name: "Developer Names",
          value: product.developers.toString(),
        },
        scrumMasterName: {
          name: "Scrum Master",
          value: product.scrumMasterName,
        },
        startDate: {
          name: "Start Date",
          value: new Date(product.startDate).toISOString().substring(0, 10),
        },
        methodology: { name: "Methodology ", value: product.methodology },
      });
    }
  }, [product]);

  const createProduct = (): Product => {
    if (formInputs.developers.value && formInputs.startDate.value) {
      const developers: string[] = formInputs.developers.value.split(",");
      const startDate: Date = new Date(formInputs.startDate.value);
      return {
        productName: formInputs.productName.value,
        productOwnerName: formInputs.productOwnerName.value,
        developers: developers,
        scrumMasterName: formInputs.scrumMasterName.value,
        startDate: startDate,
        methodology: formInputs.methodology.value,
        productId: "",
      };
    }
    return {
      productName: "",
      productOwnerName: "",
      developers: undefined,
      scrumMasterName: "",
      startDate: new Date(Date.now()),
      methodology: "",
      productId: "",
    };
  };

  // Add button handler for making post requests
  const addHandler = async () => {
    const product: Product = createProduct();
    postRequest<Product, ProductResponse>("api/products",product).then(response => {
      // Add response to the list of products
      if (response.response_code !== 201) throw new Error();
      setData((prev) => {
        if (prev.result && response.result) {
          prev.result = [...prev.result, ...response.result];
        }
        return { ...prev };
      });
    }).catch(() => {
      setError(prev => !prev);
    });

    // Clear the form and reset fields to empty string
    setFormInputs((prev) => {
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
    setData((prev) => {
      if (!prev.result) return prev;
      const foundIndex = prev.result?.findIndex((resultProduct) => {
        const result = resultProduct.productId === product?.productId;
        return result;
      });
      if (!(foundIndex >= 0)) return prev;
      prev.result[foundIndex] = updatedProduct;
      prev.result[foundIndex].productId = product?.productId;
      updatedProduct.productId = product?.productId;
      return { ...prev };
    });

    if (!product) return;
    let response: ProductResponse;
    putRequest<Product, ProductResponse>(
      `api/products/${updatedProduct.productId}`,
      updatedProduct
    ).then((res) => {
      if (res.response_code !== 200) throw new Error();
      return (response = res);
    }).catch(() => {
      setError(prev => !prev);
    });
  };

  // Handler for on submit to send to either save or add handler
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Checks to see if the ref is currently on the edit page or the add new product page
    // If true on edit page then pass off to saveHandler() else createa product and make post request
    if (
      saveRef.current &&
      saveRef.current.contains((e.target as Node).lastChild)
    ) {
      saveHandler();
    } else {
      addHandler();
    }

    // Update the hiding state
    setIsHidden((prev) => !prev);
  };

  // Function to handle state changes on element change
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyString: string
  ) => {
    const target: EventTarget & HTMLInputElement = e.target;
    const key: keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs((prev) => {
      prev[key].value = target.value;
      return { ...prev };
    });
  };

  // Function to handle state changes on element change
  const onTextAreaChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    keyString: string
  ) => {
    const target: EventTarget & HTMLTextAreaElement = e.target;
    const key: keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs((prev) => {
      prev[key].value = target.value;
      return { ...prev };
    });
  };

  // Function to handle state changes on element change
  const onSelectChangeHandler = (
    e: ChangeEvent<HTMLSelectElement>,
    keyString: string
  ) => {
    const target: EventTarget & HTMLSelectElement = e.target;
    const key: keyof typeof formInputs = keyString as keyof typeof formInputs;
    // Change state of formInputs with updated value and set error to false
    setFormInputs((prev) => {
      prev[key].value = target.value;
      return { ...prev };
    });
  };

  // Creating the form programatically
  const formFields: JSX.Element[] = new Array();
  let key: keyof typeof formInputs;
  for (key in formInputs) {
    const keyCopy = key as string;
    formFields.push(
      <div key={keyCopy} className={ProductFormStyles["form-input-wrapper"]}>
        <label>{formInputs[key].name}</label>
        {/**date input style for startDate
         * textarea for developers
         * select for methedology
         */}
        {key === "startDate" ? (
          <input
            className={myFont.className}
            type="date"
            onChange={(e) => onChangeHandler(e, keyCopy)}
            required={true}
            value={formInputs[key].value}
          />
        ) : key === "developers" ? (
          <textarea
            className={`${ProductFormStyles["text-area-input"]} ${myFont.className}`}
            required={true}
            onChange={(e) => onTextAreaChangeHandler(e, keyCopy)}
            value={formInputs[key].value}
          />
        ) : key === "methodology" ? (
          <select
            id="methodology"
            value={formInputs[key].value}
            onChange={(e) => onSelectChangeHandler(e, keyCopy)}
          >
            <option value="Waterfall">Waterfall</option>
            <option value="Agile">Agile</option>
          </select>
        ) : (
          <input
            className={`${myFont.className} ${ProductFormStyles["product-input"]}`}
            type={"text"}
            required={true}
            onChange={(e) => onChangeHandler(e, keyCopy)}
            value={formInputs[key].value}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={ProductFormStyles["overlay"]} />
      <form
        ref={isHidden ? null : ref}
        className={`${ProductFormStyles["product-form-wrapper"]}`}
        onSubmit={submitHandler}
      >
        {formFields}
        {!isEditForm && (
          <input
            className={ProductFormStyles["submit"]}
            type="submit"
            value={"Submit"}
          />
        )}
        {isEditForm && (
          <input
            className={ProductFormStyles["submit"]}
            ref={saveRef}
            type="submit"
            value={"Save"}
          />
        )}
      </form>
    </>
  );
}

// Exporting with forwardRef to allow refs to be passed from parent to child
export default forwardRef(ProductForm);
