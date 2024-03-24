import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCurrentOrders } from "@/utils/fetch";

const CurrentOrders = async () => {
  const currentOrders = await fetchCurrentOrders();

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Current Orders</h1>
      <Table>
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
                    <span key={item._id} className="text-sm block">
                      {item.quantity}
                    </span>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CurrentOrders;
