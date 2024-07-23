"use client";
import React, { useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useRouter } from 'next/navigation'; // Menggunakan useRouter dari next/navigation

const CreateUserPage = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    password: '',
    roleid: 2, // Default role, sesuaikan berdasarkan setup Anda
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const sessionResponse = await axios.get("/api/auth/get-session");
      const token = sessionResponse.data.user.token;
      await axios.post(`/api/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/users'); // Redirect ke daftar pengguna setelah create
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create User" />

      <div className="bg-gray-100">
        <div className="max-w-12xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    value={userData.nama}
                    onChange={handleChange}
                    autoComplete="nama"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nama"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </label>
                  <input
                    id="no_telp"
                    name="no_telp"
                    type="tel"
                    value={userData.no_telp}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nomor Telepon"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateUserPage;
