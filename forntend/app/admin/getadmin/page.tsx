"use client";
import { useState } from "react";
import axios from "axios";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default function GetAdminById() {
  const [adminId, setAdminId] = useState("");
  const [adminData, setAdminData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAdminData(null);

    try {
      const response = await axios.get(`http://localhost:3000/admin/getadmin/${adminId}`);
      setAdminData(response.data);
    } catch (error: any) {
      setErrorMessage("Admin not found or an error occurred.");
    }
  };

  return (
    <div>
        <Header/>
      <h1>Retrieve Admin by ID</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Admin ID:
          <input
            type="text"
            value={adminId}
            onChange={handleInputChange}
            placeholder="Enter admin ID"
          />
        </label>
        <button type="submit">Get Admin</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {adminData && (
        <div>
          <h2>Admin Details</h2>
          <p>ID: {adminData.id}</p>
          <p>Email: {adminData.email}</p>
          <p>Password: {adminData.password}</p>
        </div>
      )}
      <Footer/>
    </div>
  );
}
