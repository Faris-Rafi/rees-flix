"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import MediaList from "../../components/media-list";
import { useQuery } from "@tanstack/react-query";
import { movieApi, tvApi } from "@/lib/tmdb";

export default function NowPlaying() {
  const [activeTab, setActiveTab] = useState("movies");

  const {
    data: nowPlayingMovies = { results: [] },
    isLoading: trendingLoading,
  } = useQuery({
    queryKey: ["movies", "now-playing"],
    queryFn: movieApi.nowPlaying,
    enabled: activeTab == "movies",
  });

  const { data: onTheAirTv = { results: [] }, isLoading: trendingTvLoading } =
    useQuery({
      queryKey: ["tv", "on-the-air"],
      queryFn: tvApi.onTheAir,
      enabled: activeTab == "tv",
    });

  const currentData = {
    movies: nowPlayingMovies.results,
    tv: onTheAirTv.results,
  }[activeTab];

  return (
    <div className="flex flex-col gap-8 my-20">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="border-8 rounded border-l border-primary"></div>
          <h2 className="text-3xl font-bold">
            {activeTab == "movies" ? "Now Playing" : "On The Air"}
          </h2>
        </div>
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger
              value="movies"
              onClick={() => setActiveTab("movies")}
              className="[state=active]:bg-primary"
            >
              Movies
            </TabsTrigger>
            <TabsTrigger value="tv" onClick={() => setActiveTab("tv")}>
              Series
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <MediaList items={currentData} />
    </div>
  );
}
