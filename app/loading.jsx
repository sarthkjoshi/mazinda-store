import OvalLoader from "@/components/utility/OvalLoader";

const Loading = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center gap-5">
      <span>Loading... please wait </span>
      <OvalLoader />
    </div>
  );
};

export default Loading;
