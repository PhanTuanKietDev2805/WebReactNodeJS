import { getLocalStorage } from 'src/utils/sessionStorage';

import apiInstance, { handleRequest } from './axios';

const customerApi = {
  login: (formData) => {
    const url = '/customer/login';
    return handleRequest(apiInstance.post(url, formData));
  },
  getAll: () => {
    const url = '/customer/get-all';
    return handleRequest(
      apiInstance.get(url, {
        headers: {
          Authorization: `Bearer ${getLocalStorage('adminToken')}`,
        },
      })
    );
  },
};

export default customerApi;
