"use client";
import Link from "next/link";
import React from "react";
// import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign in" /> */}

      <div className="my-6 flex items-center justify-center">
        {/* <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span> */}
      </div>

      <div>
        <SigninWithPassword />
      </div>
    </>
  );
}
