import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "@/types/users";
import Link from 'next/link';

const TableUser = () => {
  const [usersData, setUsersData] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndData = async () => {
      try {
        // Fetch bearer token from session endpoint
        const sessionResponse = await axios.get("/api/auth/get-session");
        const token = sessionResponse.data.user.token;
        
        // Fetch users data with bearer token
        const usersResponse = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsersData(usersResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchTokenAndData();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (!confirmation) {
      return;
    }

    try {
      const sessionResponse = await axios.get("/api/auth/get-session");
      const token = sessionResponse.data.user.token;

      await axios.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsersData(usersData.filter((user) => user.id !== id));
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md dark:border-gray-600 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                No.
              </th>
              <th className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                Nama
              </th>
              <th className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                Email
              </th>
              <th className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                Nomor Telepon
              </th>
              <th className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                Role
              </th>
              <th className="px-4 py-2 font-medium text-right text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-600' : ''}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.nama}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.no_telp}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                    user.roleId === 1 ? 'bg-green-200 text-green-800' :
                    user.roleId === 2 ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {user.roleId === 1 ? 'Admin' :
                    user.roleId === 2 ? 'Karyawan' : 'undefined'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <Link href={`/users/${user.id}/edit`}>
                      <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        <svg
                          className="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8l4 4v8l-4 4H7a1 1 0 0 1-1-1zm6-10a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
                        </svg>
                      </button>
                    </Link>
                    <button
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      onClick={() => handleDelete(user.id)}
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUser;
