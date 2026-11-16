
import Link from "next/link";
import { notFound } from "next/navigation";
import BorrowButton from "@/app/components/BorrowButton";

export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
};

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;

  let book: Book | null = null;

  try {
    const response = await fetch(
      `http://localhost:5000/api/books/${id}`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch book");
    }

    const result = await response.json();

    book = result.data;
  } catch (error) {
    console.error("Book details error:", error);
    throw error;
  }

  if (!book) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-[#F8F8F3] py-16">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Link
          href="/books"
          className="inline-block text-[#078641] font-semibold mb-10 hover:underline"
        >
          ← Back to All Books
        </Link>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* Book Image */}
          <div className="bg-[#E8EEE8] min-h-[400px]">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Information */}
          <div className="p-8 md:p-12 flex flex-col justify-center">

            <span className="inline-block w-fit px-4 py-2 bg-[#E5F2E8] text-[#078641] text-sm font-semibold rounded-full mb-6">
              {book.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-[#183D32] mb-4">
              {book.title}
            </h1>

            <p className="text-gray-500 mb-8">
              Written by{" "}
              <span className="font-semibold text-[#183D32]">
                {book.author}
              </span>
            </p>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold text-[#183D32] mb-3">
                About This Book
              </h2>

              <p className="text-gray-500 leading-8">
                {book.description}
              </p>
            </div>

            {/* Available Copies */}
            <div className="mt-8 p-4 bg-[#F8F8F3] rounded-xl">
              <p className="text-sm text-gray-500">
                Available Copies:{" "}
                <span className="font-semibold text-[#183D32]">
                  {book.totalCopies}
                </span>
              </p>
            </div>

            {/* Borrow Button */}
            <BorrowButton
              bookId={book._id}
              bookTitle={book.title}
              totalCopies={book.totalCopies}
            />

          </div>
        </div>
      </div>
    </section>
  );
}
