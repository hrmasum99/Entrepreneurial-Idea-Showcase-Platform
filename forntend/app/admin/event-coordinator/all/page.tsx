'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '@/app/components/footer';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../adminheader';

export default function EventCoordinatorList() {
  const router = useRouter(); // Initialize router instance
  const [coordinatorData, setCoordinatorData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCoordinators = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/admin/getadminwithcoordinator", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Flatten the coordinator data for display
        const flatData = response.data.flatMap((admin: any) => 
          admin.evt_co.map((coordinator: any) => ({
            id: coordinator.id,
            name: coordinator.name,
            email: coordinator.email,
            adminId: admin.id,
            adminEmail: admin.email,
          }))
        );
        setCoordinatorData(flatData);
      } catch (error) {
        setError("Failed to fetch coordinator data. Please check your authentication.");
      }
    };

    fetchCoordinators();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden flex-none lg:block">
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            <li><a>Homepage</a></li>
            <li>
              <details>
                <summary>Manage Admins</summary>
                <ul>
                  <li><a href="../addadmin">Add Admin</a></li>
                  <li><a href="../alladmin">Admin List</a></li>
                </ul>
              </details>
            </li>
            <li>
              <details>
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

        {/* Content Area */}
        <div className="bg-gray-100 p-6 w-screen">
          <h2 className="text-xl font-bold mb-4">Event Coordinator List</h2>

          {error && <p className="text-red-500">{error}</p>}

          {coordinatorData.map((coordinator: any) => (
            <div key={coordinator.id} className="card card-side bg-base-100 shadow-xl my-6">
              <figure className="mx-4">
                <img
                  alt="Coordinator Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  className="w-48 h-48 mx-auto rounded-full mt-2 border-4 border-gray-200 shadow-lg"
                />
              </figure>
              <div className="card-body">
                <h2>{coordinator.name}</h2>
                <p>{coordinator.email}</p>
                
                <p>Added By: {coordinator.adminEmail}</p>
                <span className="badge text-amber-700 border-amber-700">
                  <a href={`../admin-details/${coordinator.adminId}`}>
                  View Admin
                  </a>
                </span>

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push(`details/${coordinator.id}`)}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
