'use client';

import { useState } from 'react';
import axios from 'axios';
import Footer from "@/app/components/footer";
import { useParams, useRouter } from 'next/navigation';
import AdminHeader from '@/app/admin/adminheader';

export default function UpdateProfilePicture() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams(); // Get coordinatorId from the route

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!id) {
      setError('Coordinator ID is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('myfile', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `http://localhost:3000/admin/update-coordinator/upload-profile-image/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setTimeout(() => router.push(`/admin/event-coordinator/details/${id}`), 1000); // Redirect after success
      }
      
      setError('');
    } catch (err: any) {
      console.error('Error updating profile image:', err.message);
      setError('Failed to upload profile image.');
      setMessage('');
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden flex-none lg:block">
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            {/* Sidebar content here */}
            <li><a>Homepage</a></li>
            <li>
              <details>
                <summary>Manage Admins</summary>
                <ul>
                  <li>
                    <a href="addadmin">Add Admin</a>
                  </li>
                  <li>
                    <a href="alladmin">Admin List</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>Manage Event-Coordinators</summary>
                <ul>
                  <li>
                    <a href="event-coordinator/add">Add Event-Coordinator</a>
                  </li>
                  <li>
                    <a href="event-coordinator/all">Event-Coordinator List</a>
                  </li>
                </ul>
              </details>
            </li>
            <li><a>About</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4">Update Profile Picture</h2>

          <div className="mb-4">
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </div>

          <button onClick={handleUpload} className="btn btn-primary">
            Upload
          </button>

          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
