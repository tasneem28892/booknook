"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email and password login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setMessage("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setMessage(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch {
      setMessage("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f3] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-[#183d32]">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500">
            Login to continue exploring BookNook.
          </p>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

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
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-[#078641] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn w-full border-none bg-[#078641] text-white hover:bg-[#056b33]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="btn w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <span className="font-bold text-lg">G</span>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#078641] hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}