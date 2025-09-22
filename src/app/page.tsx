import Header from "@/components/layouts/header";
import HeroCarousel from "@/features/home/hero-carousel";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <main className="container w-full mt-8">
        <HeroCarousel />
      </main>
    </div>
  );
}
