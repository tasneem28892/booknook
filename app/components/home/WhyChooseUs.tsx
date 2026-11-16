const features = [
  {
    icon: "📖",
    title: "Wide Book Collection",
    description:
      "Explore books from different categories, including fiction, science, history, and more.",
  },
  {
    icon: "⚡",
    title: "Easy Borrowing",
    description:
      "Borrow your favorite books with a simple and convenient process.",
  },
  {
    icon: "🌱",
    title: "Discover New Ideas",
    description:
      "Find new perspectives, learn new things, and grow through reading.",
  },
  {
    icon: "🤝",
    title: "Reader Friendly",
    description:
      "Enjoy a simple platform designed to make your reading journey easier.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F8F8F3] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#078641] font-semibold tracking-widest text-sm mb-3">
            THE BOOKNOOK EXPERIENCE
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#183D32]">
            Why Choose BookNook?
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            More than just a library — a place to discover,
            learn, and enjoy the world of books.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl border border-[#E5EDE5] hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <div className="w-16 h-16 rounded-xl bg-[#E5F2E8] flex items-center justify-center text-3xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-[#183D32] mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-7 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}