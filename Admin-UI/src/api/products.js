import { getLocalStorage } from 'src/utils/sessionStorage';

import apiInstanceProducts from './productAxios';
import apiInstance, { handleRequest } from './axios';

const productsApi = {
  getNew: () => {
    const url = '/product/new';
    return handleRequest(apiInstance.get(url));
  },
  getProducts: () => {
    const url = '/';
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
  create: (body) => {
    const url = `/product/create`;
    return handleRequest(
      apiInstanceProducts.post(url, body, {
        headers: {
          Authorization: `Bearer ${getLocalStorage('adminToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },
  update: (body, productId) => {
    const url = `/product/update/${productId}`;
    return handleRequest(
      apiInstanceProducts.post(url, body, {
        headers: {
          Authorization: `Bearer ${getLocalStorage('adminToken')}`,
        },
      })
    );
  },
  updateImage: (body, productId) => {
    const url = `/product/update-image/${productId}`;
    return handleRequest(
      apiInstanceProducts.post(url, body, {
        headers: {
          Authorization: `Bearer ${getLocalStorage('adminToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },
  delete: (productId) => {
    const url = `/product/delete/${productId}`;
    return handleRequest(
      apiInstanceProducts.post(url, null, {
        headers: {
          Authorization: `Bearer ${getLocalStorage('adminToken')}`,
        },
      })
    );
  },
};

export default productsApi;
