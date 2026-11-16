"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Every Book Holds a New Adventure.",
    description:
      "Discover amazing stories, explore new ideas, and find your next favorite book in our growing library.",
    button: "Browse Books",
    number: "01",
    color: "from-[#183D32] to-[#28634C]",
    icon: "📚",
  },
  {
    subtitle: "DISCOVER SOMETHING NEW",
    title: "Find Stories That Stay With You.",
    description:
      "From timeless classics to exciting discoveries, there is always something waiting for you.",
    button: "Explore Collection",
    number: "02",
    color: "from-[#344C70] to-[#526F98]",
    icon: "📖",
  },
  {
    subtitle: "READ. SHARE. REPEAT.",
    title: "A Community Built Around Books.",
    description:
      "Share your favorite books, borrow interesting reads, and connect through the joy of reading.",
    button: "Start Exploring",
    number: "03",
    color: "from-[#73533B] to-[#A77A50]",
    icon: "✨",
  },
];

export default function HeroSlider() {

  // Initially, Swiper will not render
  const [isMounted, setIsMounted] = useState(false);

  // After the page loads in the browser, render Swiper
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="bg-[#F8F8F3] py-8 md:py-12">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {!isMounted ? (
          // Temporary loading area
          <div className="min-h-[430px] md:min-h-[500px] rounded-3xl bg-[#183D32] animate-pulse" />
        ) : (

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            className="hero-swiper rounded-3xl overflow-hidden shadow-xl"
          >

            {slides.map((slide) => (
              <SwiperSlide key={slide.number}>

                <div
                  className={`relative min-h-[430px] md:min-h-[500px] bg-gradient-to-r ${slide.color} text-white flex flex-col md:flex-row items-center justify-between px-8 py-12 md:px-16`}
                >

                  {/* Left Content */}
                  <div className="max-w-xl text-center md:text-left">

                    <p className="text-sm tracking-[3px] font-semibold text-white/70 mb-5">
                      {slide.subtitle}
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                      {slide.title}
                    </h1>

                    <p className="text-white/80 text-base md:text-lg leading-8 mb-8">
                      {slide.description}
                    </p>

                    <Link
                      href="/books"
                      className="inline-block bg-white text-[#183D32] px-8 py-3 rounded-lg font-bold hover:bg-[#D8E8DC] transition"
                    >
                      {slide.button} →
                    </Link>

                  </div>

                  {/* Right Decoration */}
                  <div className="mt-12 md:mt-0 flex justify-center items-center">

                    <div className="w-56 h-64 md:w-72 md:h-80 bg-white/10 border border-white/20 rounded-3xl flex flex-col justify-center items-center backdrop-blur-sm shadow-2xl">

                      <span className="text-8xl md:text-9xl">
                        {slide.icon}
                      </span>

                      <p className="mt-6 text-white/80 tracking-[4px] text-sm">
                        BOOKNOOK
                      </p>

                      <span className="mt-3 text-white/50 text-xs">
                        YOUR ONLINE LIBRARY
                      </span>

                    </div>

                  </div>

                  {/* Slide Number */}
                  <span className="absolute bottom-5 right-8 text-white/50 text-sm">
                    {slide.number} / 03
                  </span>

                </div>

              </SwiperSlide>
            ))}

          </Swiper>

        )}

      </div>

    </section>
  );
}