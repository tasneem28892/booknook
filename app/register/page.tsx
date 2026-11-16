"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    // Password validation
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setMessage("Password must contain a lowercase letter.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        setMessage(error.message || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f3] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-[#183d32]">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Join BookNook and discover your next favorite book.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Profile Photo URL
            </label>

            <input
              type="url"
              placeholder="Enter your photo URL"
              className="input input-bordered w-full"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p className="mt-1 text-xs text-gray-500">
              At least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn w-full border-none bg-[#078641] text-white hover:bg-[#056b33]"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#078641] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}