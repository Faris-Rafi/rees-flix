"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBackdropUrl,
  getHeroContent,
  getMediaType,
  getTitle,
  getYear,
  Movie,
  TVShow,
} from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function Carousel({
  items,
  autoplay = true,
  interval = 7000,
}: {
  items: (Movie | TVShow)[];
  autoplay?: boolean;
  interval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = items[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isPlaying || isPaused || items.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, isPlaying, isPaused, items.length]);

  // Pause on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Reduce motion support
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
  }, []);

  if (!currentItem) return null;

  const title = getTitle(currentItem);
  const year = getYear(currentItem);
  const mediaType = getMediaType(currentItem);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div
      className="relative h-[30vh] md:h-[60vh] min-h-[200px] lg:h-[70vh] w-full overflow-hidden rounded-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
        style={{
          backgroundImage: `url(${getBackdropUrl(
            currentItem.backdrop_path,
            "original"
          )})`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 text-glow animate-fade-in">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4 animate-fade-in stagger-1">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {year}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {mediaType === "Movie" ? "Movie" : "TV Show"}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white text-sm">
                {currentItem.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Overview */}
          <p className="hidden md:block text-white/90 text-sm lg:text-base mb-6 leading-relaxed animate-fade-in stagger-2">
            {truncateText(currentItem.overview, 200)}
          </p>
          <p className="text-white/90 text-sm lg:text-base mb-6 leading-relaxed animate-fade-in stagger-2">
            {truncateText(currentItem.overview, 90)}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 animate-fade-in stagger-3">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a href={`/${mediaType}/${currentItem.id}`}>
                <Play className="w-4 h-4 mr-2" />
                Details
              </a>
            </Button>

            {/* <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWatchlistToggle}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {inWatchlist ? (
                    <>
                      <Minus className="w-4 h-4 mr-2" />
                      Remove
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Watchlist
                    </>
                  )}
                </Button> */}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white border-white/20"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white border-white/20"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-6 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus-ring ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroCarousel() {
  const {
    data: heroItems = [],
    isLoading: heroLoading,
    error: heroError,
  } = useQuery({
    queryKey: ["hero-content"],
    queryFn: getHeroContent,
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      if (error?.message?.includes("API key")) return false;
      return failureCount < 3;
    },
  });

  if (!heroLoading && heroItems.length > 0) {
    return <Carousel items={heroItems} />;
  }
}
