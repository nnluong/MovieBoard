// Movie related types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

// Genre interface
export interface Genre {
  id: number;
  name: string;
}

// Cast member interface
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

// Crew member interface
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// Movie credits interface
export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

// Detailed movie interface
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  runtime: number | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  spoken_languages: Array<{
    iso_639_1: string;
    name: string;
  }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Filter types
export interface FilterState {
  category: 'now_playing' | 'upcoming' | 'popular';
  sortBy:
    | 'title.asc'
    | 'title.desc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'release_date.desc'
    | 'release_date.asc';
  searchQuery: string;
}

// UI state types
export interface UIState {
  isCategoryDropdownOpen: boolean;
  isSortDropdownOpen: boolean;
  isLoading: boolean;
  error: string | null;
}