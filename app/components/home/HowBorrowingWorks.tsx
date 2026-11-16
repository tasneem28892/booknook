const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Discover Books",
    description:
      "Explore our collection and find books that match your interests.",
  },
  {
    number: "02",
    icon: "📚",
    title: "Borrow Your Book",
    description:
      "Choose your favorite book and borrow it with just a few clicks.",
  },
  {
    number: "03",
    icon: "💚",
    title: "Enjoy & Return",
    description:
      "Enjoy reading your book and return it before the due date.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#078641] font-semibold tracking-widest text-sm mb-3">
            SIMPLE & EASY
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#183D32]">
            How Borrowing Works
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Getting your next favorite book is easier than ever.
            Just follow these three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative text-center p-8 rounded-2xl bg-[#F8F8F3] hover:shadow-lg transition duration-300"
            >
              <span className="absolute top-5 right-6 text-sm font-bold text-[#078641]/40">
                {step.number}
              </span>

              <div className="w-20 h-20 mx-auto rounded-full bg-[#E5F2E8] flex items-center justify-center text-4xl mb-6">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-[#183D32] mb-3">
                {step.title}
              </h3>

              <p className="text-gray-500 leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}