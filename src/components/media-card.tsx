import { getPosterUrl, getTitle, Movie, TVShow } from "@/lib/tmdb";
import { Ref } from "react";

export default function MediaCard({
  ref,
  item,
}: {
  ref: Ref<HTMLImageElement>;
  item: TVShow | Movie;
}) {
  const title = getTitle(item);
  const poster = getPosterUrl(item.poster_path);

  return (
    <img
      ref={ref}
      src={poster}
      alt={title}
      className="h-full w-[150px] md:w-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  );
}
