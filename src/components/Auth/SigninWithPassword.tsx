"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SigninWithPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simpan token di localStorage atau cookie
        localStorage.setItem("token", data.token); // Jika menggunakan localStorage

        // Redirect ke halaman setelah login
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message); // Tampilkan pesan kesalahan dari server
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("Internal Server Error"); // Tampilkan pesan kesalahan umum
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2.5 block font-medium text-dark dark:text-white">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="password" className="mb-2.5 block font-medium text-dark dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="password"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          />
        </div>
      </div>

      

      <div className="mb-4.5">
        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90">
          Sign In
        </button>
      </div>
    </form>
  );
}
