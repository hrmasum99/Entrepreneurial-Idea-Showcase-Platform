"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/footer";
import AdminHeader from "../../adminheader";
import { jwtDecode } from "jwt-decode";

interface IEventCoordinatorInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}  

export default function CreateEventCoordinator() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IEventCoordinatorInput>();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const router = useRouter();

  // Fetch token and decode admin ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      const decoded: any = jwtDecode(token);
      if (decoded?.sub) {
        setAdminId(decoded.sub); // Admin ID from the token
      } else {
        setMessage("Invalid token. Please log in again.");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const onSubmit: SubmitHandler<IEventCoordinatorInput> = async (data) => {
    if (!authToken || !adminId) {
      setMessage("You need to be logged in to create an Event Coordinator.");
      return;
    }
  
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/admin/addeventcoordinator/${adminId}`,
        { name: data.name, email: data.email, password: data.password },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      if (response.status === 201) {
        setMessage("Event Coordinator created successfully!");
        router.push("/admin");
      }
    } catch (error) {
      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Error creating Event Coordinator"
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <div className="hidden flex-none lg:block">
            <ul className="menu bg-base-200 min-h-full w-60 p-4">
              <li><a>Homepage</a></li>
              <li>
                <details>
                  <summary>Manage Admins</summary>
                  <ul>
                    <li><a href="/admin/addadmin">Add Admin</a></li>
                    <li><a href="/admin/alladmin">Admin List</a></li>
                  </ul>
                </details>
              </li>
              <li>
                <details> {/*<details open>*/}
                  <summary>Manage Event-Coordinators</summary>
                  <ul>
                    <li><a href="add">Add Event-Coordinator</a></li>
                    <li><a href="all">Event-Coordinator List</a></li>
                  </ul>
                </details>
              </li>
              <li><a>About</a></li>
            </ul>
          </div>

          <main className="flex-grow p-6">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create Event Coordinator</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", {
                    required: "Name is required",
                    maxLength: {
                      value: 50,
                      message: "Name must be less than 50 characters",
                      },
                    })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password:
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                      })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password:
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch("password") || "Passwords do not match",
                      })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? "Creating..." : "Create Event Coordinator"}
                  </button>
                </div>
              </form>

              {/* Message */}
              {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
