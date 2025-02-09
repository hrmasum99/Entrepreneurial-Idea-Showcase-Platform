"use client";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation"; // Correct hooks
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/app/components/footer";
import AdminHeader from "../../../adminheader";

interface CoordinatorProfileData {
  name: string;
  email: string;
  event_coordinator_NID: string;
  event_coordinator_phone: string;
  event_coordinator_gender: string;
  event_coordinator_address: string;
  event_coordinator_DOB: string;
}

export default function UpdateCoordinator() {
  const { id } = useParams(); // Get coordinator ID from URL
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<CoordinatorProfileData>();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCoordinator = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/admin/coordinator/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const {
          name,
          email,
          event_coordinatorProfile: {
            event_coordinator_NID,
            event_coordinator_phone,
            event_coordinator_gender,
            event_coordinator_address,
            event_coordinator_DOB,
          },
        } = response.data[0];

        reset({
          name,
          email,
          event_coordinator_NID,
          event_coordinator_phone,
          event_coordinator_gender,
          event_coordinator_address,
          event_coordinator_DOB: new Date(event_coordinator_DOB)
            .toISOString()
            .split("T")[0],
        });
      } catch (error) {
        setErrorMessage("Failed to load coordinator data.");
      }
    };

    fetchCoordinator();
  }, [id, reset]);

  const onSubmit = async (data: CoordinatorProfileData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/admin/update-coordinator/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Coordinator updated successfully!");
        setTimeout(() => router.push(`/admin/event-coordinator/details/${id}`), 1000); // Redirect after success
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update coordinator."
      );
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden flex-none lg:block">
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <details>
                <summary>Manage Event-Coordinators</summary>
                <ul>
                  <li>
                    <a href="/admin/event-coordinator/add">Add Coordinator</a>
                  </li>
                  <li>
                    <a href="/admin/event-coordinator/all">
                      Coordinator List
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Update Coordinator
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md space-y-4"
          >
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NID:
              </label>
              <input
                {...register("event_coordinator_NID", {
                  required: "NID is required",
                })}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone:
              </label>
              <input
                {...register("event_coordinator_phone", {
                  required: "Phone is required",
                })}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender:
              </label>
              <select
                {...register("event_coordinator_gender", {
                  required: "Gender is required",
                })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address:
              </label>
              <input
                {...register("event_coordinator_address", {
                  required: "Address is required",
                })}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth:
              </label>
              <input
                {...register("event_coordinator_DOB", {
                  required: "Date of Birth is required",
                })}
                type="date"
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
