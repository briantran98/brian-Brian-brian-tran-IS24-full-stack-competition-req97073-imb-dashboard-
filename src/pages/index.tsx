import Head from "next/head";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Product, ProductResponse } from "@/interfaces/index";
import ProductForm from "@/components/ProductForm";
import Table from "@/components/Table";
import ReactTable from "@/components/ReactTable";
import { MouseEvent } from "react";
import useClickAwayListener from "@/hooks/useClickAwayListener";

// Local font inter
const myFont = localFont({
  src: "../fonts/Inter/Inter-VariableFont_slnt,wght.ttf",
});

// Main applicaton
export default function Home() {
  // Initiliazing states
  const [data, setData] = useState<ProductResponse>({ response_code: 0 });
  const [error, setError] = useState<boolean>(false);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [numberOfProducts, setNumberOfProducts] = useState<number>(0);
  // Initiliazing refs to be used on the page as its rendered
  const addProductRef: MutableRefObject<null> = useRef(null);
  const editProductRef: MutableRefObject<null> = useRef(null);
  // const numberOfProducts : MutableRefObject<number | undefined> = useRef<number>();

  // Adding refs to usehook click away listeners
  useClickAwayListener(addProductRef, setIsAddingProduct);
  useClickAwayListener(editProductRef, setIsEditing);

  // API Call to populate page with mock products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        const product = products as ProductResponse;
        if (product.response_code !== 200) throw new Error();
        setData({ ...products });
        if (product.result) {
          setNumberOfProducts(product.result.length);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  // Button handler to display ProdcutForm component
  const addButtonHandler = (
    event: MouseEvent<HTMLButtonElement>,
    product?: Product
  ) => {
    event.preventDefault();
    const buttonText = (event.target as Node).textContent;
    switch (buttonText) {
    case "Add Product":
      setIsAddingProduct((prev) => !prev);
      break;
    case "Edit":
      setIsEditing((prev) => !prev);
      setSelectedProduct(product);
      break;
    }
  };

  return (
    <>
      <Head>
        <title>IMB Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && (
        <div className={`${myFont.className} ${styles.error}`}>
          <div>
            <h1>Error grabbing data</h1>
            <h2>Please try reloading or checking endpoint &quot;localhost:3000/api/products&quot;</h2>
          </div>
          <button onClick={() => setError(prev => !prev)} className={styles["error-button"]}>X</button>
        </div>
      )}
      <main className={`${myFont.className} ${styles.main}`}>
        <header className={`${styles["page-header"]}`}>
          <h1>{numberOfProducts} Products</h1>
          {/* <button className={styles["search"]}>Search</button> */}
          <button className={styles["add"]} onClick={addButtonHandler}>
            Add Product
          </button>
        </header>
        {/* Conditional Renders for the ProductForm component */}
        {isAddingProduct && (
          <ProductForm
            ref={addProductRef}
            setData={setData}
            isHidden={!isAddingProduct}
            setIsHidden={setIsAddingProduct}
            setError={setError}
          />
        )}
        {isEditing && (
          <ProductForm
            ref={editProductRef}
            setData={setData}
            product={selectedProduct}
            isHidden={!isEditing}
            isEditForm={true}
            setIsHidden={setIsEditing}
            setError={setError}
          ></ProductForm>
        )}
        <Table
          data={data}
          addButtonHandler={addButtonHandler}
          setNumberOfProducts={setNumberOfProducts}
        />
        {/* <ReactTable values={data} addButtonHandler={addButtonHandler}/> */}
      </main>
    </>
  );
}
