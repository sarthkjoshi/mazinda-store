import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const fetchStoreSession = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return session;
};

export const fetchCurrentOrders = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  const { data } = await axios.post(
    `${process.env.BASE_URI}/api/order/fetch-store-orders`,
    {
      storeId: session.user.id,
    }
  );
  console.log(data);
  if (!data.success) {
    return null;
  }
  return data.currentOrders;
};
