"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import DashboardAdmin from "@/components/Dashboard/Admin";
import DashboardUsers from "@/components/Dashboard/Users";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/get-session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
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
      {user.role === 'admin' ? (
        <DashboardAdmin />
      ) : (
        <DashboardUsers />
      )}
    </DefaultLayout>
  );
};

export default Home;
