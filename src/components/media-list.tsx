import { getMediaType, getTitle, getYear, Movie, TVShow } from "@/lib/tmdb";
import MediaCard from "./media-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export default function MediaList({
  items,
}: {
  items: Movie[] | never[] | TVShow[] | undefined;
}) {
  const cardListRef = useRef(null);
  const cardRef = useRef<HTMLImageElement | null>(null);

  const [isRightButtonDisabled, setRightButtonDisabled] = useState(false);
  const [isLeftButtonDisabled, setLeftButtonDisabled] = useState(true);

  const handleScroll = (direction: string) => {
    if (cardListRef.current && cardRef.current) {
      const container: HTMLImageElement = cardListRef.current;
      const cardWidth = cardRef.current.clientWidth;
      const csContainer = getComputedStyle(container);
      const gap = parseFloat(csContainer.columnGap || csContainer.gap || "0");
      const step = cardWidth + gap;

      if (direction == "next") {
        if (!step) return;

        const perView = Math.max(1, Math.floor(container.clientWidth / step));
        const target = perView * step;

        console.log(target);

        container.scrollBy({ left: target, behavior: "smooth" });
      } else {
        if (!step) return;

        const perView = Math.max(1, Math.floor(container.clientWidth / step));
        const target = perView * step;

        console.log(-target);

        container.scrollBy({ left: -target, behavior: "smooth" });
      }

      setLeftButtonDisabled(container?.scrollLeft == 0);
      setRightButtonDisabled(
        container.scrollLeft == container.scrollWidth - container.clientWidth
      );
    }
  };

  return (
    <div className="relative group/card">
      <div
        ref={cardListRef}
        className="grid grid-flow-col auto-cols-max overflow-x-auto lg:overflow-x-hidden gap-4 scroll-smooth h-full"
      >
        {items?.map((media) => (
          <div className="shrink-0 flex flex-col gap-2 hover:bg-accent rounded-lg group transition-transform duration-300">
            <div className="max-w-[150px] md:max-w-[200px] h-[250px] md:h-[300px]">
              <MediaCard key={media.id} ref={cardRef} item={media} />
            </div>
            <div className="flex flex-col gap-2 max-w-[150px] md:max-w-[200px] p-2">
              <span className="font-bold">{getTitle(media)}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="text-yellow-400">★</span>{" "}
                <span className="text-sm text-black pr-2">
                  {media.vote_average.toFixed(1)}
                </span>{" "}
                {getMediaType(media)} <span className="px-2">●</span>{" "}
                {getYear(media)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isRightButtonDisabled && (
        <div
          className="absolute right-0 bottom-1/2 -translate-y-1/2 group-hover/card:bg-black/60 hidden md:flex items-center opacity-0 transition group-hover/card:opacity-100"
          onClick={() => handleScroll("next")}
        >
          <ChevronRight className="w-12 h-12 text-white" />
        </div>
      )}
      {!isLeftButtonDisabled && (
        <div
          className={`absolute left-0 bottom-1/2 -translate-y-1/2 group-hover/card:bg-black/60 hidden md:flex items-center opacity-0 transition group-hover/card:opacity-100`}
          onClick={() => handleScroll("previous")}
        >
          <ChevronLeft className="w-12 h-12 text-white" />
        </div>
      )}
    </div>
  );
}
