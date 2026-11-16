
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const { data: session, isPending } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    image: "",
    totalCopies: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Get JWT Token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      // Send Book Data with JWT Token
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          ...formData,
          totalCopies: Number(formData.totalCopies),
          userName: session.user.name,
          userEmail: session.user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Book added successfully!");

        setFormData({
          title: "",
          author: "",
          category: "",
          description: "",
          image: "",
          totalCopies: "",
        });
      } else {
        setMessage(data.message || "Failed to add book.");
      }
    } catch (error) {
      console.error("Add book error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-700 mb-4">
          Please login to add a book.
        </p>

        <Link href="/login" className="text-indigo-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-indigo-600 font-medium hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add a New Book
          </h1>

          <p className="text-gray-500 mb-8">
            Fill in the details to add a book to your library.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Book Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Author
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Romance">Romance</option>
                <option value="Mystery">Mystery</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Book Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Enter image URL"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total Copies
              </label>

              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="Enter total copies"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Write a short description..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {message && (
              <p className="text-sm font-medium text-indigo-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
