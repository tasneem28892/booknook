import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#183D32] text-white">

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Website Info */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              📚 BookNook
            </Link>

            <p className="text-gray-300 mt-4 leading-7 max-w-sm">
              Discover new stories, explore different worlds,
              and share your love of reading with BookNook.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-gray-300">

              <Link href="/" className="hover:text-white">
                Home
              </Link>

              <Link href="/books" className="hover:text-white">
                All Books
              </Link>

              <Link href="/login" className="hover:text-white">
                Login
              </Link>

              <Link href="/register" className="hover:text-white">
                Register
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="flex flex-col gap-3 text-gray-300">

              <p>Email: hello@booknook.com</p>

              <p>Location: Bangladesh</p>

              <div className="flex gap-5 mt-2">

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Facebook
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  X
                </a>

              </div>

            </div>
          </div>

        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-gray-300 text-sm">

         © 2026 BookNook. All rights reserved.
        </div>

      </div>

    </footer>
  );
}