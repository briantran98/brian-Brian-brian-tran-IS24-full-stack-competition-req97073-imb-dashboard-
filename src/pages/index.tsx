import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import { ProductResponse } from "@/interfaces/index";
import ProductForm from "@/components/ProductForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState<ProductResponse>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(products => {
        setData(products);
        setIsLoading(false);
      });
  }, []);

  let tableData: JSX.Element[] | null = null;
  let numberOfProjects: number = 0;
  if (data.result && data.result.length)
  {
    numberOfProjects = data.result.length;
    tableData = data.result.map(product => {
      return(
        <tr key={ product.productId }>
          <td>{ product.productId }</td>
          <td>{ product.productName }</td>
          <td>{ product.productOwnerName }</td>
          <td>{ product.Developers.map(developer => {
            return(
              <tr key={ product.productId + developer}>
                <td>{ developer }</td>
              </tr>
            );
          }) }</td>
          <td>{ product.scrumMasterName }</td>
          <td>{ product.startDate.toLocaleString() }</td>
          <td>{ product.methodology }</td>
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
        <ProductForm setData={setData}/>
        <header>
          <h1>{numberOfProjects} Projects</h1>
          <button>Add Project</button>
        </header>
        <table>
          <thead>
            <tr>
              <td>Product Number</td>
              <th>Prodcut Name</th>
              <th>Prodcut Owner Name</th>
              <th>Developers</th>
              <th>Scrum Master Name</th>
              <th>Start Date</th>
              <th>Methodology</th>
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
