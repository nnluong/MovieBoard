import React, {useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {
  fetchMovies,
  loadMoreMovies,
  setCategory,
  setSortBy,
  setSearchQuery,
} from '../store/slices/movieSlice';
import {
  toggleCategoryDropdown,
  toggleSortDropdown,
  closeBothDropdowns,
} from '../store/slices/uiSlice';
import TMDBLogo from '../components/TMDBLogo';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import {Movie} from '../types/movie';

const categoryOptions = [
  {label: 'Now Playing', value: 'now_playing'},
  {label: 'Upcoming', value: 'upcoming'},
  {label: 'Popular', value: 'popular'},
];

const sortOptions = [
  {label: 'By alphabetical order', value: 'title.asc'},
  {label: 'By rating', value: 'vote_average.desc'},
  {label: 'By release date', value: 'release_date.desc'},
];

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    movies,
    currentPage,
    totalPages,
    filters,
    isLoading,
    isLoadingMore,
    error,
  } = useAppSelector(state => state.movies);
  const {isCategoryDropdownOpen, isSortDropdownOpen} = useAppSelector(
    state => state.ui,
  );

  useEffect(() => {
    loadMovies();
  }, [filters.category, filters.sortBy, filters.searchQuery]);

  const loadMovies = useCallback(() => {
    dispatch(
      fetchMovies({
        category: filters.category,
        page: 1,
        sortBy: filters.sortBy,
        query: filters.searchQuery,
      }),
    );
  }, [dispatch, filters]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      dispatch(
        loadMoreMovies({
          category: filters.category,
          page: currentPage + 1,
          sortBy: filters.sortBy,
          query: filters.searchQuery,
        }),
      );
    }
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category as any));
  };

  const handleSortChange = (sortBy: string) => {
    dispatch(setSortBy(sortBy as any));
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleMoviePress = (movie: Movie) => {
    // Handle movie selection - navigate to detail screen
    console.log('Selected movie:', movie.title);
  };

  const handleBackgroundPress = () => {
    dispatch(closeBothDropdowns());
  };

  const renderMovieItem = ({item}: {item: Movie}) => (
    <MovieCard movie={item} onPress={handleMoviePress} />
  );

  const renderLoadMoreButton = () => {
    if (currentPage >= totalPages) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={isLoadingMore}>
        {isLoadingMore ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loadMoreText}>Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onTouchStart={handleBackgroundPress}>
        <TMDBLogo />

        <View style={styles.filtersContainer}>
          <Dropdown
            label="Upcoming"
            options={categoryOptions}
            selectedValue={filters.category}
            onSelect={handleCategoryChange}
            isOpen={isCategoryDropdownOpen}
            onToggle={() => dispatch(toggleCategoryDropdown())}
          />

          <Dropdown
            label="Sort by"
            options={sortOptions}
            selectedValue={filters.sortBy}
            onSelect={handleSortChange}
            isOpen={isSortDropdownOpen}
            onToggle={() => dispatch(toggleSortDropdown())}
          />
        </View>

        <SearchBar onSearch={handleSearch} placeholder="Search..." />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#01B4E4" />
          </View>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ListFooterComponent={renderLoadMoreButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#01B4E4',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;