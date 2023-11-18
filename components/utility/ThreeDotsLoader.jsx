import React from "react";
import { ThreeDots } from "react-loader-spinner";

const ThreeDotsLoader = () => {
  return (
    <ThreeDots
      height="80"
      width="80"
      radius="9"
      color="black"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
    />
  );
};

export default ThreeDotsLoader;
