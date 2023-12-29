"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import BackButton from "@/components/utility/BackButton";

export default function RootLayoutClient({ children }) {
  return (
    <>
      <Provider store={store}>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
          theme="light"
        />
        {children}
        <div className="absolute top-24">
          <BackButton />
        </div>
      </Provider>
    </>
  );
}
