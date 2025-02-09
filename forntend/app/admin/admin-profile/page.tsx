'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '../adminheader';
// const token = localStorage.getItem('token');

interface AdminProfile {
  admin_PID: number;
  admin_name: string;
  admin_NID: string;
  admin_phone: string;
  admin_gender: string;
  admin_DOB: string;
  admin_address: string;
  admin_filename: string; // File name for the image
  creationDate: string;
}

interface AdminData {
  id: number;
  email: string;
  adminProfile: AdminProfile;
}

export default function AdminProfilePage() {
  const router = useRouter(); // Initialize router instance
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:3000/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminData(response.data);
      } catch (err: any) {
        console.error('Error fetching admin profile:', err.message);
        setError('Failed to load admin profile.');
      }
    };

    fetchAdminProfile();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!adminData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const { id, email, adminProfile } = adminData;

  return (
    <div className="container bg-gray-100 ">
      <AdminHeader/>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        {/* <header className="bg-blue-600 text-white p-4 shadow">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header> */}

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="hidden flex-none lg:block">
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
                {/* Sidebar content here */}
                <li><a>Homepage</a></li>
                <li>
                  <details> {/*<details open>*/}
                    <summary>Manage Admins</summary>
                    <ul>
                    <li>
                        <a
                          href="addadmin"
                          // className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition"
                        >
                          Add Admin
                        </a>
                      </li>
                      <li>
                        <a
                          href="alladmin"
                          // className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition"
                        >
                          Admin List
                        </a>
                      </li>
                      {/* <li>
                        <details open>
                          <summary>Parent</summary>
                          <ul>
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                          </ul>
                        </details>
                      </li> */}
                    </ul>
                  </details>
                </li>
                <li>
                  <details> {/*<details open>*/}
                    <summary>Manage Event-Coordinators</summary>
                    <ul>
                    <li>
                        <a
                          href="event-coordinator/add"
                        >
                          Add Event-Coordinator
                        </a>
                      </li>
                      <li>
                        <a
                          href="event-coordinator/all"
                        >
                          Event-Coordinator List
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
                <li><a>About</a></li>
              </ul>
            </div>
      <div className="bg-white p-6 shadow-lg rounded-lg w-screen mx-auto">
        <div className="space-y-4 text-black">
          <div className="flex justify-between">
            <div className="mt-6 text-center">
              <strong className="font-medium text-gray-700">Profile Image:</strong>
              {adminProfile.admin_filename !== 'N/A' ? (
                <img
                src={`http://localhost:3000/admin/get-image/`+adminProfile.admin_filename}
                alt="Admin Profile"
                // src={`http://localhost:3000/admin/get-image/${adminProfile.admin_filename}?token=${token}`}
                // alt="Admin Profile"
                className="w-48 h-48 mx-auto rounded-2xl mt-2 border-4 border-gray-200 shadow-lg"
              />
              ) : (
                <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" className="w-48 h-48 mx-auto rounded-2xl mt-2 border-4 border-gray-200 shadow-lg"/>
                // <p className="text-gray-500 mt-2">No image available</p>
              )}
              <span className="badge">
                <a href="update-profile/update-profile-picture">
                  Change Profile
                </a>
              </span>
            </div>
            <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => router.push(`update-profile`)}>
                Edit Profile</button>
            </div>
              {/* <Link href="update-profile" className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
              Edit Profile
              </Link> */}
          </div>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">ID:</strong> {id}
          </p> 

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Email:</strong> {email}
          </p>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Full Name:</strong> {adminProfile.admin_name}
          </p>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">NID:</strong> {adminProfile.admin_NID}
          </p>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Phone Number:</strong> {adminProfile.admin_phone}
          </p>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Gender:</strong> {adminProfile.admin_gender}
          </p>

          <div className="flex justify-start">
            <p className="text-lg">
              <strong className="font-medium text-gray-700">Date of Birth:</strong> {new Date(adminProfile.admin_DOB).toLocaleDateString()}
            </p>
            <span className="badge">
                <a href="update-profile/update-DOB">
                  Edit DOB
                </a>
            </span>
            {/* <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => router.push(`update-profile/update-DOB`)}>
                Edit DOB</button>
            </div> */}
          </div>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Address:</strong> {adminProfile.admin_address}
          </p>

          <p className="text-lg">
            <strong className="font-medium text-gray-700">Creation Date:</strong> {new Date(adminProfile.creationDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* <div className="mt-6 space-y-4">
        <Link href="admin/update-profile" className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
          Edit Profile
        </Link>
      </div> */}
      
  
        </div>
        <Footer/>
      </div>
    </div>
  );
}
