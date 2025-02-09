// "use client"; // This makes the component a Client Component

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation"; // Use next/navigation for client-side routing
// import axios from "axios";
// import Link from "next/link";
// import Header from "@/app/components/header";
// import Footer from "@/app/components/footer";

// export default function ShowData() {
//   const [data, setData] = useState<any[]>([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setErrorMessage("You are not authenticated. Please log in.");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:3000/admin/alladmin", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setData(response.data); // Set the fetched data to state
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           setErrorMessage("Failed to load data. Please ensure you're authenticated.");
//         } else {
//           setErrorMessage("Unexpected error occurred. Please try later.");
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   // Close dropdown when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (errorMessage) {
//     return (
//       <div>
//         <Header />
//         <p className="text-red-500">{errorMessage}</p>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       {/* Dropdown Button */}
//       <div className="relative inline-block text-left mt-6 px-4">
//         <div>
//           <button
//             type="button"
//             onClick={toggleDropdown}
//             className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-blue-500 text-white px-6 py-2 text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Admin Actions
//             <svg
//               className="ml-2 -mr-1 h-5 w-5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Dropdown Menu */}
//         {dropdownOpen && (
//           <div
//             ref={dropdownRef}
//             className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none px-6"
//           >
//             <div className="py-1">
//               <Link
//                 href="admin/addadmin"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 truncate"
//               >
//                 Add Admin
//               </Link>
//               <Link
//                 href="admin/admin-profile"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 truncate"
//               >
//                 My Profile
//               </Link>
//               <Link
//                 href="admin/update-profile"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 truncate"
//               >
//                 Update My Profile
//               </Link>
//               <Link
//                 href="admin/updatecoordinator"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 truncate"
//               >
//                 Update Event-Coordinator
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <h2 className="text-2xl font-semibold my-4 px-4">All Admins Details</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Password</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((user: any) => (
//               <tr key={user.id} className="border-b border-gray-200">
//                 <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{user.password}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Footer from '@/app/components/footer';

// export default function AdminList() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [admins, setAdmins] = useState([]);
//   const [error, setError] = useState("");

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Authentication required. Please log in.");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:3000/admin/alladmin", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdmins(response.data);
//       } catch (error) {
//         setError("Failed to fetch admin data. Please check your authentication.");
//       }
//     };

//     fetchAdmins();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow">
//         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//       </header>

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-4">
//           <nav>
//             <h2 className="text-xl font-semibold mb-4">Navigation</h2>
//             <ul className="space-y-2">
//               <li>
//                 <a href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-700 transition">
//                   Dashboard
//                 </a>
//               </li>
//               <li className="relative">
//                 <button
//                   onClick={toggleDropdown}
//                   className="block p-2 w-full text-left rounded hover:bg-gray-700 transition"
//                 >
//                   Manage Admins
//                   <span className="ml-2">&#9662;</span>
//                 </button>
//                 {dropdownOpen && (
//                   <ul className="left-full top-0 mt-2 w-48 bg-gray-700 shadow-lg rounded z-10">
//                     <li>
//                       <a href="/admin/alladmin" className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition">
//                         Admin List
//                       </a>
//                     </li>
//                     <li>
//                       <a href="/admin/addadmin" className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition">
//                         Add Admin
//                       </a>
//                     </li>
//                     <li>
//                       <a href="/admin/delete-admin" className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition">
//                         Remove Admin
//                       </a>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//               <li>
//                 <a href="#" className="block p-2 rounded hover:bg-gray-700 transition">
//                   Settings
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="block p-2 rounded hover:bg-gray-700 transition">
//                   Reports
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="block p-2 rounded hover:bg-gray-700 transition">
//                   Logout
//                 </a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Content Area */}
//         <main className="flex-1 bg-gray-100 p-6">
//           <h2 className="text-xl font-bold mb-4">Admin List</h2>

//           {error && <p className="text-red-500">{error}</p>}

//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
//                   <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
//                   <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Password</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {admins.map((admin: any) => (
//                   <tr key={admin.id} className="border-b hover:bg-gray-100">
//                     <td className="px-4 py-2 text-sm text-gray-800">{admin.id}</td>
//                     <td className="px-4 py-2 text-sm text-gray-800">{admin.email}</td>
//                     <td className="px-4 py-2 text-sm text-gray-800">{admin.password}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//       <Footer/>
//     </div>
//   );
// }



//have design issue (override sidebar by list contents)

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '@/app/components/footer';
import { useRouter } from 'next/navigation';
import AdminHeader from '../adminheader';

export default function AdminListWithProfile() {
  const router = useRouter(); // Initialize router instance
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [error, setError] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchAdminsWithProfiles = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/admin/all-with-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminData(response.data);
      } catch (error) {
        setError("Failed to fetch admin data. Please check your authentication.");
      }
    };

    fetchAdminsWithProfiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader/>
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

        {/* Content Area */}
        <div className="bg-gray-100 p-6 w-screen">
          <h2 className="text-xl font-bold mb-4">Admin List with Profiles</h2>

          {error && <p className="text-red-500">{error}</p>}

        {adminData.map((admin: any) => (
        <div className="card card-side bg-base-100 shadow-xl my-6">
          <figure className='mx-4'>
            {admin.adminProfile.admin_filename !== 'N/A' ? (
                <img
                src={`http://localhost:3000/admin/get-image/`+admin.adminProfile.admin_filename}
                alt="Admin Profile"
                className="w-48 h-48 mx-auto rounded-full mt-2 border-4 border-gray-200 shadow-lg"
              />
              ) : (
                <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" className="w-48 h-48 mx-auto rounded-full mt-2 border-4 border-gray-200 shadow-lg"/>
            )}  
          </figure>
          <div className="card-body">
            
                <h3 className="card-title">Admin ID: {admin.id}</h3>
                <p><strong>Name:</strong> {admin.adminProfile.admin_name}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Phone:</strong> {admin.adminProfile.admin_phone}</p>
  
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={() => router.push(`admin-details/${admin.id}`)}>
              Details</button>
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


// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Footer from '@/app/components/footer';
// import { useRouter } from 'next/navigation';
// import AdminHeader from '../adminheader';

// export default function AdminListWithProfile() {
//   const router = useRouter(); // Initialize router instance
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [adminData, setAdminData] = useState([]);
//   const [error, setError] = useState('');

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   useEffect(() => {
//     const fetchAdminsWithProfiles = async () => {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         setError('Authentication required. Please log in.');
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:3000/admin/all-with-profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdminData(response.data);
//       } catch (error) {
//         setError('Failed to fetch admin data. Please check your authentication.');
//       }
//     };

//     fetchAdminsWithProfiles();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <AdminHeader />

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="hidden lg:block w-60 bg-base-200 p-4">
//           <ul className="menu">
//             <li><a>Homepage</a></li>
//             <li>
//               <details>
//                 <summary>Manage Admins</summary>
//                 <ul>
//                   <li><a href="addadmin">Add Admin</a></li>
//                   <li><a href="alladmin">Admin List</a></li>
//                 </ul>
//               </details>
//             </li>
//             <li><a>About</a></li>
//           </ul>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 p-6">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin List with Profiles</h2>

//           {error && <p className="text-red-500">{error}</p>}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {adminData.map((admin: any) => (
//               <div key={admin.id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
//                 {/* Profile Image */}
//                 <figure className="bg-gray-100">
//                   <img
//                     src={
//                       admin.adminProfile.admin_filename !== 'N/A'
//                         ? `http://localhost:3000/admin/get-image/${admin.adminProfile.admin_filename}`
//                         : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
//                     }
//                     alt="Admin Profile"
//                     className="w-full h-48 object-cover"
//                   />
//                 </figure>

//                 {/* Card Content */}
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-2">Admin ID: {admin.id}</h3>
//                   <p><strong>Name:</strong> {admin.adminProfile.admin_name}</p>
//                   <p><strong>Email:</strong> {admin.email}</p>
//                   <p><strong>Phone:</strong> {admin.adminProfile.admin_phone}</p>

//                   <div className="mt-4 flex justify-end">
//                     <button
//                       className="btn btn-primary w-full"
//                       onClick={() => router.push(`admin-details/${admin.id}`)}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
