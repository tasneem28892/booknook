
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/books`
        );

        const result = await response.json();

        if (result.success) {
          setBooks((result.data || []).slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="bg-[#F8F8F3] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <p className="text-[#078641] font-semibold tracking-widest text-sm mb-3">
              FRESH FROM THE SHELF
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#183D32]">
              New Arrivals
            </h2>

            <p className="text-gray-500 mt-3">
              Explore the latest additions to our library.
            </p>
          </div>

          <Link
            href="/books"
            className="text-[#078641] font-semibold hover:underline"
          >
            Explore all books →
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[#078641]">
            Loading new arrivals...
          </p>
        ) : books.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            No books available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {books.map((book) => (
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

                  <h3 className="text-xl font-bold text-[#183D32] mb-2">
                    {book.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-5">
                    By {book.author}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="block text-center border border-[#078641] text-[#078641] py-2.5 rounded-lg font-semibold hover:bg-[#078641] hover:text-white transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/books"
            className="inline-block bg-[#078641] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#056b34] transition"
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
}
