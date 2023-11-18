'use client'

import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import OvalLoader from "./utility/OvalLoader";
import Link from "next/link";

const CurrentOrders = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [currentOrders, setCurrentOrders] = useState([]);

  const fetchData = async () => {
    const storeToken = Cookies.get("store_token");
    const response = await axios.post("/api/order/fetch-store-orders", {
      storeToken,
    });
    setCurrentOrders(response.data.currentOrders);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 md:w-3/4 md:mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Current Orders
      </h1>
      {!pageLoading ? (
        <div className="rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
                <th className="py-2">Products</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                const orderDate = new Date(order.createdAt);
                const formattedDate = orderDate.toLocaleDateString();
                const formattedTime = orderDate.toLocaleTimeString();

                return (
                  <tr key={order._id}>
                    <td className="py-2 text-center px-1 text-[0.7em] md:text-sm">{formattedDate}</td>
                    <td className="py-2 text-center px-1 text-[0.7em] md:text-sm">{formattedTime}</td>
                    <td className="py-2 text-center">
                      {order.cart.map((item) => (
                        <Link
                          key={item.productID}
                          href={`https://www.mazinda.com/product/view-product?id=${item.productID}`}
                          target="_blank"
                          className="block"
                        >
                          {item.productName.slice(0, 18)} x{" "}
                          <span className="bg-gray-100 py-2 px-3 rounded-full text-sm">
                            {item.quantity}
                          </span>
                        </Link>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default CurrentOrders;
