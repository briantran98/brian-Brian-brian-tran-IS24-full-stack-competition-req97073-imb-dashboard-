import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, MouseEventHandler, useRef } from "react";
import { Product, ProductResponse } from "@/interfaces/index";
import ProductForm from "@/components/ProductForm";
import ToolTipButton from "@/components/ToolTipButton";
import { MouseEvent } from "react";
import useClickAwayListener from "@/hooks/useClickAwayListener";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState<ProductResponse>({response_code: 0});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const addProductRef = useRef(null);
  const editProductRef = useRef(null);

  useClickAwayListener(addProductRef, setIsAddingProduct);
  useClickAwayListener(editProductRef, setIsEditing);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(products => {
        setData(products);
        setIsLoading(false);
      });
  }, []);

  const buttonHandler = (event : MouseEvent<HTMLButtonElement>, product?: Product) => {
    event.preventDefault();
    const buttonText = (event.target as Node).textContent;
    switch(buttonText) {
    case "Add Product":
      setIsAddingProduct(prev => !prev);
      break;
    case "Edit":
      setIsEditing(prev => !prev);
      setSelectedProduct(product);
      break;
    }
  };

  let tableData: JSX.Element[] | null = null;
  let numberOfProducts: number = 0;
  if (data.result && data.result.length) {
    numberOfProducts = data.result.length;
    tableData = data.result.map(product => {
      return(
        <tr className={styles["table-body"]} key={ product.productId }>
          <td>{ product.productId }</td>
          <td>{ product.productName }</td>
          <td>{ product.productOwnerName }</td>
          <td>{ product.developers?.map(developer => {
            return(
              <tr key={ product.productId + developer}>
                <td>{ developer }</td>
              </tr>
            );
          }) }</td>
          <td>{ product.scrumMasterName }</td>
          <td>{ new Date(product.startDate).toISOString().substring(0,10) }</td>
          <td>{ product.methodology }</td>
          <td>
            <ToolTipButton onEditHanlder={e => buttonHandler(e, product)}>...</ToolTipButton>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <Head>
        <title>IMB Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles["page-header"]}>
          <h1>{numberOfProducts} Products</h1>
          <button className={styles["add"]} onClick={buttonHandler}>Add Product</button>
        </header>
        {isAddingProduct && <ProductForm ref={addProductRef} setData={setData} isHidden={!isAddingProduct}/>}
        {isEditing && <ProductForm ref={editProductRef} setData={setData} product={selectedProduct} isHidden={!isEditing} isEditForm={true}></ProductForm>}
        <table>
          <thead >
            <tr>
              <th className={styles["table-header"]}>Product Number</th>
              <th className={styles["table-header"]}>Prodcut Name</th>
              <th className={styles["table-header"]}>Prodcut Owner Name</th>
              <th className={styles["table-header"]}>Developers</th>
              <th className={styles["table-header"]}>Scrum Master Name</th>
              <th className={styles["table-header"]}>Start Date</th>
              <th className={styles["table-header"]}>Methodology</th>
              <th className={styles["table-header"]}></th>
            </tr>
          </thead>
          <tbody>
            {tableData}
          </tbody>
        </table>
      </main>
    </>
  );
}
