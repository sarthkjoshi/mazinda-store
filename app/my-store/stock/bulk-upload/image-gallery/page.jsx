"use client";

import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ImageGallery = () => {
  const store_name = useSelector((state) => state.store.store.storeName);

  useEffect(() => {
    if (store_name) {
      (async () => {
        const { data } = await axios.post("/api/aws/get-files", {
          store_name,
          folder_name: "product-csv",
        });

        console.log(data);
      })();
    }
  }, [store_name]);

  return (
    <div className="relative h-[80vh] md:w-1/2 mx-auto">
      <h1 className="font-bold text-xl">Your Product Images</h1>
    </div>
  );
};

export default ImageGallery;
