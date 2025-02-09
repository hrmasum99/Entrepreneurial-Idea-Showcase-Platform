'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../adminheader';
import Footer from '@/app/components/footer';

interface ProfileData {
  admin_name: string;
  admin_NID: string;
  admin_phone: string;
  admin_gender: string;
  admin_address: string;
}

export default function UpdateProfile() {
  const { register, handleSubmit, reset } = useForm<ProfileData>();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { admin_name, admin_NID, admin_phone, admin_gender, admin_address } =
          response.data.adminProfile;

        reset({ admin_name, admin_NID, admin_phone, admin_gender, admin_address });
      } catch (error) {
        setErrorMessage('Failed to load profile data.');
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/admin/update-profile',
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div>
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            {...register('admin_name', { required: 'Name is required' })}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NID:</label>
          <input
            {...register('admin_NID', { required: 'NID is required' })}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone:</label>
          <input
            {...register('admin_phone', { required: 'Phone is required' })}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender:</label>
          <select
            {...register('admin_gender', { required: 'Gender is required' })}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            {...register('admin_address', { required: 'Address is required' })}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Update Profile
        </button>
      </form>
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
    </div>
    <Footer/>
    </div>
  );
}



// 'use client';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from '@/app/components/header';
// import Footer from '@/app/components/footer';

// interface AdminProfile {
//   admin_PID: number;
//   admin_name: string;
//   admin_NID: string;
//   admin_phone: string;
//   admin_gender: string;
//   admin_DOB: string;
//   admin_address: string;
// }

// interface AdminData {
//   id: number;
//   email: string;
//   adminProfile: AdminProfile;
// }

// export default function UpdateProfile() {
//   const [adminData, setAdminData] = useState<AdminData | null>(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const fetchAdminProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No authentication token found');

//         const response = await axios.get('http://localhost:3000/admin/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAdminData(response.data);
//       } catch (error: any) {
//         console.error('Error fetching admin profile:', error.message);
//         setErrorMessage('Failed to load admin profile.');
//       }
//     };

//     fetchAdminProfile();
//   }, []);

//   const handleInputChange = (field: keyof AdminProfile, value: string) => {
//     if (adminData) {
//       setAdminData({
//         ...adminData,
//         adminProfile: {
//           ...adminData.adminProfile,
//           [field]: value,
//         },
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const response = await axios.put(
//         'http://localhost:3000/admin/update-profile',
//         adminData?.adminProfile, // Send updated adminProfile only
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSuccessMessage('Profile updated successfully!');
//       }
//     } catch (error: any) {
//       console.error('Error updating profile:', error.message);
//       setErrorMessage('Failed to update profile.');
//     }
//   };

//   if (errorMessage) {
//     return <div className="text-red-500">{errorMessage}</div>;
//   }

//   if (!adminData) {
//     return <div>Loading...</div>;
//   }

//   const { adminProfile } = adminData;

//   return (
//     <div>
//       <Header />
//       <div className="p-8 bg-gray-100">
//         <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
//         <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
//           <div>
//             <label className="block font-medium">Name:</label>
//             <input
//               type="text"
//               value={adminProfile.admin_name}
//               onChange={(e) => handleInputChange('admin_name', e.target.value)}
//               placeholder="Enter Admin Name"
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <br />
//           <div>
//             <label className="block font-medium">NID:</label>
//             <input
//               type="text"
//               value={adminProfile.admin_NID}
//               onChange={(e) => handleInputChange('admin_NID', e.target.value)}
//               placeholder="Enter Admin NID"
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <br />
//           <div>
//             <label className="block font-medium">Phone:</label>
//             <input
//               type="text"
//               value={adminProfile.admin_phone}
//               onChange={(e) => handleInputChange('admin_phone', e.target.value)}
//               placeholder="Enter Admin Phone Number"
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <br />
//           <div>
//             <label className="block font-medium">Gender:</label>
//             <select
//               value={adminProfile.admin_gender}
//               onChange={(e) => handleInputChange('admin_gender', e.target.value)}
//               className="w-full border p-2 rounded"
//               required
//             >
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>
//           <br />
//           <div>
//             <label className="block font-medium">Date of Birth:</label>
//             <input
//               type="date"
//               value={adminProfile.admin_DOB}
//               onChange={(e) => handleInputChange('admin_DOB', e.target.value)}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <br />
//           <div>
//             <label className="block font-medium">Address:</label>
//             <textarea
//               value={adminProfile.admin_address}
//               onChange={(e) => handleInputChange('admin_address', e.target.value)}
//               placeholder="Enter Address"
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <br />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Update Profile
//           </button>
//         </form>
//         {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
//         {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
//       </div>
//       <Footer />
//     </div>
//   );
// }
