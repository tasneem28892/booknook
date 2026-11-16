import HeroSlider from "./components/home/HeroSlider";
import NewArrivals from "./components/home/NewArrivals";
import HowBorrowingWorks from "./components/home/HowBorrowingWorks";
import WhyChooseUs from "./components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <HowBorrowingWorks />
      <WhyChooseUs />
    </>
  );
}