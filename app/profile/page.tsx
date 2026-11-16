"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#078641]"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-[#183D32]">
          Please Login First
        </h2>

        <Link
          href="/login"
          className="px-6 py-3 bg-[#078641] text-white rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-[75vh] bg-[#f8f8f3] flex items-center justify-center px-5 py-12">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-[#183D32] text-center mb-8">
          My Profile
        </h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#078641]"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#078641] text-white flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="space-y-5">

          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="font-semibold text-[#183D32] bg-gray-50 p-3 rounded-lg">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="font-semibold text-[#183D32] bg-gray-50 p-3 rounded-lg break-all">
              {user.email}
            </p>
          </div>

        </div>

        <Link
          href="/"
          className="block text-center mt-8 bg-[#078641] text-white py-3 rounded-lg font-semibold hover:bg-[#056b34] transition"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}