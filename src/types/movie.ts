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