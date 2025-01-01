"use client";
import { Bell, Filter, LogOut, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Navbar from "@/components/MobileNavbar";
import Skeleton from "@/components/Skeleton";

interface Order {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  service: string;
  price: number;
  address: string;
  landmark: string;
  pincode: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const location = usePathname();

  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    ordersCompleted: 0,
    change: {
      revenueChange: 0,
      ordersChange: 0,
      completedChange: 0,
    },
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("No data to export");
      return;
    }

    const csvHeaders = [
      "Order ID",
      "Name", 
      "Email",
      "Phone Number",
      "Payment Status",
      "Price",
      "Order Placed At",
    ];
    const csvRows = orders.map((order: any) => [
      order._id,
      order.name,
      order.email,
      order.phoneNumber,
      order.paymentStatus,
      order.price,
      order.createdAt,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.style.display = "none";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/user");
        const data = response.data;

        setUserDetails({
          name: `${data.user.firstName} ${data.user.lastName || ""}`,
          role: data.user.role,
        });
      } catch (error) {
        toast.error("Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order");
        const data = response.data;
        setOrders(data.orders || []);

        const calculateChange = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const isCurrentPeriod = (date: string | number | Date) =>
          new Date(date) >= oneMonthAgo;

        const currentPeriod = data.orders.filter((order: { createdAt: any }) =>
          isCurrentPeriod(order.createdAt)
        );
        const previousPeriod = data.orders.filter(
          (order: { createdAt: any }) => !isCurrentPeriod(order.createdAt)
        );

        const calculateMetrics = (orders: Order[]) => {
          const totalRevenue = orders
            .filter((order) => order.paymentStatus === "Success")
            .reduce((sum, order) => {
              const orderPrice = Number(order.price) || 0;
              return sum + orderPrice;
            }, 0);

          const revenue = totalRevenue;
          const totalOrders = orders.length;
          const completedOrders = orders.filter(
            (order) => order.paymentStatus === "Success"
          ).length;

          return { revenue, totalOrders, completedOrders };
        };

        const {
          revenue: currentRevenue,
          totalOrders: currentOrders,
          completedOrders: currentCompleted,
        } = calculateMetrics(currentPeriod);

        const {
          revenue: previousRevenue,
          totalOrders: previousOrders,
          completedOrders: previousCompleted,
        } = calculateMetrics(previousPeriod);

        const revenueChange = calculateChange(currentRevenue, previousRevenue);
        const ordersChange = calculateChange(currentOrders, previousOrders);
        const completedChange = calculateChange(
          currentCompleted,
          previousCompleted
        );

        setMetrics({
          totalRevenue: currentRevenue,
          totalOrders: currentOrders,
          ordersCompleted: currentCompleted,
          change: {
            revenueChange,
            ordersChange,
            completedChange,
          },
        });
      } catch (error) {
        toast.error(`Error fetching orders: ${error}`);
      }
    };

    fetchOrders();
  }, []);

  const handleSignout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...");
      await fetch("/api/auth/signout", { method: "POST" });
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");
      router.push("/signin");
    } catch (err) {
      toast.dismiss();
      toast.error("Error logging out. Please try again.");
      console.error("Error logging out:", err);
    }
  };

  const handleDownloadReceipt = async (orderId: string, paymentStatus: string) => {
    try {
      if (paymentStatus !== "Success") {
        toast.info("Receipt is only available for successful payments");
        return;
      }

      // Fetch the receipt from the correct API endpoint
      const response = await fetch(`/api/order/${orderId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the receipt");
      }

      // Get the receipt as a Blob
      const blob = await response.blob();

      // Create a URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up the URL
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = userDetails.role === "admin" ? 5 : 10;
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const totalPages = Math.ceil(sortedOrders.length / pageSize);
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <div className="w-[18%] bg-black fixed h-full md:block hidden text-white p-6">
        <div className="mb-8">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
        </div>
        <nav className="space-y-4">
          <Link
            href="/order-history"
            className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
          >
            <div className="w-5 h-5 rounded-full border-2 border-red-500" />
            <span>Order History</span>
          </Link>
          <div className="absolute bottom-0">
            <button
              onClick={handleSignout}
              className="flex items-center space-x-2 text-gray-400 p-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black text-white p-4 z-50">
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <h1 className="text-xl font-bold">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
          <button onClick={handleSignout} className="text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 md:ml-64 mt-20 md:mt-0">
        <div className="p-2 md:p-4">
          <header className="bg-[#afafaf] w-full rounded-[10px] p-3 md:p-4 flex justify-between items-center">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <h2 className="text-lg md:text-2xl font-semibold text-black">
                Welcome <span className="text-[#E5240F]">{userDetails.name}</span>
              </h2>
            )}
          </header>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {isModalOpen && (
          <div
            className="fixed right-4 md:right-10 top-20 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white p-3 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center">
                <button
                  onClick={handleSignout}
                  className="flex items-center space-x-2 text-gray-400 p-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-2 md:p-6 shadow-2xl space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg p-3 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold">Report</h3>
            </div>
            <div className="w-[70%] lg:w-full overflow-x-auto">
              <div className="min-w-full">
                <Table className="w-full shadow-xl">
                  <TableHeader className="rounded-md text-base md:text-[20px] bg-[#EEEBEC] px-2 md:px-4 !py-6 md:!py-10 !text-black">
                    <TableRow className="rounded-lg">
                      <TableHead className="p-2 md:p-4">Orders</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Ordered by</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="text-sm md:text-[16px] bg-[#F6F6FA] p-2 md:p-3">
                    {loading ? (
                      [...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className="p-2 md:p-4">
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-20 rounded-[6px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-20 rounded-[6px]" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="p-2 md:p-4 text-xs md:text-base whitespace-normal">{order.service}</TableCell>
                          <TableCell className="text-xs md:text-base">₹{order.price}</TableCell>
                          <TableCell className="text-xs md:text-base">{order.name}</TableCell>
                          <TableCell className="text-xs md:text-base">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 md:px-3 py-1 md:py-2 rounded-[6px] text-xs md:text-sm ${
                                order.paymentStatus === "Pending"
                                  ? "border-[#FFBA3A] border-2 text-black"
                                  : order.paymentStatus === "Success"
                                  ? "border-[#10D899] border-2 text-black"
                                  : "border-[#E5240F] border-2 text-black"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span
                              className={`px-2 md:px-3 py-1 md:py-2 rounded-[6px] text-xs md:text-sm ${
                                order.status === "Pending"
                                  ? "bg-[#FFBA3A] text-black"
                                  : order.status === "Completed"
                                  ? "bg-[#10D899] text-black"
                                  : order.status === "OnTheWay"
                                  ? " bg-[#aee4e3] text-black"
                                  : order.status === "Accepted"
                                  ? "bg-[#10D899] text-black"
                                  : "bg-[#E5240F] text-black"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs md:text-sm"
                              onClick={(e) => order.paymentStatus === "Success" ? handleDownloadReceipt(order._id, order.paymentStatus) : null}
                            >
                              {order.paymentStatus === "Success" ? "Download" : "Not Available"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-sm md:text-base ${
                    currentPage === 1
                      ? "text-gray-500"
                      : "text-[#E5240F] font-semibold"
                  }`}
                >
                  &lt; Previous
                </button>
                <span className="text-xs md:text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-sm md:text-base ${
                    currentPage === totalPages
                      ? "text-gray-500"
                      : "text-[#E5240F] font-semibold"
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
