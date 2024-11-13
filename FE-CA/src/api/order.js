import { getLocalStorage } from "../utils/sessionStorage";
import apiInstance, { handleRequest } from "./axios";
const orderApi = {
  order: (data) => {
    const url = "/shopping/order";
    return handleRequest(
      apiInstance.post(url, data, {
        headers: {
          Authorization: `Bearer ${getLocalStorage("userToken")}`,
        },
      })
    );
  },
};

export default orderApi;
