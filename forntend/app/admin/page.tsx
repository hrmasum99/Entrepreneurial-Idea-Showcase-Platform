'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/footer';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AdminProfile {
  admin_filename: string; // File name for the image
}

interface AdminData {
  id: number;
  email: string;
  adminProfile: AdminProfile;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admindata, setAdminData] = useState<AdminData | null>(null); // Starts as null
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:3000/admin/admindata', {
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

    fetchAdminData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // Conditionally destructure admindata only if it is available
  if (admindata) {
    const { id, email, adminProfile } = admindata;

  return (
    <div>
      <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
      <div className="navbar bg-base-300 w-full">
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>

        <div className="mx-2 flex-1 px-2">
          <a className="btn btn-ghost text-xl" href="http://localhost:7000/admin">Admin Portal</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
              {adminProfile.admin_filename !== 'N/A' ? (
                <img
                src={`http://localhost:3000/admin/get-image/`+adminProfile.admin_filename}
                alt="Admin Profile" />
              ) : (
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between" href="http://localhost:7000/admin/admin-profile">
                  Profile
                  {/* <span className="badge">New</span> */}
                </a>
              </li>
              <li><a href="http://localhost:7000/auth/change-password">Change Password</a></li>
              <li><a href="http://localhost:7000/auth/logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            {/* Sidebar content here */}
            {/* Sidebar content here */}
            <li><a>Homepage</a></li>
              <li>
                <details> {/*<details open>*/}
                  <summary>Manage Admins</summary>
                  <ul>
                  <li>
                      <a
                        href="admin/addadmin"
                        // className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition"
                      >
                        Add Admin
                      </a>
                    </li>
                    <li>
                      <a
                        href="admin/alladmin"
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
                    <li><a href="admin/event-coordinator/add">Add Event-Coordinator</a></li>
                    <li><a href="admin/event-coordinator/all">Event-Coordinator List</a></li>
                  </ul>
                </details>
              </li>
              <li><a>About</a></li>
            </ul>
        </div>
      </div>



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
                        href="admin/addadmin"
                        // className="block px-6 py-2 text-sm text-white hover:bg-gray-600 transition"
                      >
                        Add Admin
                      </a>
                    </li>
                    <li>
                      <a
                        href="admin/alladmin"
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
                    <li><a href="admin/event-coordinator/add">Add Event-Coordinator</a></li>
                    <li><a href="admin/event-coordinator/all">Event-Coordinator List</a></li>
                  </ul>
                </details>
              </li>
              <li><a>About</a></li>
            </ul>
          </div>

        {/* Content Area */}
        {/* <main className="flex-1 bg-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4">Welcome, Admin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
            {/* Cards */}
            {/* <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold">150</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold">New Signups</h3>
              <p className="text-3xl font-bold">25</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold">Pending Tasks</h3>
              <p className="text-3xl font-bold">10</p>
            </div>
          </div>
        </main> */}
        <main className="flex-1 bg-gray-100 p-6">
          <h1 className="text-xl font-bold mb-4">Welcome, Admin {id}</h1>
                  
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">31K</div>
              <div className="stat-desc">Jan 1st - Feb 1st</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">New Users</div>
              <div className="stat-value">4,200</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </div>
              <div className="stat-title">Pending Tasks</div>
              <div className="stat-value">1,200</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
    </div>
  );
}
}
// function jwtDecode(token: string): any {
//   throw new Error('Function not implemented.');
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import Footer from '../components/footer';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface AdminProfile {
//   admin_filename: string; // File name for the image
// }

// interface AdminData {
//   id: number;
//   email: string;
//   adminProfile: AdminProfile;
// }

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [admindata, setAdminData] = useState<AdminData | null>(null); // Starts as null
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await axios.get('http://localhost:3000/admin/admindata', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setAdminData(response.data);
//       } catch (err: any) {
//         console.error('Error fetching admin profile:', err.message);
//         setError('Failed to load admin profile.');
//       }
//     };

//     fetchAdminData();
//   }, []);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   // Conditionally destructure admindata only if it is available
//   if (admindata) {
//     const { id, email, adminProfile } = admindata;

//     return (
//       <div>
//         <div className="mt-6 text-center">
//               <strong className="font-medium text-gray-700">Profile Image:</strong>
//               {adminProfile.admin_filename !== 'N/A' ? (
//                 <img
//                 src={`http://localhost:3000/admin/get-image/`+adminProfile.admin_filename}
//                 alt="Admin Profile"
//                 className="w-48 h-48 mx-auto rounded-2xl mt-2 border-4 border-gray-200 shadow-lg"
//               />
//               ) : (
//                 <p className="text-gray-500 mt-2">No image available</p>
//               )}
//             </div>
//         <p>ID: {id}</p>
//         <p>Email: {email}</p>
//         <p>File: {adminProfile.admin_filename}</p>
//         <Footer />
//       </div>
//     );
//   }

//   return <div>Loading admin data...</div>;
// }
