
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
  totalCopies: number;
}

export default function MyBooks() {
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    totalCopies: 1,
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchMyBooks = async () => {
    try {
      const response = await fetch(`${API}/api/books`);
      const result = await response.json();

      if (result.success) {
        const myBooks = result.data.filter(
          (book: Book) =>
            book.userEmail === session?.user?.email
        );

        setBooks(myBooks);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setMessage("Could not load your books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    fetchMyBooks();
  }, [isPending, session?.user?.email]);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);

    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBook) return;

    try {
      const response = await fetch(
        `${API}/api/books/${selectedBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage("Book updated successfully!");
        setSelectedBook(null);
        fetchMyBooks();
      } else {
        setMessage(result.message || "Failed to update book.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating.");
    }
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;

    try {
      const response = await fetch(
        `${API}/api/books/${deleteBookId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        setBooks((prev) =>
          prev.filter((book) => book._id !== deleteBookId)
        );

        setMessage("Book deleted successfully!");
      } else {
        setMessage(result.message || "Failed to delete book.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting.");
    } finally {
      setDeleteBookId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#078641]">
        Loading your books...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-[#183D32]">
          Please Login First
        </h2>
        <a
          href="/login"
          className="bg-[#078641] text-white px-6 py-3 rounded-lg"
        >
          Login
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F3] py-16 px-5">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-[#078641] font-semibold tracking-widest text-sm mb-3">
            YOUR COLLECTION
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#183D32]">
            My Books
          </h1>

          <p className="text-gray-500 mt-3">
            Manage the books you have added to BookNook.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-[#E5F2E8] text-[#078641] flex justify-between">
            {message}
            <button onClick={() => setMessage("")}>✕</button>
          </div>
        )}

        {books.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[#183D32]">
              No Books Added Yet
            </h2>
            <p className="text-gray-500 mt-3">
              Start building your collection by adding a book.
            </p>
            <a
              href="/add-book"
              className="inline-block mt-6 bg-[#078641] text-white px-7 py-3 rounded-lg"
            >
              Add a Book
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#E5F2E8] text-[#183D32]">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Copies</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b">
                    <td className="p-4">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-14 h-20 object-cover rounded-lg"
                      />
                    </td>

                    <td className="p-4 font-semibold text-[#183D32]">
                      {book.title}
                    </td>

                    <td className="p-4 text-gray-600">
                      {book.author}
                    </td>

                    <td className="p-4 text-gray-600">
                      {book.category}
                    </td>

                    <td className="p-4">
                      {book.totalCopies}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="bg-[#078641] text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteBookId(book._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-[#183D32] mb-6">
              Edit Book
            </h2>

            <div className="space-y-4">
              {[
                ["title", "Book Title"],
                ["author", "Author Name"],
                ["category", "Category"],
                ["image", "Image URL"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block mb-2 text-sm font-semibold">
                    {label}
                  </label>
                  <input
                    required
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 outline-none focus:border-[#078641]"
                  />
                </div>
              ))}

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Description
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Total Copies
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.totalCopies}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalCopies: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                type="submit"
                className="flex-1 bg-[#078641] text-white py-3 rounded-lg"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBookId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-[#183D32]">
              Delete This Book?
            </h2>

            <p className="text-gray-500 mt-3">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-7">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDeleteBookId(null)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
