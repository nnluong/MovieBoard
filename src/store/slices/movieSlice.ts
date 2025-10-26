import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Movie, MovieResponse, FilterState} from '../../types/movie';
import {movieService} from '../../services/movieService';

// Async thunks
export const fetchMovies = createAsyncThunk<
  MovieResponse,
  {category: string; page?: number; sortBy?: string; query?: string}
>('movies/fetchMovies', async ({category, page = 1, sortBy, query}) => {
  if (query) {
    return movieService.searchMovies(query, page, sortBy);
  }
  return movieService.getMovies(category, page, sortBy);
});

export const loadMoreMovies = createAsyncThunk<
  MovieResponse,
  {category: string; page: number; sortBy?: string; query?: string}
>('movies/loadMoreMovies', async ({category, page, sortBy, query}) => {
  if (query) {
    return movieService.searchMovies(query, page, sortBy);
  }
  return movieService.getMovies(category, page, sortBy);
});

interface MovieState {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  filters: FilterState;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  filters: {
    category: 'now_playing',
    sortBy: 'title.asc',
    searchQuery: '',
  },
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<FilterState['category']>) => {
      state.filters.category = action.payload;
      state.movies = [];
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.filters.sortBy = action.payload;
      state.movies = [];
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.movies = [];
      state.currentPage = 1;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.results;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.totalResults = action.payload.total_results;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Load more movies
      .addCase(loadMoreMovies.pending, state => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreMovies.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.movies = [...state.movies, ...action.payload.results];
        state.currentPage = action.payload.page;
      })
      .addCase(loadMoreMovies.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.error.message || 'Failed to load more movies';
      });
  },
});

export const {setCategory, setSortBy, setSearchQuery, clearError} =
  movieSlice.actions;
export default movieSlice.reducer;