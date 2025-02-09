"use client";
import Footer from "@/app/components/footer";
import AdminHeader from "../../adminheader";
import { useEffect, useState } from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

interface IJudgeInput {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function CreateJudge() {
    const { register, handleSubmit, watch, formState: { errors} } = useForm<IJudgeInput>();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const router = useRouter();

    // Fetch token
    useEffect(() =>{
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
        } else {
            setMessage("Token not found. Please log in again!!!") 
            setTimeout(() => router.push(`/login`), 1000); // Redirect to login
        }
    }, [router]);

    const onSubmit: SubmitHandler<IJudgeInput> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setLoading(true);
        try{
            const response = await axios.post(`http://localhost:3000/admin/create-judge`, {email: data.email, password: data.password},
                {
                    headers: { Authorization: `Bearer ${authToken}`},
                }
            );

            if (response.status === 201) {
                setMessage("Judge created successfully!");
                setTimeout(() => router.push(`../all`), 1000); // redirect to judge list
            }
        } catch (error) {
            setMessage(
                axios.isAxiosError(error)? error.response?.data?.message || "Error creating Judge!!!" : "An unexpected error occurred!!!"
            );
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-grow flex flex-col">
            {/* Admin Header */}
            <div className="z-50">
            <AdminHeader />
            </div>
            <div className="flex flex-1">
            {/* Sidebar */}
            <div className="hidden lg:flex flex-none w-60 bg-base-200 p-4">
                <ul className="menu min-h-full">
                <li><a>Homepage</a></li>
                <li>
                    <details>
                    <summary>Manage Admins</summary>
                    <ul>
                        <li><a href="/admin/addadmin">Add Admin</a></li>
                        <li><a href="/admin/alladmin">Admin List</a></li>
                    </ul>
                    </details>
                </li>
                <li>
                    <details> {/*<details open>*/}
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
            {/* Page Content */}
            <main className="flex-grow p-6">
                <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Create Judge</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className=" mt-6">
                    <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input 
                    id="email" 
                    type="text" 
                    {...register("email", )}
                    className="grow" placeholder="Email" />
                    {errors.email && <p className="text-sm text-red-500"> {errors.email.message}</p>}
                    </label>
                    </div>
                    <div className=" my-6">
                        {/* <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" className="grow" placeholder="Username" />
                        </label> */}
                        <div className=" text-end">
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className=" text-gray-500"
                        >
                        {showPassword ? "Hide" : "Show"}
                        </button>
                        </div>
                        <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                        </svg>
                        <div className="relative">
                        <input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", )} 
                        className="grow" placeholder="Password" />
                        
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </label>
                    </div>
                    <div className=" my-6">
                        <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                        </svg>
                        <div className="relative">
                        <input 
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === watch("password") || "Passwords do not match",
                        })}className="grow" placeholder="Confirm Password" />
                        </div>
                        {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                        </label>
                    </div>
                    <div className=" my-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                            {loading ? "Creating..." : "Create Judge"}
                        </button>
                    </div>
                </form>
                </div>
            </main>
            </div>
            <Footer />
            </div>
        </div>
    )
}