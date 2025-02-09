'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '@/app/components/footer';
import AdminHeader from '../../adminheader';

interface DOBData {
  admin_DOB: string;
}

export default function UpdateDOB() {
  const { register, handleSubmit, reset } = useForm<DOBData>();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDOB = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { admin_DOB } = response.data.adminProfile;

        reset({ admin_DOB });
      } catch (error) {
        setErrorMessage('Failed to load DOB data.');
      }
    };

    fetchDOB();
  }, [reset]);

  const onSubmit = async (data: DOBData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/admin/update-profile-dob',
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Date of Birth updated successfully!');
      }
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to update DOB.');
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
                        >
                          Add Admin
                        </a>
                      </li>
                      <li>
                        <a
                          href="alladmin"
                        >
                          Admin List
                        </a>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Date of Birth</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input
                type="date"
                {...register('admin_DOB', { required: 'Date of Birth is required' })}
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Update DOB
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



