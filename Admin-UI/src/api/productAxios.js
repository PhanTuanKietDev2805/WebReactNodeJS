import axios from 'axios';

const apiInstanceProducts = axios.create({
  baseURL: import.meta.env.VITE_API_PRODUCT_KEY,
  validateStatus: (status) => status <= 500,
  withCredentials: false,
});

apiInstanceProducts.interceptors.request.use((request) => request);

const handleRequest = (promise) => promise.then((res) => res).catch((err) => err);

export default apiInstanceProducts;

export { handleRequest };
