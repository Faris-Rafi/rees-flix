import Header from "@/components/layouts/header";
import HeroCarousel from "@/features/home/hero-carousel";
import NowPlaying from "@/features/home/now-playing";
import TopRated from "@/features/home/top-rated";
import TrendingToday from "@/features/home/trending-today";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <main className="container mt-8 px-4 lg:px-0">
        <HeroCarousel />
        <NowPlaying />
        <TrendingToday />
        <TopRated />
      </main>
    </div>
  );
}
