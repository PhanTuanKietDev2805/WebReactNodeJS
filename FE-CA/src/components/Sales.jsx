import React, { useState, useEffect } from "react";
import Item from "./utils/Item";
import Title from "./utils/Title";
import productsApi from "../api/products";

const Sales = ({ ifExists, endpoint: { title, items } }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProducts = async (type) => {
    const res = await productsApi.getProducts();
    if (res.status === 200) {
      setProducts(res.data.products);
    }
  };
  useEffect(() => {
    if (search === "") {
      getProducts();
    }
  }, [search]);

  const searchApi = async (query) => {
    const res = await productsApi.getProductsByQuery(query);
    if (res.status === 200) {
      setProducts(res.data.products);
    }
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Debounced search function
  const delayedSearch = debounce(searchApi, 2000); // 2000ms delay

  // Event handler for input change
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    delayedSearch(query); // Call the debounced search function with the input query
  };
  // console.log(endpoint)
  return (
    <>
      <div className="nike-container">
        <div className="flex flex-row justify-center items-center gap-10 md:flex-col">
          <Title title={"Product"} />
          <input
            type="text"
            className="border-sky-100 border-2 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
            placeholder="Search"
            style={{ transition: "all .15s ease" }}
            value={search}
            onChange={handleInputChange}
          />
        </div>
        <div
          className={`grid items-center justify-items-center gap-7 lg:gap-5 mt-7 ${
            ifExists
              ? "grid-cols-3 xl:grid-cols-2 sm:grid-cols-1"
              : "grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
          }`}
        >
          {products?.map((item, i) => (
            <Item
              {...item}
              key={i}
              ifExists={ifExists}
              color="bg-gradient-to-b from-sky-400 to-sky-200"
              shadow="shadow-lg shadow-cyan-200"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sales;
