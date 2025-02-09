import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-gray-800 text-white py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
        <div className="flex items-center">
          <Image src="/masum99.png" alt="My logo" width={50} height={50} />
        </div>
        <nav className="space-x-6">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <Link href="auth/signup" className="hover:text-indigo-400">Register</Link>
          <Link href="/admin" className="hover:text-indigo-400">Admin</Link>
          <Link href="auth/login" className="hover:text-indigo-400">Login</Link>
          <Link href="/about" className="hover:text-indigo-400">About Us</Link>
          <Link href="/contact" className="hover:text-indigo-400">Contact Us</Link>
        </nav>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import jwtDecode from "jwt-decode";

// interface TokenPayload {
//   role: string;
// }

// const Header = () => {
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded: TokenPayload = jwtDecode(token);
//         setRole(decoded.role);
//       } catch (error) {
//         console.error("Invalid token:", error);
//         setRole(null);
//       }
//     } else {
//       setRole(null);
//     }
//   }, []);

//   if (role === "admin") {
//     // Admin Header
//     return (
//       <header className="bg-blue-600 text-white p-4 shadow">
//         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//       </header>
//     );
//   }

//   if (role === "user") {
//     // User Header
//     return (
//       <header className="bg-green-600 text-white p-4 shadow">
//         <h1 className="text-2xl font-bold">User Dashboard</h1>
//       </header>
//     );
//   }

//   // Default Header for non-authenticated users
//   return (
//     <div className="bg-gray-800 text-white py-4">
//       <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
//         <div className="flex items-center">
//           <Image src="/masum99.png" alt="My logo" width={50} height={50} />
//         </div>
//         <nav className="space-x-6">
//           <Link href="/" className="hover:text-indigo-400">
//             Home
//           </Link>
//           <Link href="auth/signup" className="hover:text-indigo-400">
//             Register
//           </Link>
//           <Link href="/admin" className="hover:text-indigo-400">
//             Admin
//           </Link>
//           <Link href="auth/login" className="hover:text-indigo-400">
//             Login
//           </Link>
//           <Link href="/about" className="hover:text-indigo-400">
//             About Us
//           </Link>
//           <Link href="/contact" className="hover:text-indigo-400">
//             Contact Us
//           </Link>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Header;


