"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "@/store";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Provider>
  );
}
