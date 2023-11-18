import { MagnifyingGlass } from "react-loader-spinner";

const MagnifyingLoader = () => {
  return (
    <MagnifyingGlass
      visible={true}
      height="40"
      width="40"
      ariaLabel="MagnifyingGlass-loading"
      wrapperStyle={{}}
      wrapperClass="MagnifyingGlass-wrapper"
      glassColor="white"
      color="black"
    />
  );
};

export default MagnifyingLoader;