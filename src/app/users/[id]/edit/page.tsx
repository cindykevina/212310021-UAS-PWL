"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useRouter, useParams } from 'next/navigation'; // Menggunakan useParams dari next/navigation
import { Users } from '@/types/users';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // Menggunakan useParams untuk mendapatkan id dari URL

  const [user, setUser] = useState<Users>({
    id: 0,
    nama: '',
    email: '',
    no_telp: '',
    roleId: 2, // Default role, sesuaikan berdasarkan setup Anda
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const sessionResponse = await axios.get("/api/auth/get-session");
          const token = sessionResponse.data.user.token;
          const response = await axios.get(`/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id) {
        const sessionResponse = await axios.get("/api/auth/get-session");
        const token = sessionResponse.data.user.token;
        await axios.put(`/api/users/${id}`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        router.push('/users'); // Redirect ke daftar pengguna setelah update
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  if (!id) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // Menampilkan pesan loading jika id belum tersedia
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Users" />

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
                    value={user.nama}
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
                    value={user.email}
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
                    value={user.no_telp}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nomor Telepon"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditUserPage;
