"use client";

import { useQuery } from "@tanstack/react-query";
import { movieApi, tvApi } from "@/lib/tmdb";
import { useState } from "react";
import MediaList from "../../components/media-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrendingToday() {
  const [activeTab, setActiveTab] = useState("movies");

  const { data: trendingMovies = { results: [] }, isLoading: trendingLoading } =
    useQuery({
      queryKey: ["movies", "trending"],
      queryFn: movieApi.trending,
      enabled: activeTab == "movies",
    });

  const { data: trendingTv = { results: [] }, isLoading: trendingTvLoading } =
    useQuery({
      queryKey: ["tv", "trending"],
      queryFn: tvApi.trending,
      enabled: activeTab == "tv",
    });

  const currentData = {
    movies: trendingMovies.results,
    tv: trendingTv.results,
  }[activeTab];

  return (
    <div className="flex flex-col gap-8 my-20">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="border-8 rounded border-l border-primary"></div>
          <h2 className="text-3xl font-bold">Trending Today</h2>
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
