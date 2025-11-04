import { env } from "./env"

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
}

export interface TVDetails extends TVShow {
  genres: { id: number; name: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: any[];
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
    try {
        const apiKey = env.NEXT_PUBLIC_TMDB_BEARER;
        const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US&region=US`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch(error) {
        console.error('TMDB API Error:', error);
        throw error
    }
}

export function getImageUrl(path: string | null, size: 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getPosterUrl(path: string | null): string {
    return getImageUrl(path, 'w342')
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
    return getImageUrl(path, size)
}

export const movieApi = {
  trending: () => fetchFromTMDB<TMDBResponse<Movie>>('/trending/movie/day'),
  popular: () => fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular'),
  nowPlaying: () => fetchFromTMDB<TMDBResponse<Movie>>('/movie/now_playing'),
  topRated: () => fetchFromTMDB<TMDBResponse<Movie>>('/movie/top_rated'),
  details: (id: number) => fetchFromTMDB<MovieDetails>(`/movie/${id}`),
  similar: (id: number) => fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${id}/similar`),
  credits: (id: number) => fetchFromTMDB<CreditsResponse>(`/movie/${id}/credits`),
  videos: (id: number) => fetchFromTMDB<VideosResponse>(`/movie/${id}/videos`),
  search: (query: string, page = 1) => fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`),
};

export const tvApi = {
  trending: () => fetchFromTMDB<TMDBResponse<TVShow>>('/trending/tv/day'),
  popular: () => fetchFromTMDB<TMDBResponse<TVShow>>('/tv/popular'),
  onTheAir: () => fetchFromTMDB<TMDBResponse<TVShow>>('/tv/on_the_air'),
  topRated: () => fetchFromTMDB<TMDBResponse<TVShow>>('/tv/top_rated'),
  details: (id: number) => fetchFromTMDB<TVDetails>(`/tv/${id}`),
  similar: (id: number) => fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${id}/similar`),
  credits: (id: number) => fetchFromTMDB<CreditsResponse>(`/tv/${id}/credits`),
  videos: (id: number) => fetchFromTMDB<VideosResponse>(`/tv/${id}/videos`),
  search: (query: string, page = 1) => fetchFromTMDB<TMDBResponse<TVShow>>(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`),
};

export async function getHeroContent(): Promise<(Movie | TVShow)[]> {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      movieApi.trending(),
      tvApi.trending()
    ]);
    
    const allContent = [...moviesResponse.results, ...tvResponse.results];
    
    const heroContent = allContent
      .filter(item => item.backdrop_path && item.vote_average >= 6.8)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
    
    return heroContent;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return [];
  }
}

export function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item;
}

export function getTitle(item: Movie | TVShow): string {
  return isMovie(item) ? item.title : item.name;
}

export function getYear(item: Movie | TVShow): string {
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  return date ? new Date(date).getFullYear().toString() : '';
}

export function getMediaType(item: Movie | TVShow): 'Movie' | 'Series' {
  return isMovie(item) ? 'Movie' : 'Series';
}