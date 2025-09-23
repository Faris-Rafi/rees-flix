import { getPosterUrl, getTitle, Movie, TVShow } from "@/lib/tmdb";

export default function MediaCard({ item }: { item: TVShow | Movie }) {
  const title = getTitle(item);
  const poster = getPosterUrl(item.poster_path);

  return (
    <img
      src={poster}
      alt={title}
      className="h-full w-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  );
}
