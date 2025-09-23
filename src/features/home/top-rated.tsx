"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import MediaList from "../../components/media-list";
import { useQuery } from "@tanstack/react-query";
import { movieApi, tvApi } from "@/lib/tmdb";

export default function TopRated() {
  const [activeTab, setActiveTab] = useState("movies");

  const { data: ratedMovies = { results: [] }, isLoading: trendingLoading } =
    useQuery({
      queryKey: ["movies", "top-rated"],
      queryFn: movieApi.topRated,
      enabled: activeTab == "movies",
    });

  const { data: ratedTv = { results: [] }, isLoading: trendingTvLoading } =
    useQuery({
      queryKey: ["tv", "top-rated"],
      queryFn: tvApi.topRated,
      enabled: activeTab == "tv",
    });

  const currentData = {
    movies: ratedMovies.results,
    tv: ratedTv.results,
  }[activeTab];

  return (
    <div className="flex flex-col gap-8 my-20">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="border-8 rounded border-l border-primary"></div>
          <h2 className="text-3xl font-bold">Top Rated</h2>
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
