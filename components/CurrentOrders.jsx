"use client";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import OvalLoader from "./utility/OvalLoader";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CurrentOrders = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [currentOrders, setCurrentOrders] = useState([]);

  const fetchData = async () => {
    const storeToken = Cookies.get("store_token");
    const { data } = await axios.post("/api/order/fetch-store-orders", {
      storeToken,
    });
    setCurrentOrders(data.currentOrders.reverse());
    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 md:w-1/2 md:mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Current Orders
      </h1>
      {!pageLoading ? (
        <Table>
          <TableCaption>A list of your current orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => {
              const orderDate = new Date(order.createdAt);
              const formattedDate = orderDate.toLocaleDateString();
              const formattedTime = orderDate.toLocaleTimeString();
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <span className="text-sm">{formattedTime}</span>
                    <br />
                    <span className="text-[10px]">{formattedDate}</span>
                  </TableCell>
                  <TableCell>
                    {order.cart.map((item) => (
                      <Link
                        key={item._id}
                        href={`https://www.mazinda.com/product/view-product?id=${item._id}`}
                        target="_blank"
                        className="block"
                      >
                        {item.productName.slice(0, 18)}
                      </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.cart.map((item) => (
                      <span className="text-sm block">{item.quantity}</span>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default CurrentOrders;
