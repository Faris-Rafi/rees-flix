import { Movie, TVShow } from "@/lib/tmdb";
import MediaCard from "./media-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MediaList({
  items,
}: {
  items: Movie[] | never[] | TVShow[] | undefined;
}) {
  const cardListRef = useRef(null);
  const cardRef = useRef(null);

  const [isRightButtonDisabled, setRightButtonDisabled] = useState(false);
  const [isLeftButtonDisabled, setLeftButtonDisabled] = useState(true);

  const handleScroll = (direction: string) => {
    if (cardListRef.current && cardRef.current) {
      const container = cardListRef.current;
      const cardWidth = cardRef.current.clientWidth;
      const csContainer = getComputedStyle(container);
      const gap = parseFloat(csContainer.columnGap || csContainer.gap || "0");
      const step = cardWidth + gap;

      if (direction == "next") {
        if (!step) return;

        const perView = Math.max(1, Math.floor(container.clientWidth / step));
        const target = perView * step;

        container.scrollBy({ left: target, behavior: "smooth" });
      } else {
        if (!step) return;

        const perView = Math.max(1, Math.floor(container.clientWidth / step));
        const target = perView * step;

        container.scrollBy({ left: -target, behavior: "smooth" });
      }

      setLeftButtonDisabled(container?.scrollLeft == 0);
      setRightButtonDisabled(
        container.scrollLeft == container.scrollWidth - container.clientWidth
      );
    }
  };

  return (
    <div className="relative">
      <div
        ref={cardListRef}
        className="flex items-center overflow-x-auto lg:overflow-x-hidden gap-4 scroll-smooth"
      >
        {items?.map((media) => (
          <MediaCard key={media.id} ref={cardRef} item={media} />
        ))}
      </div>
      {!isRightButtonDisabled && (
        <div
          className="absolute right-0 top-0 hover:bg-black/60 h-full hidden md:flex items-center opacity-0 transition hover:opacity-100"
          onClick={() => handleScroll("next")}
        >
          <ChevronRight className="w-14 h-14 text-white" />
        </div>
      )}
      {!isLeftButtonDisabled && (
        <div
          className={`absolute left-0 top-0 hover:bg-black/60 h-full hidden md:flex items-center opacity-0 transition hover:opacity-100`}
          onClick={() => handleScroll("previous")}
        >
          <ChevronLeft className="w-14 h-14 text-white" />
        </div>
      )}
    </div>
  );
}
