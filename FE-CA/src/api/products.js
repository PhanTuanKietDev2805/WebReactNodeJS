import apiInstance, { handleRequest } from "./axios";

const productsApi = {
  getNew: () => {
    const url = "/product/new";
    return handleRequest(apiInstance.get(url));
  },
  getProducts: () => {
    const url = "/";
    return handleRequest(apiInstance.get(url));
  },
  getProductsByQuery: (name) => {
    const url = `?name=${name}`;
    return handleRequest(apiInstance.get(url));
  },
  getByType: (type) => {
    const url = `/category/${type}`;
    return handleRequest(apiInstance.get(url));
  },
};

export default productsApi;
