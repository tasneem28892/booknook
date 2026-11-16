"use client";

import { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  image: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

export default function MyBorrows() {
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchBorrows = async () => {
    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      const response = await fetch(`${API}/api/borrows/user`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load borrowed books.");
      }

      setBorrows(result.data || []);
    } catch (error) {
      console.error("Failed to fetch borrows:", error);
      setMessage("Could not load your borrowed books.");
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

    fetchBorrows();
  }, [isPending, session?.user?.email]);

  const handleReturn = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    setReturningId(id);
    setMessage("");

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      const response = await fetch(`${API}/api/borrows/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to return book.");
      }

      setBorrows((prev) =>
        prev.filter((borrow) => borrow._id !== id)
      );

      setMessage("Book returned successfully!");
    } catch (error) {
      console.error("Return error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#078641]">
        Loading your borrowed books...
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
            YOUR READING LIST
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#183D32]">
            My Borrows
          </h1>

          <p className="text-gray-500 mt-3">
            Keep track of the books you have borrowed.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-[#E5F2E8] text-[#078641] flex justify-between">
            {message}

            <button onClick={() => setMessage("")}>
              ✕
            </button>
          </div>
        )}

        {borrows.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[#183D32]">
              No Borrowed Books
            </h2>

            <p className="text-gray-500 mt-3">
              You haven't borrowed any books yet.
            </p>

            <a
              href="/books"
              className="inline-block mt-6 bg-[#078641] text-white px-7 py-3 rounded-lg"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#E5F2E8] text-[#183D32]">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Borrow Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.map((borrow) => (
                  <tr key={borrow._id} className="border-b">
                    <td className="p-4">
                      <img
                        src={borrow.image}
                        alt={borrow.bookTitle}
                        className="w-14 h-20 object-cover rounded-lg"
                      />
                    </td>

                    <td className="p-4 font-semibold text-[#183D32]">
                      {borrow.bookTitle}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(borrow.returnDate).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        disabled={returningId === borrow._id}
                        className="bg-[#078641] text-white px-4 py-2 rounded-lg hover:bg-[#056b34] disabled:opacity-50"
                      >
                        {returningId === borrow._id
                          ? "Returning..."
                          : "Return Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}