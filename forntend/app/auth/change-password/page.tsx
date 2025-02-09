'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/footer';
import AdminHeader from '@/app/admin/adminheader';

interface IChangePasswordInput {
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}

export default function ChangePassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IChangePasswordInput>();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();
  const authToken = localStorage.getItem("token");

  if (!authToken) {
    router.push('/login');
    return null;
  }

  const onSubmit: SubmitHandler<IChangePasswordInput> = async (data) => {
    if (data.newpassword !== data.confirmpassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/change-password",
        {
          oldpassword: data.oldpassword,
          newpassword: data.newpassword,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        setMessage("Password changed successfully!");
        router.push('/admin-profile'); // Navigate to profile page after success
      }
    } catch (error) {
      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Error changing password"
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

//   const toggleShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

  return (
    <div className="container bg-gray-100 ">
      {/* Admin Header */}
      <AdminHeader/>
      <div className="min-h-screen flex flex-col">
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
                <li><a>About</a></li>
              </ul>
            </div>

      {/* Content Wrapper */}
      <div className="flex flex-grow">

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Old Password */}
              <div>
                <label htmlFor="oldpassword" className="block text-sm font-medium text-gray-700">
                  Current Password:
                </label>
                <div className="relative">
                <input
                  id="oldpassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("oldpassword", {
                    required: "Current password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.oldpassword && <p className="text-sm text-red-500">{errors.oldpassword.message}</p>}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
                  New Password:
                </label>
                <div className="relative">
                <input
                  id="newpassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newpassword", {
                    required: "New password is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must be at least 8 characters, contain one letter and one number",
                    },
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.newpassword && <p className="text-sm text-red-500">{errors.newpassword.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password:
                </label>
                <div className="relative">
                <input
                  id="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmpassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("newpassword") || "Passwords do not match",
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmpassword && <p className="text-sm text-red-500">{errors.confirmpassword.message}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>

            {/* Message */}
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
          </div>
        </main>
      </div>

      </div>
      <Footer/>
      </div>
    </div>
  );
}
