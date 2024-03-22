import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import CurrentOrders from "@/components/CurrentOrders";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    const approvalStatus = session.user.approvedStatus;

    if (approvalStatus === "approved") {
      return (
        <div>
          <CurrentOrders />
        </div>
      );
    } else if (approvalStatus === "pending") {
      return <div>Pending</div>;
    } else if (approvalStatus === "rejected") {
      return <div>rejected</div>;
    }
  } else {
    return <div>Error fetching store</div>;
  }
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await axios.get(`/api/fetch-store`);

  //       if (data.success) {
  //         const approvalStatus = data.store.approvedStatus;

  //         if (approvalStatus === "approved") {
  //           router.push(`/my-store`);
  //         } else if (approvalStatus === "pending") {
  //           console.log(
  //             "Your request for store approval is currently pending. You will be notified once it is approved."
  //           );
  //         } else if (approvalStatus === "rejected") {
  //           console.error(
  //             "Unfortunately, your store request has been rejected. You can reach out at contact@mazinda.com for more information."
  //           );
  //         }
  //       } else {
  //         console.error("Error fetching store data");
  //       }
  //     } catch (error) {
  //       console.error("Error: ", error);
  //     }
  //   };

  //   fetchData();
  // }, [router]);
};

export default Dashboard;
