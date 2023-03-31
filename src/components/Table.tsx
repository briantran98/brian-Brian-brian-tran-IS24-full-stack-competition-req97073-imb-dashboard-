import { Product, ProductResponse } from "@/interfaces";
import tableStyles from "@/styles/Table.module.css";
import {
  MutableRefObject,
  useRef,
  MouseEvent,
  useState,
  ChangeEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import ToolTipButton from "./ToolTipButton";

/**
 * Table component that will render out the product
 * Takes in 3 props
 * @param props.data type of ProductResponse. Data that will fill up the table
 * @param props.addButtonHandler() callback function for add button handler post functionality
 * @param props.setNumberOfProducts() callback function that updates state in parent component
 * @returns JSX.Element
 */
export default function Table({
  data,
  addButtonHandler,
  setNumberOfProducts,
}: {
  data: ProductResponse;
  addButtonHandler: (
    event: MouseEvent<HTMLButtonElement>,
    product?: Product
  ) => void;
  setNumberOfProducts: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  // Initializing use states and refs
  const [searchScrumMaster, setSearchScrumMaster] = useState("");
  const [searchDeveloper, setSearchDeveloper] = useState("");
  const tableData: MutableRefObject<JSX.Element[] | undefined> =
    useRef<JSX.Element[]>();

  // Controlled component handler for search states
  // Only one search can be used at a time so clear the other search when in use
  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
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
    tableData.current = data.result.map((product) => {
      // If statements for the search functionality
      // If search for scrum master check to see search includes any names in the array from data. If no results return empty element;
      if (searchScrumMaster) {
        if (
          !product.scrumMasterName
            ?.toLowerCase()
            .includes(searchScrumMaster.toLowerCase())
        )
          return <></>;
      }
      // If search for developer check to see search includes any names in the array from data and the array from developers. If no results return empty element;
      if (searchDeveloper) {
        if (
          !product.developers?.filter((developer) =>
            developer.toLowerCase().includes(searchDeveloper.toLowerCase())
          ).length
        )
          return <></>;
      }
      // Fill table with product information if there were results from the search.
      return (
        <tr className={tableStyles["table-body"]} key={product.productId}>
          <td className={tableStyles["table-cell"]}>{product.productId}</td>
          <td className={tableStyles["table-cell"]}>{product.productName}</td>
          <td className={tableStyles["table-cell"]}>
            {product.productOwnerName}
          </td>
          <td className={tableStyles["table-cell"]}>
            {product.developers?.map((developer) => {
              return <p key={developer}>{developer}</p>;
            })}
          </td>
          <td className={tableStyles["table-cell"]}>
            {product.scrumMasterName}
          </td>
          <td className={tableStyles["table-cell"]}>
            {new Date(product.startDate).toISOString().substring(0, 10)}
          </td>
          <td className={tableStyles["table-cell"]}>{product.methodology}</td>
          <td className={tableStyles["table-cell"]}>
            <ToolTipButton onEditHandler={(e) => addButtonHandler(e, product)}>
              ...
            </ToolTipButton>
          </td>
        </tr>
      );
    });
  }

  // Render the count of number of products when search filter renders
  useEffect(() => {
    if (tableData.current?.filter((jsx) => jsx.key).length) {
      setNumberOfProducts(tableData.current?.filter((jsx) => jsx.key).length);
    }
  }, [tableData.current]);

  return (
    <>
      <label htmlFor="search">
        Search by Scrum Master:&nbsp;
        <input
          id="search"
          type="text"
          value={searchScrumMaster}
          onChange={(e) => handleSearch(e, "scrum master")}
          autoComplete="off"
        />
      </label>
      <label htmlFor="search">
        Search by Developer:&nbsp;
        <input
          id="search"
          type="text"
          value={searchDeveloper}
          onChange={(e) => handleSearch(e, "developer")}
          autoComplete="off"
        />
      </label>
      <table>
        <thead>
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
        <tbody>{tableData.current}</tbody>
      </table>
    </>
  );
}
