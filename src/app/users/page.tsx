"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableUser from '@/components/Tables/TableUser';

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/get-session');
        if (response.ok) {
          const data = await response.json();
          const { user } = data;
          if (user.role === "admin") {
            setUser(user);
          } else {
            router.push('/dashboard'); // Redirect to home or appropriate page for non-admin users
          }
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/auth/signin');
      }
    };
    checkSession();
  }, [router]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Users" />
      <div className="flex flex-col gap-10">
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push('/users/create')}
          >
            Create New User
          </button>
        </div>
        <TableUser />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
