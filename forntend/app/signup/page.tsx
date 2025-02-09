'use client';
import { useRouter } from 'next/navigation';  // Import useRouter for redirection
import { SubmitHandler, useForm } from "react-hook-form";
import Footer from "../components/footer";
import Header from "../components/header";
import TitleBar from "../components/titlebar";
import FavIcon from "../components/favicon";
import axios from 'axios'; // Import axios for making HTTP requests

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<IFormInput>();
  const password = watch('password');
  const router = useRouter();  // Initialize router for navigation

  // onSubmit handler to send the form data to backend
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', {
        email: data.email,
        password: data.password,
        role: data.role
      });

      // Check if registration is successful (201 Created)
      if (response.status === 201) {
        console.log('Registration successful!');
        router.push('/login'); // Redirect to login page
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <>
      <TitleBar title="Register" />
      <FavIcon href="/fav99.svg" />
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <br /><br />

        <label>Email:</label>
        <input type="email" {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <br /><br />

        <label>Password:</label>
        <input type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
        <br /><br />

        <label>Confirm Password:</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        <br /><br />

        <label>Role:</label>
        <select {...register("role", { required: 'Role is required' })}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="judge">Judge</option>
          <option value="entrepreneur">Entrepreneur</option>
        </select>
        {errors.role && <span>{errors.role.message}</span>}
        <br /><br />


        <button type="submit">Register</button>
        <br /><br />
      </form>
      <Footer />
    </>
  );
}
