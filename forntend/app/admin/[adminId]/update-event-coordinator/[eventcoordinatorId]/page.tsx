'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

export default function UpdateCoordinatorPage({ params }: { params: { adminId: string; coordinatorId: string } }) {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  

  // onSubmit handler to send the update data to backend
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/${params.adminId}/update-coordinator/${params.coordinatorId}`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        setSuccessMessage('Event Coordinator updated successfully!');
        router.push('/admin/coordinators'); // Redirect to coordinators list page after successful update
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage('Error updating coordinator: ' + (error.response?.data.message || error.message));
      } else {
        setErrorMessage('Unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Update Event Coordinator</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Name:</label><br />
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p>{errors.name.message}</p>}
        <br />

        <label>Email:</label><br />
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <br />

        <label>Password:</label><br />
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <button type="submit">Update Coordinator</button>
      </form>
    </div>
  );
}
