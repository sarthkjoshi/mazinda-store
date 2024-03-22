"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const StoreDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/fetch-store`);

        if (data.success) {
          const approvalStatus = data.store.approvedStatus;

          if (approvalStatus === "approved") {
            router.push(`/my-store`);
          } else if (approvalStatus === "pending") {
            console.log(
              "Your request for store approval is currently pending. You will be notified once it is approved."
            );
          } else if (approvalStatus === "rejected") {
            console.error(
              "Unfortunately, your store request has been rejected. You can reach out at contact@mazinda.com for more information."
            );
          }
        } else {
          console.error("Error fetching store data");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, [router]);

  return null; // This component doesn't render anything
};

export default StoreDashboard;
