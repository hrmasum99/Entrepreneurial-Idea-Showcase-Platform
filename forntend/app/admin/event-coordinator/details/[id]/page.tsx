"use client";

import Footer from "@/app/components/footer";
import { useParams } from "next/navigation"; // Correct hook
import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "@/app/admin/adminheader";
import { useRouter } from 'next/navigation';

export default function CoordinatorDetails() {
  const router = useRouter(); // Initialize router
  const { id } = useParams(); // Fetch coordinatorId from the URL
  const [coordinatorDetails, setCoordinatorDetails] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoordinatorDetails = async () => {
      try {
        if (!id) return; // Ensure id is available

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/admin/coordinator/${id}`, // Coordinator API endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCoordinatorDetails(response.data[0]); // Access the first object if data is an array
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch coordinator details."
        );
      }
    };

    fetchCoordinatorDetails();
  }, [id]);

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
                <details>
                  <summary>Manage Event-Coordinators</summary>
                  <ul>
                    <li>
                      <a href="../add">Add Event-Coordinator</a>
                    </li>
                    <li>
                      <a href="../all">Event-Coordinator List</a>
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Coordinator Details</h2>
            {error && <p className="text-red-500">{error}</p>}

            {coordinatorDetails ? (
              <div className="bg-white shadow-md rounded-lg p-6 text-black">
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={() => router.push(`../update/${id}`)}>
                  Edit</button>
                </div>
                {/* <div className="flex justify-end mt-6">
                  <a
                    href={`/admin/coordinator/edit/${coordinatorDetails.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Edit
                  </a>
                </div> */}
                <div className="flex justify-center mb-6">
                  <img
                    src={
                      coordinatorDetails.event_coordinatorProfile.event_coordinator_file !==
                      "N/A"
                        ? `http://localhost:3000/admin/event-coordinator/image/${coordinatorDetails.event_coordinatorProfile.event_coordinator_file}`
                        : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="Coordinator Profile"
                    className="w-40 h-40 rounded-full border-4 border-gray-200 shadow-lg"
                  />
                  <span className="badge">
                    <a href={`../update/change-picture/${id}`}>
                    Change Picture
                    </a>   
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Coordinator ID:</strong> {coordinatorDetails.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {coordinatorDetails.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {coordinatorDetails.email}
                  </p>
                  <p>
                    <strong>NID:</strong>{" "}
                    {coordinatorDetails.event_coordinatorProfile.event_coordinator_NID}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {coordinatorDetails.event_coordinatorProfile.event_coordinator_phone}
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    {coordinatorDetails.event_coordinatorProfile.event_coordinator_gender}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(
                      coordinatorDetails.event_coordinatorProfile.event_coordinator_DOB
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {coordinatorDetails.event_coordinatorProfile.event_coordinator_address}
                  </p>
                  <p>
                    <strong>Profile Created On:</strong>{" "}
                    {new Date(
                      coordinatorDetails.event_coordinatorProfile.creationDate
                    ).toLocaleDateString()}
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
