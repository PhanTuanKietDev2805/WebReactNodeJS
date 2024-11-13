import axios from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  validateStatus: (status) => status <= 500,
  withCredentials: false,
});

apiInstance.interceptors.request.use((request) => request);

const handleRequest = (promise) => promise.then((res) => res).catch((err) => err);

export default apiInstance;

export { handleRequest };
