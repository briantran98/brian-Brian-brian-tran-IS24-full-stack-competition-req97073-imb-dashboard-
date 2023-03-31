import { Product, ProductResponse } from "@/interfaces";
import tableStyles from "@/styles/Table.module.css";
import { MutableRefObject, useRef, MouseEvent, useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from "react";
import ToolTipButton from "./ToolTipButton";

export default function Table({data, addButtonHandler, setNumberOfProducts} : {data : ProductResponse, addButtonHandler : (event : MouseEvent<HTMLButtonElement>, product? : Product) => void, setNumberOfProducts : Dispatch<SetStateAction<number>>,}){
  const [searchScrumMaster, setSearchScrumMaster] = useState("");
  const [searchDeveloper, setSearchDeveloper] = useState("");
  const tableData : MutableRefObject<JSX.Element[] | undefined> = useRef<JSX.Element[]>();


  const handleSearch = (event : ChangeEvent<HTMLInputElement>, property: string) => {
    if (property === "scrum master") {
      setSearchScrumMaster(event.target.value);
      setSearchDeveloper("");
    } else if (property === "developer") {
      setSearchScrumMaster("");
      setSearchDeveloper(event.target.value);
    }
  };

  // Populating refs with data coming from the api call to fill the table
  if (data.result && data.result.length) {
    tableData.current = data.result.map(product => {
      if (searchScrumMaster) {
        if (!(product.scrumMasterName?.toLowerCase().includes(searchScrumMaster.toLowerCase()))) return <></>;
      }
      if (searchDeveloper) {
        if (!(product.developers?.filter(developer => developer.toLowerCase().includes(searchDeveloper.toLowerCase())).length)) return <></>;
      }
      return(
        <tr className={tableStyles["table-body"]} key={ product.productId }>
          <td className={tableStyles["table-cell"]}>{ product.productId }</td>
          <td className={tableStyles["table-cell"]}>{ product.productName }</td>
          <td className={tableStyles["table-cell"]}>{ product.productOwnerName }</td>
          <td className={tableStyles["table-cell"]}>{ product.developers?.map(developer => {
            return(
              <p key={developer}>{ developer }</p>
            );
          }) }</td>
          <td className={tableStyles["table-cell"]}>{ product.scrumMasterName }</td>
          <td className={tableStyles["table-cell"]}>{ new Date(product.startDate).toISOString().substring(0,10) }</td>
          <td className={tableStyles["table-cell"]}>{ product.methodology }</td>
          <td className={tableStyles["table-cell"]}>
            <ToolTipButton onEditHanlder={e => addButtonHandler(e, product)}>...</ToolTipButton>
          </td>
        </tr>
      );
    });
  }

  if (tableData.current?.filter(jsx => jsx.key).length) {
    setNumberOfProducts(tableData.current?.filter(jsx => jsx.key).length);
  }
	
  // data = {
  //   nodes: data.nodes.filter((item) => item.scrumMasterName?.toLowerCase().includes(search.toLowerCase()))
  // };

  return(        
    <>
      {/* <h1>{ref.current}</h1> */}
      <label htmlFor="search">
        Search by Scrum Master:&nbsp;
        <input id="search" type="text" value={searchScrumMaster} onChange={e => handleSearch(e, "scrum master")} autoComplete="off" />
      </label>
      <label htmlFor="search">
        Search by Developer:&nbsp;
        <input id="search" type="text" value={searchDeveloper} onChange={e => handleSearch(e, "developer")} autoComplete="off" />
      </label>
      <table>
        <thead >
          <tr>
            <th className={tableStyles["table-header"]}>Product Number</th>
            <th className={tableStyles["table-header"]}>Prodcut Name</th>
            <th className={tableStyles["table-header"]}>Prodcut Owner Name</th>
            <th className={tableStyles["table-header"]}>Developers</th>
            <th className={tableStyles["table-header"]}>Scrum Master Name</th>
            <th className={tableStyles["table-header"]}>Start Date</th>
            <th className={tableStyles["table-header"]}>Methodology</th>
            <th className={tableStyles["table-header"]}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.current}
        </tbody>
      </table>
    </>
  );
}

// export default forwardRef(Table);
