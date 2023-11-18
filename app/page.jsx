"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const StoreDashboard = async () => {
  const router = useRouter();
  let store_token;

  try {
    store_token = Cookies.get("store_token");

    if (!store_token) {
      router.push("/auth/register");
      return null; // Return null to avoid rendering the rest of the component
    }
  } catch (e) {
    console.error(e);
    return null;
  }

  let approvalStatus;

  try {
    console.log(store_token);
    const response = await axios.post(`/api/fetch-store`, {
      store_token,
    });

    if (response.data.success) {
      approvalStatus = response.data.store.approvedStatus;
    } else {
      console.error("Error fetching approval status");
    }
  } catch (error) {
    console.error("Error fetching approval status: ", error);
  }

  if (approvalStatus === "approved") {
    router.push('/my-store');
    return null;
  }

  return (
    <div>
      {approvalStatus === "pending" ? (
        <div className="text-yellow-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-block mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8a4 4 0 11-8 0 4 4 0 018 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 21a9 9 0 01-9-9h2a7 7 0 007 7 7 7 0 007-7h2a9 9 0 01-9 9z"
            />
          </svg>
          Your request for store approval is currently pending. You will
          be notified once it is approved.
        </div>
      ) : approvalStatus === "rejected" ? (
        <div className="text-red-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-block mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Unfortunately, your store request has been rejected. You can
          reach out at contact@mazinda.com for more information.
        </div>
      ) : null}
    </div>
  );
};

export default StoreDashboard;