import {Movie} from './movie';

// Root navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetail: {
    movieId: number;
    movie?: Movie;
  };
};

// Tab navigation types
export type TabParamList = {
  Home: undefined;
  Watchlist: undefined;
};

// Home stack navigation types
export type HomeStackParamList = {
  HomeScreen: undefined;
  MovieDetail: {
    movieId: number;
    movie?: Movie;
  };
};
