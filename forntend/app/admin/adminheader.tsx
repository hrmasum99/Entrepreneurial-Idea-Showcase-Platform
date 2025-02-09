import { useEffect, useState } from "react";
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

export default function AdminHeader() {
    const [admindata, setAdminData] = useState<AdminData | null>(null); // Starts as null
    const [error, setError] = useState('');

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
          {/* <h1>{adminProfile.admin_filename}</h1> */}
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
                // src={`http://localhost:3000/admin/get-image/1734359851889download.jpg`}
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
                  <li><a href="event-coordinator/add">Add Event-Coordinator</a></li>
                  <li><a href="event-coordinator/all">Event-Coordinator List</a></li>
                </ul>
              </details>
            </li>
            <li><a>About</a></li>
          </ul>
        </div>
      </div>
    )
    }
}