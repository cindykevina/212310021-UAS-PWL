import { Metadata } from "next";
import AuthLayout from "@/components/Layouts/AuthLayout";
import React from "react";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "Absensi App",
  description: "Dashboard Absensi Panti Wredha Sejahtera",
};

export default function Home() {
  return (
    <>
      <AuthLayout>
        <SignIn />
      </AuthLayout>
    </>
  );
}
