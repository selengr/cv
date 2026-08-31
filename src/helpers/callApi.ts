import axios from "axios";
import ValidationError from "@/exceptions/validationError";
import { handleLocalRequest } from "@/helpers/localApi";

const useLocalAuth = process.env.NEXT_PUBLIC_LOCAL_AUTH !== "false";

const callApi = () => {
  const axiosInstance = axios.create({
    baseURL: "/api/backend",
    withCredentials: true,
    adapter: async (config) => {
      if (useLocalAuth) {
        const local = await handleLocalRequest(config);
        if (local) return local;
      }

      const fallback = axios.getAdapter(["xhr", "http", "fetch"]);
      return fallback(config);
    },
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const res = err?.response;
      if (res?.status === 422) {
        throw new ValidationError(res.data?.errors ?? {});
      }

      throw err;
    },
  );

  return axiosInstance;
};

export default callApi;
