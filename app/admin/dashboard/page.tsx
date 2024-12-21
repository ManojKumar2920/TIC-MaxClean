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
import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

import GaugeChart from "react-gauge-chart";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ToolTip,
  Legend,
  Title,
} from "chart.js";

import { Pie } from "react-chartjs-2";
import { loadRazorpay } from "@/lib/razorpay";

ChartJS.register(ArcElement, ToolTip, Legend, Title);

interface Order {
  status: string;
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  const [uniqueOrderCount, setUniqueOrderCount] = useState(0);
  const [uniqueTimeRange, setUniqueTimeRange] = useState<
    "Today" | "Weekly" | "Monthly"
  >("Weekly");

  const [repeatedTimeRange, setRepeatedTimeRange] = useState<
    "Today" | "Weekly" | "Monthly"
  >("Weekly");

  const [repeatedOrderCount, setRepeatedOrderCount] = useState(0);

  const [userDetails, setUserDetails] = useState({
    name: "",
    role: "",
    email: "",
    phoneNumber: "",
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [userMessage, setUserMessage] = useState("");

  const handleStatusChange = (newStatus: string) => {
    if (!selectedOrderId) {
      toast.error("No order selected. Please try again.");
      return;
    }

    // Open modal for rejection message if status is "Rejected"
    if (newStatus === "Rejected") {
      setIsRejectModalOpen(true);
      return;
    }

    // Otherwise, update the status directly
    updateOrderStatus({ orderId: selectedOrderId, newStatus });
  };

  const handleRejection = async () => {
    if (!selectedOrderId) {
      toast.error("No order selected. Please try again.");
      return;
    }

    if (!userMessage.trim()) {
      toast.error("Rejection message is required.");
      return;
    }

    await updateOrderStatus({
      orderId: selectedOrderId,
      newStatus: "Rejected",
      message: userMessage.trim(),
    });

    setIsRejectModalOpen(false);
    setUserMessage(""); // Reset the input after submission
  };

  const updateOrderStatus = async (payload: object) => {
    try {
      const response = await fetch("/api/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order.");
      }

      // Refetch orders after successful update
      fetchOrders();
      toast.success("Order status updated successfully.");
      setIsOptionsModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("No data to export");
      return;
    }

    // Apply the filter to the orders based on the selected date filter
    const filteredOrders = filterOrdersByDate(orders, dateFilter);

    if (filteredOrders.length === 0) {
      alert("No data to export after applying the filter");
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

    const csvRows = filteredOrders.map((order: any) => [
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

  const [chartData, setChartData] = useState<
    { date: string; totalOrders: number }[]
  >([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Format date for x-axis
  const formatXAxis = (dateStr: string | number | Date): string => {
    const date = new Date(dateStr);
    return `${date.getDate()}`; // Ensure the return value is a string
  };

  // Format date for tooltip
  const formatTooltipDate = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const [dateFilter, setDateFilter] = useState<string>("all");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // Handle date filter change
  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
  };

  // Helper function to filter orders based on date
  const filterOrdersByDate = (orders: Order[], filter: string) => {
    const now = new Date();

    switch (filter) {
      case "today":
        return orders.filter(
          (order) =>
            new Date(order.createdAt).toDateString() === now.toDateString()
        );
      case "last7days":
        const last7Days = new Date(now);
        last7Days.setDate(now.getDate() - 7);
        return orders.filter((order) => new Date(order.createdAt) >= last7Days);
      case "last30days":
        const last30Days = new Date(now);
        last30Days.setDate(now.getDate() - 30);
        return orders.filter(
          (order) => new Date(order.createdAt) >= last30Days
        );
      case "all":
      default:
        return orders;
    }
  };

  // Re-filter orders whenever `dateFilter` changes
  useEffect(() => {
    const filtered = filterOrdersByDate(orders, dateFilter);
    setFilteredOrders(filtered);
  }, [dateFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/order");
      const data = response.data;
      setOrders(data.orders || []);

      // Helper function for calculating percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      // Rest of your existing metrics calculation logic...
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

        const totalOrders = orders.length;
        const completedOrders = orders.filter(
          (order) => order.status === "Completed"
        ).length;

        return { revenue: totalRevenue, totalOrders, completedOrders };
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

      // Update chart data
      const ordersByDate = data.orders.reduce(
        (acc: Record<string, number>, order: Order) => {
          const date = new Date(order.createdAt).toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        },
        {}
      );

      const formattedData = Object.keys(ordersByDate).map((date) => ({
        date,
        totalOrders: ordersByDate[date],
      }));

      setChartData(formattedData);

      const filteredOrders = filterOrdersByDate(data.orders, dateFilter);
      setFilteredOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    return;
  }, []);

  useEffect(() => {
    // Filter orders based on the selected time range
    const now = new Date();
    let filteredOrders: Order[] = [];

    if (uniqueTimeRange === "Today") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (uniqueTimeRange === "Weekly") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo && orderDate <= now;
      });
    } else if (uniqueTimeRange === "Monthly") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === now.getFullYear() &&
          orderDate.getMonth() === now.getMonth()
        );
      });
    }

    // Calculate unique orders based on userId
    const uniqueUserIds = new Set(filteredOrders.map((order) => order.userId));
    setUniqueOrderCount(uniqueUserIds.size);
  }, [uniqueTimeRange, orders]);

  useEffect(() => {
    // Filter orders based on the selected time range
    const now = new Date();
    let filteredOrders: Order[] = [];

    if (repeatedTimeRange === "Today") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (repeatedTimeRange === "Weekly") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo && orderDate <= now;
      });
    } else if (repeatedTimeRange === "Monthly") {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === now.getFullYear() &&
          orderDate.getMonth() === now.getMonth()
        );
      });
    }

    // Count repeated orders
    const userOrderCounts: { [key: string]: number } = {};
    filteredOrders.forEach((order) => {
      userOrderCounts[order.userId] = (userOrderCounts[order.userId] || 0) + 1;
    });

    // Find repeated orders (users with more than one order)
    const repeatedUsers = Object.values(userOrderCounts).filter(
      (count) => count > 1
    );
    setRepeatedOrderCount(
      repeatedUsers.reduce((sum, count) => sum + count - 1, 0)
    ); // Subtract 1 to count extra orders as repeated
  }, [repeatedTimeRange, orders]);

  const handleSignout = async () => {
    try {
      // Clear tokens from cookies (via API)
      await fetch("/api/auth/signout", { method: "POST" });

      // Redirect to the login page
      router.push("/signin");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = userDetails.role === "admin" ? 5 : 10;

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const currentOrders = filteredOrders.slice(
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

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOptionsModalOpen(false);
      }
    };

    if (isOptionsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsModalOpen]);

  const servicePrices: { [key: string]: string } = {
    "Car foam wash": "649",
    "Bike foam wash": "449",
    "Car + Bike combo": "899",
    "Bi Weekly": "1099",
    Weekly: "2099",
    "Battery jump start": "349",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setPrice(servicePrices[service] || ""); // Set price based on the selected service
  };

  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSlotChange = (e: any) => {
    setSelectedSlot(e.target.value);
    const [date, slot] = e.target.value.split("|");
    setSelectedDate(date);
    console.log("Selected Date:", date);
    console.log("Selected Slot:", slot);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  const [slotsError, setSlotsError] = useState("");

  const [availableSlots, setAvailableSlots] = useState<{
    [date: string]: string[];
  }>({});

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch("/api/available-slots");
        const data = await response.json();

        // Check if slots are actually available
        const hasAvailableSlots = Object.values(
          data as Record<string, string[]>
        ).some((slots) => slots.length > 0);

        if (!hasAvailableSlots) {
          setSlotsError(
            "No available slots at the moment. Please try another date."
          );
        }

        setAvailableSlots(data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setSlotsError(
          "Unable to fetch available slots. Please try again later."
        );
        toast.error("Error fetching available slots.");
      }
    };

    fetchAvailableSlots();
  }, []);

  const [error, setError] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user"); // The API route to get user details
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails({
          name: data.user.firstName + " " + (data.user.lastName || ""),
          email: data.user.email,
          phoneNumber: data.user.phoneNumber || "",
          role: data.user.role || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // if (!availableSlots || Object.keys(availableSlots).length === 0) {
  //   return <div></div>;
  // }

  // const initiatePayment = async (orderData: any) => {
  //   try {
  //     const response = await fetch("/api/payment/create-order", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         service: orderData.service,
  //         timeSlot: orderData.timeSlot,
  //       }),
  //     });

  //     const orderResult = await response.json();

  //     if (!response.ok) {
  //       throw new Error(orderResult.message || "Failed to create order");
  //     }

  //     console.log("Order result:", orderResult); // Debugging log

  //     const { _id, orderId, key } = orderResult; // Extract MongoDB `_id` and Razorpay orderId

  //     const razorpay = await loadRazorpay();

  //     const options = {
  //       key,
  //       amount: parseInt(price) * 100,
  //       currency: "INR",
  //       name: "MaxClean",
  //       description: `${selectedService} Service`,
  //       order_id: orderId,
  //       handler: async function (response: any) {
  //         const verifyResponse = await fetch("/api/payment/verify-order", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             timeSlot: selectedSlot,
  //           }),
  //         });

  //         const verifyResult = await verifyResponse.json();

  //         if (verifyResponse.ok) {
  //           toast.success("Payment successful!");
  //           resetForm();
  //         } else {
  //           toast.error(verifyResult.message || "Payment verification failed");
  //         }
  //       },
  //       prefill: {
  //         name: userDetails.name,
  //         email: userDetails.email,
  //         contact: userDetails.phoneNumber,
  //       },
  //       theme: {
  //         color: "#D70006",
  //       },
  //       modal: {
  //         ondismiss: async () => {
  //           try {
  //             // Call the API to update the payment status to 'cancelled'
  //             const response = await fetch("/api/payment/cancel-order", {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 timeSlot: orderData.timeSlot, // Send the timeSlot correctly
  //                 date: orderData.date, // Send the date correctly
  //               }),
  //             });

  //             console.log(orderData.timeSlot);

  //             const data = await response.json();

  //             if (response.ok) {
  //               console.log("Payment status updated to cancelled.");
  //               toast.info("Payment was cancelled.");
  //               resetForm();
  //             } else {
  //               toast.error("Failed to update payment status.");
  //             }
  //           } catch (error) {
  //             console.error("Error updating payment status:", error);
  //             toast.error("Error updating payment status.");
  //           }
  //         },
  //       },
  //     };

  //     const paymentObject = new razorpay(options);
  //     paymentObject.open();
  //   } catch (error) {
  //     console.error("Payment initiation error:", error);
  //     setError(
  //       error instanceof Error ? error.message : "Payment initiation failed"
  //     );
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = [];
    if (!userDetails.name.trim()) validationErrors.push("Name is required");
    if (!selectedService)
      validationErrors.push("Service selection is required");
    if (!selectedSlot) validationErrors.push("Time slot is required");
    if (!address.trim()) validationErrors.push("Address is required");
    if (!pincode.trim()) validationErrors.push("Pincode is required");

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    try {
      const orderData = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        service: selectedService,
        price,
        address: address.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim(),
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: notes.trim(),
        paymentStatus: "Success",
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order Added successfully!");
        setIsFormModalOpen(false);
      } else {
        toast.error(data.message || "Order submission failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Optional reset form function
  const resetForm = () => {
    setSelectedService("");
    setPrice("");
    setSelectedSlot("");
    setSelectedDate("");
    setAddress("");
    setLandmark("");
    setPincode("");
    setNotes("");
  };

  const handleAddOrders = () => {
    setIsFormModalOpen(true);
  };

  return (
    <div className="flex min-h-screen">
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
      <div className="flex-1 bg-gray-100 md:ml-64">
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
              </Button> */}
              <Button
                variant="ghost"
                onClick={handleAddOrders}
                className="bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
              >
                Add Order
              </Button>
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
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          {/* Stats Cards */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className=" w-full bg-white relative ">
              <CardHeader className="flex flex-row w-full items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-medium">
                    Total revenue
                  </CardTitle>
                  <p className="text-[15px] mt-1 text-muted-foreground">
                    {metrics.change.revenueChange.toFixed(2)}% of period of
                    change
                  </p>
                </div>
                <div className="  absolute bottom-5 right-6  ">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="56" height="56" rx="28" fill="#20B284" />
                    <path
                      d="M35.653 42.3333H20.3463C17.0263 42.3333 14.333 39.6399 14.333 36.3199V27.3466C14.333 24.0266 17.0263 21.3333 20.3463 21.3333H35.653C38.973 21.3333 41.6663 24.0266 41.6663 27.3466V29.2666C41.6663 29.8133 41.213 30.2666 40.6663 30.2666H37.973C37.5063 30.2666 37.0797 30.4399 36.773 30.7599L36.7597 30.7733C36.3863 31.1333 36.213 31.6266 36.253 32.1332C36.333 33.0132 37.173 33.7199 38.133 33.7199H40.6663C41.213 33.7199 41.6663 34.1732 41.6663 34.7199V36.3066C41.6663 39.6399 38.973 42.3333 35.653 42.3333ZM20.3463 23.3333C18.133 23.3333 16.333 25.1333 16.333 27.3466V36.3199C16.333 38.5332 18.133 40.3333 20.3463 40.3333H35.653C37.8663 40.3333 39.6663 38.5332 39.6663 36.3199V35.7332H38.133C36.1197 35.7332 34.413 34.2399 34.253 32.3199C34.1463 31.2266 34.5463 30.1466 35.3463 29.3599C36.0397 28.6533 36.973 28.2666 37.973 28.2666H39.6663V27.3466C39.6663 25.1333 37.8663 23.3333 35.653 23.3333H20.3463Z"
                      fill="white"
                    />
                    <path
                      d="M15.333 29.5468C14.7863 29.5468 14.333 29.0934 14.333 28.5468V22.4535C14.333 20.4668 15.5863 18.6668 17.4397 17.9601L28.0263 13.9601C29.1197 13.5468 30.333 13.6935 31.2797 14.3602C32.2397 15.0268 32.7997 16.1068 32.7997 17.2668V22.3335C32.7997 22.8801 32.3463 23.3335 31.7997 23.3335C31.253 23.3335 30.7997 22.8801 30.7997 22.3335V17.2668C30.7997 16.7601 30.5597 16.2935 30.133 16.0001C29.7063 15.7068 29.1997 15.6401 28.7197 15.8268L18.133 19.8268C17.053 20.2401 16.3197 21.2935 16.3197 22.4535V28.5468C16.333 29.1068 15.8797 29.5468 15.333 29.5468Z"
                      fill="white"
                    />
                    <path
                      d="M38.1343 35.7332C36.1209 35.7332 34.4143 34.2399 34.2543 32.3199C34.1476 31.2132 34.5476 30.1333 35.3476 29.3466C36.0276 28.6533 36.9609 28.2666 37.9609 28.2666H40.7343C42.0543 28.3066 43.0676 29.3465 43.0676 30.6265V33.3733C43.0676 34.6533 42.0543 35.6932 40.7743 35.7332H38.1343ZM40.7076 30.2666H37.9743C37.5076 30.2666 37.0809 30.4399 36.7743 30.7599C36.3876 31.1333 36.2009 31.6399 36.2543 32.1466C36.3343 33.0266 37.1743 33.7332 38.1343 33.7332H40.7476C40.9209 33.7332 41.0809 33.5733 41.0809 33.3733V30.6265C41.0809 30.4265 40.9209 30.2799 40.7076 30.2666Z"
                      fill="white"
                    />
                    <path
                      d="M30.6663 29H21.333C20.7863 29 20.333 28.5467 20.333 28C20.333 27.4533 20.7863 27 21.333 27H30.6663C31.213 27 31.6663 27.4533 31.6663 28C31.6663 28.5467 31.213 29 30.6663 29Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl   font-bold">
                  ₹{metrics.totalRevenue}
                </div>
              </CardContent>
            </Card>

            <Card className=" w-full relative bg-white ">
              <CardHeader className="flex flex-row w-full items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-medium">
                    Total orders
                  </CardTitle>
                  <p className="text-[15px] mt-1 text-muted-foreground">
                    {metrics.change.ordersChange.toFixed(2)}% of period of
                    change
                  </p>
                </div>
                <div className="  absolute bottom-5 right-6  ">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="56" height="56" rx="28" fill="#0077FF" />
                    <path
                      d="M29.3337 31.6667H14.667C14.1203 31.6667 13.667 31.2134 13.667 30.6667V20.0001C13.667 16.5067 16.507 13.6667 20.0003 13.6667H32.0003C32.547 13.6667 33.0003 14.1201 33.0003 14.6667V28.0001C33.0003 30.0267 31.3603 31.6667 29.3337 31.6667ZM15.667 29.6667H29.3337C30.2537 29.6667 31.0003 28.9201 31.0003 28.0001V15.6667H20.0003C17.6137 15.6667 15.667 17.6134 15.667 20.0001V29.6667Z"
                      fill="#FCFCFC"
                    />
                    <path
                      d="M37.3337 39.6667H36.0003C35.4537 39.6667 35.0003 39.2134 35.0003 38.6667C35.0003 37.7467 34.2537 37.0001 33.3337 37.0001C32.4137 37.0001 31.667 37.7467 31.667 38.6667C31.667 39.2134 31.2137 39.6667 30.667 39.6667H25.3337C24.787 39.6667 24.3337 39.2134 24.3337 38.6667C24.3337 37.7467 23.587 37.0001 22.667 37.0001C21.747 37.0001 21.0003 37.7467 21.0003 38.6667C21.0003 39.2134 20.547 39.6667 20.0003 39.6667H18.667C15.907 39.6667 13.667 37.4267 13.667 34.6667V30.6667C13.667 30.1201 14.1203 29.6667 14.667 29.6667H29.3337C30.2537 29.6667 31.0003 28.9201 31.0003 28.0001V18.6667C31.0003 18.1201 31.4537 17.6667 32.0003 17.6667H34.4537C35.7737 17.6667 36.987 18.3734 37.6403 19.5201L39.9203 23.5068C40.0937 23.8134 40.0937 24.2001 39.9203 24.5068C39.747 24.8134 39.4137 25.0001 39.0537 25.0001H37.3337C37.147 25.0001 37.0003 25.1467 37.0003 25.3334V29.3334C37.0003 29.5201 37.147 29.6667 37.3337 29.6667H41.3337C41.8803 29.6667 42.3337 30.1201 42.3337 30.6667V34.6667C42.3337 37.4267 40.0937 39.6667 37.3337 39.6667ZM36.867 37.6667H37.3337C38.987 37.6667 40.3337 36.3201 40.3337 34.6667V31.6667H37.3337C36.0537 31.6667 35.0003 30.6134 35.0003 29.3334V25.3334C35.0003 24.0534 36.0403 23.0001 37.3337 23.0001L35.907 20.5068C35.6136 19.9868 35.0537 19.6667 34.4537 19.6667H33.0003V28.0001C33.0003 30.0267 31.3603 31.6667 29.3337 31.6667H15.667V34.6667C15.667 36.3201 17.0137 37.6667 18.667 37.6667H19.1337C19.5737 36.1334 20.987 35.0001 22.667 35.0001C24.347 35.0001 25.7603 36.1334 26.2003 37.6667H29.8136C30.2536 36.1334 31.667 35.0001 33.347 35.0001C35.027 35.0001 36.427 36.1334 36.867 37.6667Z"
                      fill="#FCFCFC"
                    />
                    <path
                      d="M22.6667 42.3333C20.64 42.3333 19 40.6933 19 38.6667C19 36.64 20.64 35 22.6667 35C24.6933 35 26.3333 36.64 26.3333 38.6667C26.3333 40.6933 24.6933 42.3333 22.6667 42.3333ZM22.6667 37C21.7467 37 21 37.7467 21 38.6667C21 39.5867 21.7467 40.3333 22.6667 40.3333C23.5867 40.3333 24.3333 39.5867 24.3333 38.6667C24.3333 37.7467 23.5867 37 22.6667 37Z"
                      fill="#FCFCFC"
                    />
                    <path
                      d="M33.3327 42.3333C31.306 42.3333 29.666 40.6933 29.666 38.6667C29.666 36.64 31.306 35 33.3327 35C35.3593 35 36.9993 36.64 36.9993 38.6667C36.9993 40.6933 35.3593 42.3333 33.3327 42.3333ZM33.3327 37C32.4127 37 31.666 37.7467 31.666 38.6667C31.666 39.5867 32.4127 40.3333 33.3327 40.3333C34.2527 40.3333 34.9993 39.5867 34.9993 38.6667C34.9993 37.7467 34.2527 37 33.3327 37Z"
                      fill="#FCFCFC"
                    />
                    <path
                      d="M41.3333 31.6667H37.3333C36.0533 31.6667 35 30.6133 35 29.3333V25.3333C35 24.0533 36.0533 23 37.3333 23H39.0533C39.4133 23 39.7467 23.1867 39.92 23.5067L42.2 27.5067C42.28 27.6533 42.3333 27.8267 42.3333 28V30.6667C42.3333 31.2133 41.88 31.6667 41.3333 31.6667ZM37.3333 25C37.1467 25 37 25.1467 37 25.3333V29.3333C37 29.52 37.1467 29.6667 37.3333 29.6667H40.3333V28.2667L38.4667 25H37.3333Z"
                      fill="#FCFCFC"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl   font-bold">
                  {metrics.totalOrders}
                </div>
              </CardContent>
            </Card>

            <Card className=" w-full relative  bg-white">
              <CardHeader className="flex flex-row w-full items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-medium">
                    Order Completed
                  </CardTitle>
                  <p className="text-[15px] mt-1 text-muted-foreground">
                    {metrics.change.completedChange.toFixed(2)}% of period of
                    change
                  </p>
                </div>
                <div className="  absolute bottom-5 right-6  ">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="56" height="56" rx="28" fill="#FF0066" />
                    <path
                      d="M35.654 42.3333H20.3473C17.0273 42.3333 14.334 39.6399 14.334 36.3199V27.3466C14.334 24.0266 17.0273 21.3333 20.3473 21.3333H35.654C38.974 21.3333 41.6673 24.0266 41.6673 27.3466V29.2666C41.6673 29.8133 41.214 30.2666 40.6673 30.2666H37.974C37.5073 30.2666 37.0807 30.4399 36.774 30.7599L36.7607 30.7733C36.3873 31.1333 36.214 31.6266 36.254 32.1332C36.334 33.0132 37.174 33.7199 38.134 33.7199H40.6673C41.214 33.7199 41.6673 34.1732 41.6673 34.7199V36.3066C41.6673 39.6399 38.974 42.3333 35.654 42.3333ZM20.3473 23.3333C18.134 23.3333 16.334 25.1333 16.334 27.3466V36.3199C16.334 38.5332 18.134 40.3333 20.3473 40.3333H35.654C37.8673 40.3333 39.6673 38.5332 39.6673 36.3199V35.7332H38.134C36.1207 35.7332 34.414 34.2399 34.254 32.3199C34.1473 31.2266 34.5473 30.1466 35.3473 29.3599C36.0407 28.6533 36.974 28.2666 37.974 28.2666H39.6673V27.3466C39.6673 25.1333 37.8673 23.3333 35.654 23.3333H20.3473Z"
                      fill="white"
                    />
                    <path
                      d="M15.334 29.5468C14.7873 29.5468 14.334 29.0934 14.334 28.5468V22.4535C14.334 20.4668 15.5873 18.6668 17.4407 17.9601L28.0273 13.9601C29.1207 13.5468 30.334 13.6935 31.2807 14.3602C32.2407 15.0268 32.8007 16.1068 32.8007 17.2668V22.3335C32.8007 22.8801 32.3473 23.3335 31.8007 23.3335C31.254 23.3335 30.8007 22.8801 30.8007 22.3335V17.2668C30.8007 16.7601 30.5607 16.2935 30.134 16.0001C29.7073 15.7068 29.2007 15.6401 28.7207 15.8268L18.134 19.8268C17.054 20.2401 16.3207 21.2935 16.3207 22.4535V28.5468C16.334 29.1068 15.8807 29.5468 15.334 29.5468Z"
                      fill="white"
                    />
                    <path
                      d="M38.1333 35.7332C36.12 35.7332 34.4133 34.2399 34.2533 32.3199C34.1466 31.2132 34.5466 30.1333 35.3466 29.3466C36.0266 28.6533 36.96 28.2666 37.96 28.2666H40.7333C42.0533 28.3066 43.0666 29.3465 43.0666 30.6265V33.3733C43.0666 34.6533 42.0533 35.6932 40.7733 35.7332H38.1333ZM40.7066 30.2666H37.9733C37.5066 30.2666 37.08 30.4399 36.7733 30.7599C36.3866 31.1333 36.2 31.6399 36.2533 32.1466C36.3333 33.0266 37.1733 33.7332 38.1333 33.7332H40.7466C40.92 33.7332 41.08 33.5733 41.08 33.3733V30.6265C41.08 30.4265 40.92 30.2799 40.7066 30.2666Z"
                      fill="white"
                    />
                    <path
                      d="M30.6673 29H21.334C20.7873 29 20.334 28.5467 20.334 28C20.334 27.4533 20.7873 27 21.334 27H30.6673C31.214 27 31.6673 27.4533 31.6673 28C31.6673 28.5467 31.214 29 30.6673 29Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl   font-bold">
                  {metrics.ordersCompleted}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full relative bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="1"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#666" }}
                      tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [
                        `${value} Orders`,
                        "Orders",
                      ]}
                      labelFormatter={formatTooltipDate}
                    />
                    <Bar
                      dataKey="totalOrders"
                      radius={[4, 4, 0, 0]} // Apply rounded corners to the top of the bars
                      onMouseOver={(e, index) => setHoverIndex(index)}
                      onMouseOut={() => setHoverIndex(null)}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={hoverIndex === index ? "#0051EC" : "#E6EEF5"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className=" w-full relative  bg-white">
              <CardHeader className=" font-medium mb-4 flex justify-between items-center flex-row">
                <p className="text-xl">Total Unique Orders</p>
                <select
                  value={uniqueTimeRange}
                  onChange={(e) =>
                    setUniqueTimeRange(
                      e.target.value as "Today" | "Weekly" | "Monthly"
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Today">Today</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </CardHeader>
              <CardContent className=" flex flex-col items-end justify-center">
                <GaugeChart
                  id="gauge-chart"
                  nrOfLevels={25}
                  percent={uniqueOrderCount / 100}
                  textColor="#000"
                  colors={["#E6EEF5", "#0051EC"]}
                />
              </CardContent>
              <p className="text-center text-gray-500">
                {uniqueTimeRange} Unique Orders :{uniqueOrderCount}
              </p>
            </Card>

            <Card className=" w-full relative  bg-white">
              <CardHeader className=" font-medium mb-4 flex justify-between items-center flex-row">
                <p className="text-xl">Total Repeated Orders</p>
                <select
                  value={repeatedTimeRange}
                  onChange={(e) =>
                    setRepeatedTimeRange(
                      e.target.value as "Today" | "Weekly" | "Monthly"
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Today">Today</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </CardHeader>
              <CardContent className=" flex flex-col items-end justify-center">
                <Pie
                  data={{
                    labels: ["Repeated Orders", "Unique Orders"],
                    datasets: [
                      {
                        data: [
                          repeatedOrderCount,
                          orders.length - repeatedOrderCount,
                        ],
                        backgroundColor: ["#32CD32", "#E6EEF5"],
                        hoverBackgroundColor: ["#228B22", "#D1D9E6"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                  width={200}
                  height={200}
                />
              </CardContent>
              <p className="text-center text-gray-500">
                {repeatedOrderCount} Repeated Orders
              </p>
            </Card>
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Report</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  Export
                </Button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => handleDateFilterChange("today")}
                className={
                  dateFilter === "today"
                    ? "bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
                    : ""
                }
              >
                Today
              </Button>
              <Button
                onClick={() => handleDateFilterChange("last7days")}
                className={
                  dateFilter === "last7days"
                    ? "bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
                    : ""
                }
              >
                Last 7 Days
              </Button>
              <Button
                onClick={() => handleDateFilterChange("last30days")}
                className={
                  dateFilter === "last30days"
                    ? "bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
                    : ""
                }
              >
                Last 30 Days
              </Button>
              <Button
                onClick={() => handleDateFilterChange("all")}
                className={
                  dateFilter === "all"
                    ? "bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
                    : ""
                }
              >
                All Orders
              </Button>
            </div>

            <div>
              <Table className="shadow-xl">
                <TableHeader className="rounded-md text-[20px] bg-[#EEEBEC] px-4 !py-10 !text-black">
                  <TableRow className="rounded-lg">
                    <TableHead className="p-4">Orders</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Ordered by</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>

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
                            className={`px-3 py-2 rounded-[6px] text-sm ${
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
                            onClick={() => {
                              setIsOptionsModalOpen(true);
                              setSelectedOrderId(order._id);
                            }}
                          >
                            •••
                          </Button>
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

              {isOptionsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <Card
                    ref={modalRef}
                    className="bg-white rounded-lg shadow-lg p-6 w-[20%] absolute right-[10%]"
                  >
                    <div className=" flex justify-between items-center mb-5">
                      <h2 className="text-xl font-bold">Update Order Status</h2>
                      <button
                        className=" text-red-600 font-bold"
                        onClick={() => setIsOptionsModalOpen(false)}
                      >
                        X
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {["Accepted", "Rejected", "OnTheWay", "Completed"].map(
                        (status) => (
                          <button
                            key={status}
                            className=" bg-black text-white whitespace-nowrap rounded-[8px] px-5 py-2"
                            onClick={() => handleStatusChange(status)}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {isRejectModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                aria-hidden={!isRejectModalOpen}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-96"
                  role="dialog"
                  aria-labelledby="rejectModalTitle"
                  aria-describedby="rejectModalDescription"
                >
                  <h2
                    id="rejectModalTitle"
                    className="text-xl font-semibold mb-4 text-red-500"
                  >
                    Reject Order
                  </h2>
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Enter a reason for rejection..."
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                  />
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => {
                        setIsRejectModalOpen(false);
                        setUserMessage(""); // Reset the message when modal closes
                      }}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejection}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isFormModalOpen && (
              <div className=" fixed top-0 left-0 w-full">
                <div className=" absolute h-dvh bg-black  bg-opacity-50 w-full left-0 top-0 flex justify-center items-center z-50 overflow-auto">
                  <div ref={modalRef} className=" rounded-lg p-6 w-full mt-[20%]">
                    <div className="  w-full flex flex-col md:flex-row gap-6 justify-center">
                      <form
                        onSubmit={handleSubmit}
                        className=" bg-white p-5 rounded-xl flex flex-col items-center gap-4 w-full md:w-1/2"
                      >
                        <div className=" flex justify-between w-full items-center">
                          <h1 className=" !text-start font-bold text-xl">
                            Add Orders
                          </h1>
                          <Button
                            variant="ghost"
                            size="sm"
                            className=" font-bold text-xl text-red-500"
                            onClick={() => setIsFormModalOpen(false)}
                          >
                            X
                          </Button>
                        </div>
                        <div className="flex flex-col items-center md:flex-row gap-6 w-full">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
                            placeholder="Name*"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
                            placeholder="Email*"
                          />
                        </div>
                        <div className="flex flex-col items-center md:flex-row gap-6 w-full">
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
                            placeholder="Mobile Number*"
                          />
                          <select
                            value={selectedService}
                            onChange={(e) =>
                              handleServiceChange(e.target.value)
                            }
                            className="block outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
                          >
                            <option value="" disabled>
                              Select a Service*
                            </option>
                            {Object.keys(servicePrices).map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-center md:flex-row gap-6 w-full">
                          <input
                            type="text"
                            value={price}
                            readOnly
                            className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%] cursor-not-allowed"
                            placeholder="Price*"
                          />
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
                            placeholder="Pincode*"
                          />
                        </div>
                        <select
                          id="timeSlot"
                          className="block bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-full outline-gray-500 rounded-[8px]"
                          value={
                            selectedSlot
                              ? `${selectedDate}|${selectedSlot}`
                              : ""
                          }
                          onChange={(e) => {
                            if (e.target.value) {
                              const [date, slot] = e.target.value.split("|");
                              setSelectedDate(date);
                              setSelectedSlot(slot);
                            } else {
                              setSelectedDate("");
                              setSelectedSlot("");
                            }
                          }}
                        >
                          <option value="" disabled>
                            Choose a time slot
                          </option>
                          {Object.keys(availableSlots).length === 0 ? (
                            <option disabled>No slots available</option>
                          ) : (
                            Object.keys(availableSlots).map(
                              (date) =>
                                availableSlots[date].length > 0 && (
                                  <optgroup key={date} label={date}>
                                    {availableSlots[date].map((slot) => (
                                      <option
                                        key={`${date}|${slot}`}
                                        value={`${date}|${slot}`}
                                      >
                                        {slot}
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                            )
                          )}
                        </select>

                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
                          placeholder="Address*"
                        />
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
                          placeholder="Landmark*"
                        />
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="bg-[#F7F8FA] mt-2 w-[90%] md:w-full px-4 py-4 h-60 outline-gray-500 rounded-[8px]"
                          placeholder="Additional Notes (optional)"
                        ></textarea>

                        {error && <div className="text-red-500">{error}</div>}

                        <button
                          type="submit"
                          className="text-white text-xl w-[90%] md:w-full mt-2 bg-black whitespace-nowrap rounded-[8px] py-3"
                        >
                          Book Order
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
