import apiInstance, { handleRequest } from "./axios";

const customerApi = {
  login: (formData) => {
    const url = "/customer/login";
    return handleRequest(apiInstance.post(url, formData));
  },

  register: (formData) => {
    const url = "/customer/signup";
    return handleRequest(apiInstance.post(url, formData));
  },
};

export default customerApi;
