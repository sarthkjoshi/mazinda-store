const AnalyticsComponent = ({
  productsSold,
  ordersReceived,
  stockAvailable,
  totalStockValue,
}) => {
  return (
    <div className="flex items-center justify-between bg-white mb-4 md:w-1/2 md:mx-auto mx-1 my-2">
        
      <div className="flex flex-col items-center border px-3 py-1 rounded-lg shadow mx-1 text-center">
          <p className="text-md md:text-3xl">220</p>
          <p className="text-[8px] md:text-lg md:text-md text-gray-600">Products Sold Today</p>
      </div>

      <div className="flex flex-col items-center border px-3 py-1 rounded-lg shadow mx-1 text-center">
          <p className="text-md md:text-3xl">23</p>
          <p className="text-[8px] md:text-lg text-gray-600">Orders Received</p>
      </div>

      <div className="flex flex-col items-center border px-3 py-1 rounded-lg shadow mx-1 text-center">
          <p className="text-md md:text-3xl">2334</p>
          <p className="text-[8px] md:text-lg text-gray-600">Stock Available</p>
      </div>

      <div className="flex flex-col items-center border px-3 py-1 rounded-lg shadow mx-1 text-center">
          <p className="text-md md:text-3xl">23087</p>
          <p className="text-[8px] md:text-lg text-gray-600">Total Stock Value</p>
      </div>

    </div>
  );
};

export default AnalyticsComponent;