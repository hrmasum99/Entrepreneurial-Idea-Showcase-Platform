"use client";

import Footer from "@/app/components/footer";
import AdminHeader from "../../adminheader";
import { useParams } from "next/navigation"; // Use useParams instead
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDetails() {
  const { id } = useParams(); // Corrected hook for accessing route params
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        if (!id) return; // Ensure id is available

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/admin/getprofile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdminDetails(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch admin details."
        );
      }
    };

    fetchAdminDetails();
  }, [id]); // `id` is now directly available

  return (
    <div>
      <AdminHeader />
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <div className="hidden flex-none lg:block">
            <ul className="menu bg-base-200 min-h-full w-60 p-4">
              <li>
                <a>Homepage</a>
              </li>
              <li>
                <details>
                  <summary>Manage Admins</summary>
                  <ul>
                    <li>
                      <a href="/admin/addadmin">Add Admin</a>
                    </li>
                    <li>
                      <a href="/admin/alladmin">Admin List</a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details> {/*<details open>*/}
                  <summary>Manage Event-Coordinators</summary>
                  <ul>
                  <li>
                      <a
                        href="../event-coordinator/add"
                      >
                        Add Event-Coordinator
                      </a>
                    </li>
                    <li>
                      <a
                        href="../event-coordinator/all"
                      >
                        Event-Coordinator List
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

          <div className="flex-1 bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Details</h2>
            {error && <p className="text-red-500">{error}</p>}

            {adminDetails ? (
              <div className="bg-white shadow-md rounded-lg p-6 text-black">
                <div className="flex justify-center mb-6">
                  <img
                    src={
                      adminDetails.adminProfile.admin_filename !== "N/A"
                        ? `http://localhost:3000/admin/get-image/${adminDetails.adminProfile.admin_filename}`
                        : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="Admin Profile"
                    className="w-40 h-40 rounded-full border-4 border-gray-200 shadow-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Admin ID:</strong> {adminDetails.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {adminDetails.adminProfile.admin_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {adminDetails.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {adminDetails.adminProfile.admin_phone}
                  </p>
                  <p>
                    <strong>Gender:</strong> {adminDetails.adminProfile.admin_gender}
                  </p>
                  <p>
                    <strong>NID:</strong> {adminDetails.adminProfile.admin_NID}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(adminDetails.adminProfile.admin_DOB).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Address:</strong> {adminDetails.adminProfile.admin_address}
                  </p>
                  <p>
                    <strong>Profile Created On:</strong>{" "}
                    {new Date(adminDetails.adminProfile.creationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
