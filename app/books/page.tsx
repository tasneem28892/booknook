"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const result = await response.json();
        setBooks(result.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Could not load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Edit Book
  const handleUpdateBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook) return;

    setSaving(true);
    setMessage("");

    try {
      // Generate JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      const response = await fetch(
        `http://localhost:5000/api/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            title: editingBook.title,
            author: editingBook.author,
            category: editingBook.category,
            image: editingBook.image,
            description: editingBook.description,
            totalCopies: editingBook.totalCopies,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update book");
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === editingBook._id ? editingBook : book
        )
      );

      setEditingBook(null);
      setMessage("Book updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      // Generate JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete book");
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== id)
      );

      setMessage("Book deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  return (
    <section className="min-h-screen bg-[#F8F8F3] py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Page Heading */}
        <div className="text-center mb-12">
          <p className="text-[#078641] font-semibold tracking-widest text-sm mb-3">
            EXPLORE OUR LIBRARY
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#183D32]">
            All Books
          </h1>

          <p className="text-gray-500 mt-4">
            Discover your next favorite book from our collection.
          </p>
        </div>

        {/* Success / Error Message */}
        {message && (
          <div className="text-center mb-6 font-semibold text-[#078641]">
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-3 text-gray-500"
            >
              ✕
            </button>
          </div>
        )}

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-[#078641] text-white"
                  : "bg-white text-[#183D32] hover:bg-[#E5F2E8]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Edit Book Form */}
        {editingBook && (
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#183D32] mb-6">
              Edit Book
            </h2>

            <form onSubmit={handleUpdateBook} className="space-y-4">

              <input
                type="text"
                required
                placeholder="Book Title"
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              />

              <input
                type="text"
                required
                placeholder="Author"
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, author: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              />

              <select
                required
                value={editingBook.category}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, category: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              >
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <input
                type="url"
                required
                placeholder="Image URL"
                value={editingBook.image}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, image: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              />

              <textarea
                required
                placeholder="Book Description"
                value={editingBook.description}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              />

              <input
                type="number"
                required
                min="0"
                placeholder="Total Copies"
                value={editingBook.totalCopies}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    totalCopies: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#078641]"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#078641] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#056d34] disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Book"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-[#078641] font-semibold">
            Loading books...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 text-red-500">
            {error}
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <p className="text-center py-16 text-gray-500">
                No books found in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
                  >
                    <div className="h-64 overflow-hidden bg-[#E8EEE8]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-[#E5F2E8] text-[#078641] text-xs font-semibold rounded-full mb-4">
                        {book.category}
                      </span>

                      <h2 className="text-xl font-bold text-[#183D32] mb-2">
                        {book.title}
                      </h2>

                      <p className="text-gray-500 text-sm mb-3">
                        By {book.author}
                      </p>

                      <p className="text-gray-500 text-sm leading-6 mb-3">
                        {book.description}
                      </p>

                      <p className="text-sm font-semibold text-[#078641] mb-5">
                        Available Copies: {book.totalCopies}
                      </p>

                      <Link
                        href={`/books/${book._id}`}
                        className="block text-center border border-[#078641] text-[#078641] py-2.5 rounded-lg font-semibold hover:bg-[#078641] hover:text-white transition mb-3"
                      >
                        View Details →
                      </Link>

                      {/* Edit and Delete Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setEditingBook({ ...book });
                            setMessage("");
                          }}
                          className="bg-[#E5F2E8] text-[#078641] py-2.5 rounded-lg font-semibold hover:bg-[#cce8d3] transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-red-50 text-red-600 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}