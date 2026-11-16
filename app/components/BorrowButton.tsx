"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Props = {
  bookId: string;
  bookTitle: string;
  totalCopies: number;
};

export default function BorrowButton({
  bookId,
  bookTitle,
  totalCopies,
}: Props) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleBorrow = async () => {
    setMessage("");

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!returnDate) {
      setMessage("Please select a return date.");
      return;
    }

    if (new Date(returnDate) <= new Date(today)) {
      setMessage("Return date must be in the future.");
      return;
    }

    setLoading(true);

    try {
      // Generate JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Could not generate authentication token.");
      }

      const response = await fetch(
        "http://localhost:5000/api/borrows",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            bookId,
            userName: session.user.name,
            userEmail: session.user.email,
            returnDate,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to borrow book.");
        return;
      }

      setMessage("Book borrowed successfully!");

      setReturnDate("");

      router.refresh();
    } catch (error) {
      console.error(error);
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
    return <p className="text-gray-500">Checking login...</p>;
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-semibold text-[#183D32] mb-2">
        Select Return Date
      </label>

      <input
        type="date"
        value={returnDate}
        min={today}
        onChange={(e) => setReturnDate(e.target.value)}
        className="input input-bordered w-full mb-4"
      />

      <button
        onClick={handleBorrow}
        disabled={loading || totalCopies <= 0}
        className="btn w-full border-none bg-[#078641] text-white hover:bg-[#056b33] disabled:bg-gray-400"
      >
        {loading
          ? "Borrowing..."
          : totalCopies <= 0
          ? "Currently Unavailable"
          : "Borrow This Book"}
      </button>

      {message && (
        <p className="mt-3 text-sm font-medium text-[#078641]">
          {message}
        </p>
      )}

      {!session?.user && (
        <p className="mt-2 text-xs text-gray-500">
          Please login to borrow this book.
        </p>
      )}
    </div>
  );
}