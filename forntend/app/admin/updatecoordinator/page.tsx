"use client";
import { useState } from "react";
import axios from "axios";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default function UpdateCoordinator() {
  const [adminId, setAdminId] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminId(e.target.value);
  };

  const handleCoordinatorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinatorId(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const updateData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/${adminId}/update-coordinator/${coordinatorId}`,
        updateData
      );
      setSuccessMessage("Coordinator updated successfully!");
    } catch (error: any) {
      setErrorMessage("Error updating the coordinator.");
    }
  };

  return (
    <div>
      <Header/>
      <h1>Update Event Coordinator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Admin ID:
          <input
            type="text"
            value={adminId}
            onChange={handleAdminIdChange}
            placeholder="Enter Admin ID"
            required
          />
        </label>
        <br />
        <label>
          Coordinator ID:
          <input
            type="text"
            value={coordinatorId}
            onChange={handleCoordinatorIdChange}
            placeholder="Enter Coordinator ID"
            required
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter Coordinator Name"
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter Coordinator Email"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter Coordinator Password"
          />
        </label>
        <br />
        <button type="submit">Update Coordinator</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Footer/>
    </div>
  );
}
