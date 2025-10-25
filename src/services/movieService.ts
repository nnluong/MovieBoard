import {MovieResponse} from '../types/movie';
import {Config} from '../config/config';

class MovieService {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${Config.TMDB_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${Config.TMDB_API_KEY}`,
          accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async getMovies(
    category: string,
    page: number = 1,
    sortBy?: string,
  ): Promise<MovieResponse> {
    let endpoint = '';
    switch (category) {
      case 'now_playing':
        endpoint = '/movie/now_playing';
        break;
      case 'upcoming':
        endpoint = '/movie/upcoming';
        break;
      case 'popular':
        endpoint = '/movie/popular';
        break;
      default:
        endpoint = '/movie/upcoming';
    }

    let tmdbSortBy;
    if (sortBy && !sortBy.startsWith('title')) {
      tmdbSortBy = sortBy;
    }

    const params = new URLSearchParams({
      language: 'en-US',
      page: page.toString(),
      ...(tmdbSortBy && {sort_by: tmdbSortBy}),
    });

    const data: MovieResponse = await this.fetchFromTMDB(
      `${endpoint}?${params}`,
    );

    // Handle client-side sorting for title
    if (sortBy?.startsWith('title')) {
      data.results = this.sortMoviesByTitle(data.results, sortBy);
    }

    return data;
  }

  private sortMoviesByTitle(movies: any[], sortBy: string) {
    return movies.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (sortBy === 'title.asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }

  async searchMovies(
    query: string,
    page: number = 1,
    sortBy?: string,
  ): Promise<MovieResponse> {
    const params = new URLSearchParams({
      language: 'en-US',
      query,
      page: page.toString(),
    });

    const data: MovieResponse = await this.fetchFromTMDB(
      `/search/movie?${params}`,
    );

    // Handle client-side sorting
    if (sortBy) {
      if (sortBy.startsWith('title')) {
        data.results = this.sortMoviesByTitle(data.results, sortBy);
      } else if (sortBy.startsWith('vote_average')) {
        data.results = this.sortMoviesByRating(data.results, sortBy);
      } else if (sortBy.startsWith('release_date')) {
        data.results = this.sortMoviesByDate(data.results, sortBy);
      }
    }

    return data;
  }

  private sortMoviesByRating(movies: any[], sortBy: string) {
    return movies.sort((a, b) => {
      if (sortBy === 'vote_average.desc') {
        return b.vote_average - a.vote_average;
      } else {
        return a.vote_average - b.vote_average;
      }
    });
  }

  private sortMoviesByDate(movies: any[], sortBy: string) {
    return movies.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      if (sortBy === 'release_date.desc') {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });
  }

  getImageUrl(posterPath: string | null, size: string = 'w500'): string {
    if (!posterPath) {
      return 'https://via.placeholder.com/300x450?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

export const movieService = new MovieService();
