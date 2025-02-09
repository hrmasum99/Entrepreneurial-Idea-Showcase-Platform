"use client";
import { useState } from "react";
import axios from "axios";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function GetAdminByQuery() {
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminId(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAdmins([]);

    try {
      const response = await axios.get(`http://localhost:3000/admin`, {
        params: {
          id: adminId,
          email: adminEmail
        }
      });
      setAdmins(response.data);
    } catch (error: any) {
      setErrorMessage("No admin found or an error occurred.");
    }
  };

  return (
    <div>
        <Header/>
      <h1>Retrieve Admins by ID and Email</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Admin ID:
          <input
            type="text"
            value={adminId}
            onChange={handleIdChange}
            placeholder="Enter admin ID"
          />
        </label>
        <br />
        <label>
          Admin Email:
          <input
            type="text"
            value={adminEmail}
            onChange={handleEmailChange}
            placeholder="Enter admin email"
          />
        </label>
        <br />
        <button type="submit">Get Admins</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {admins.length > 0 && (
        <div>
          <h2>Admin Details</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin: any) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.email}</td>
                  <td>{admin.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Footer/>
    </div>
  );
}
