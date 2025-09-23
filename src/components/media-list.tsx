import { Movie, TVShow } from "@/lib/tmdb";
import MediaCard from "./media-card";

export default function MediaList({
  items,
}: {
  items: Movie[] | never[] | TVShow[] | undefined;
}) {
  return (
    <div className="flex items-center overflow-x-auto gap-4">
      {items?.map((media) => (
        <MediaCard key={media.id} item={media} />
      ))}
    </div>
  );
}
