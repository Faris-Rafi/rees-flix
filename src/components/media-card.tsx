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
      className="rounded-lg w-[150px] md:w-[200px] h-full object-cover transition-transform duration-300 group-hover:scale-95 inset-0"
      loading="lazy"
    />
  );
}
