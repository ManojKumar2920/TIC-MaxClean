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
import axios from "axios";
import Navbar from "@/components/MobileNavbar";

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
      csvHeaders.join(","), // Add header row
      ...csvRows.map((row) => row.join(",")), // Add data rows
    ].join("\n");

    // Create a Blob and trigger download
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
        const response = await axios.get("/api/user"); // The API route to get user details
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
        const response = await axios.get("/api/order"); // Fetch orders using Axios
        const data = response.data;
        setOrders(data.orders || []);

        // Helper function for calculating percentage changes
        const calculateChange = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        // Separate orders into current and previous periods
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

        // Metrics calculation for a period
        const calculateMetrics = (orders: Order[]) => {

          const totalRevenue = orders
            .filter((order) => order.paymentStatus === "Success")
            .reduce((sum, order) => {
              // Ensure order.price is a valid number
              const orderPrice = Number(order.price) || 0; 

              return sum + orderPrice; // Add valid price to the sum
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

        // Calculate percentage changes
        const revenueChange = calculateChange(currentRevenue, previousRevenue);
        const ordersChange = calculateChange(currentOrders, previousOrders);
        const completedChange = calculateChange(
          currentCompleted,
          previousCompleted
        );

        // Update metrics state
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
        toast.error(`Error fetching orders: ${error}` );
      }
    };

    fetchOrders();
  }, []);


  const handleSignout = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Logging out...");
  
      // Clear tokens from cookies (via API)
      await fetch("/api/auth/signout", { method: "POST" });
  
      // Dismiss the loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");
  
      // Redirect to the login page
      router.push("/signin");
    } catch (err) {
      // Dismiss loading toast and show error message
      toast.dismiss();
      toast.error("Error logging out. Please try again.");
      console.error("Error logging out:", err);
    }
  };
  

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = userDetails.role === "admin" ? 5 : 10;

  // Sort orders by createdAt (most recent first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedOrders.length / pageSize);

  // Determine the orders to display for the current page
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers for navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle toggling modal visibility
  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex min-h-screen">

      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Sidebar */}
      <div className="w-64 bg-black fixed h-full  md:block hidden  text-white p-6">
        <div className="mb-8">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
        </div>
        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
          >
            <div className="w-5 h-5 rounded-full border-2 border-red-500" />
            <span>Dashboard</span>
          </Link>
          {/* <Link
            href="#"
            className="flex items-center space-x-2 text-gray-400 p-3"
          >
            <div className="w-5 h-5" />
            <span>Orders</span>
          </Link> */}
          <div className="   absolute bottom-0">
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

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 md:ml-64 mt-20 md:mt-0">
        {/* Header */}
        <div className=" p-4 ">
          <header className="bg-[#afafaf] rounded-[10px] p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-black">
              Welcome{" "}
              <span className=" text-[#E5240F]">{userDetails.name}</span>
            </h2>
            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="icon">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button> */}
              <div onClick={handleAvatarClick} className="cursor-pointer">
                <img
                  src="https://avatar.iran.liara.run/public/28"
                  width={40}
                  height={40}
                  alt=""
                />
              </div>
            </div>
          </header>
        </div>

        {isModalOpen && (
          <div
            className="fixed right-10 top-20 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
          >
            <div
              className="bg-white p-3 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* <Link href={'/'} className="text-xl font-semibold text-center mb-4">Home</Link> */}
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

        {/* Dashboard Content */}
        <main className="p-6 shadow-2xl space-y-6">


          {/* Report Table */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Report</h3>
              <div className="flex items-center space-x-2">
                {/* <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button> */}
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  Export
                </Button>
              </div>
            </div>
            <div>
              <Table className="shadow-xl">
                {/* Table Header */}
                <TableHeader className="rounded-md text-[20px] bg-[#EEEBEC] px-4 !py-10 !text-black">
                  <TableRow className="rounded-lg">
                    <TableHead className="p-4">Orders</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Ordered by</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="text-[16px] bg-[#F6F6FA] p-3">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="p-4">{order.service}</TableCell>
                        <TableCell>${order.price}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-2 rounded-[6px] text-sm ${
                              order.paymentStatus === "Pending"
                                ? "bg-[#FFBA3A] text-black"
                                : order.paymentStatus === "Success"
                                ? "bg-[#10D899] text-black"
                                : "bg-[#E5240F] text-black"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? " text-gray-500"
                      : "text-[#E5240F] font-semibold"
                  }`}
                >
                  &lt; Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? " text-gray-500"
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
