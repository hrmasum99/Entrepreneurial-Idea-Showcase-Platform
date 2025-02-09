"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IFormInput {
  email: string;
  password: string;
  role: string; // Supports roles like admin, judge, entrepreneur, etc.
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Handle form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email: data.email,
          password: data.password,
          role: data.role,
        },
        { withCredentials: true } // Important for secure cookies
      );

      if (response.status === 201 || response.status === 200) {
        const { access_token } = response.data;
        localStorage.setItem("token", access_token); // Store token locally

        // Navigate based on role
        if (data.role === "admin") {
          router.push("/admin");
        } else if (data.role === "judge") {
          router.push("/judge/dashboard");
        } else if (data.role === "entrepreneur") {
          router.push("/entrepreneur/dashboard");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage("Invalid credentials. Please try again.");
      } else {
        setErrorMessage("Unexpected error occurred. Please try later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {errorMessage && (
          <p className="mt-4 text-sm text-center text-red-500">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="judge">Judge</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
