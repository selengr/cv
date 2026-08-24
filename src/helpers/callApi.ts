import axios from "axios";
import ValidationError from "@/exceptions/validationError";

const callApi = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const res = err?.response;
      if (res?.status === 422) {
        throw new ValidationError(res.data.errors);
      }

      throw err;
    },
  );

  return axiosInstance;
};

export default callApi;
