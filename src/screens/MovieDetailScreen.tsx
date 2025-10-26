import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {MovieDetail, CastMember, CrewMember} from '../types/movie';
import {movieService} from '../services/movieService';
import {formatRuntime, formatRating, getRatingColor} from '../utils/movieUtils';
import TMDBLogo from '../components/TMDBLogo';
import SvgIcon from '../components/SvgIcon';

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;
type MovieDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MovieDetail'
>;

const MovieDetailScreen: React.FC = () => {
  const route = useRoute<MovieDetailRouteProp>();
  const navigation = useNavigation<MovieDetailNavigationProp>();
  const {movieId} = route.params;

  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovieDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [detailData, creditsData] = await Promise.all([
        movieService.getMovieDetail(movieId),
        movieService.getMovieCredits(movieId),
      ]);

      setMovieDetail(detailData);
      setCast(creditsData.cast.slice(0, 20)); // Limit to first 20 cast members
      setCrew(creditsData.crew);
    } catch (err) {
      setError('Failed to load movie details');
      console.error('Error loading movie detail:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovieDetail();
  }, [loadMovieDetail]);

  const getDirectors = (): CrewMember[] => {
    return crew.filter(member => member.job === 'Director');
  };

  const getWriters = (): CrewMember[] => {
    return crew.filter(member =>
      ['Writer', 'Screenplay', 'Story'].includes(member.job),
    );
  };

  const getCertification = (): string => {
    // This would typically come from release dates API call
    // For now, returning a placeholder based on adult flag
    if (movieDetail?.adult) {
      return 'R';
    }
    return 'PG-13';
  };

  const formatDateSG = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} (SG)`;
  };

  const renderCastMember = ({item}: {item: CastMember}) => (
    <View style={styles.castMember}>
      <Image
        source={{
          uri: item.profile_path
            ? movieService.getImageUrl(item.profile_path, 'w185')
            : 'https://via.placeholder.com/185x278?text=No+Image',
        }}
        style={styles.castImage}
        resizeMode="cover"
      />
      <View style={styles.castInfo}>
        <Text style={styles.castName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.castCharacter} numberOfLines={2}>
          {item.character}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#032541" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#01B4E4" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movieDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#032541" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadMovieDetail}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const directors = getDirectors();
  const writers = getWriters();
  const releaseYear = new Date(movieDetail.release_date).getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7596" />
      {/* TMDB Logo */}
      <TMDBLogo />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View style={styles.backChevron}>
            <SvgIcon name="chevron-right" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {movieDetail.title}{' '}
            <Text style={styles.headerYear}>({releaseYear})</Text>
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Movie Info Header */}
        <View style={styles.movieHeader}>
          <Image
            source={{
              uri: movieService.getImageUrl(movieDetail.poster_path, 'w500'),
            }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.movieInfo}>
            <View style={styles.metaInfo}>
              <View style={styles.certification}>
                <Text style={styles.certificationText}>
                  {getCertification()}
                </Text>
              </View>
            </View>
            <View style={styles.metaInfo}>
              <Text style={styles.releaseDate}>
                {formatDateSG(movieDetail.release_date)}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.runtime}>
                {formatRuntime(movieDetail.runtime)}
              </Text>
            </View>
            <Text style={styles.genres}>
              {movieDetail.genres.map(genre => genre.name).join(', ')}
            </Text>

            <Text style={styles.status}>
              <Text style={styles.statusLabel}>Status: </Text>
              {movieDetail.status}
            </Text>

            <Text style={styles.originalLanguage}>
              <Text style={styles.statusLabel}>Original Language: </Text>
              {movieDetail.original_language.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Movie Details Section */}
        <View style={styles.movieDetailsSection}>
          {/* User Score and Credits */}
          <View style={styles.userScoreSection}>
            <View style={styles.scoreContainer}>
              <View
                style={[
                  styles.scoreCircle,
                  {
                    borderColor: getRatingColor(movieDetail.vote_average),
                  },
                ]}>
                <Text
                  style={[
                    styles.scoreText,
                    {
                      color: getRatingColor(movieDetail.vote_average),
                    },
                  ]}>
                  {formatRating(movieDetail.vote_average)}
                </Text>
              </View>
              <Text style={styles.userScoreLabel}>User Score</Text>
            </View>
            {/* Credits Section */}
            <View style={styles.creditsContainer}>
              {directors.length > 0 && (
                <View style={styles.creditItem}>
                  <Text style={styles.creditName}>
                    {directors.map(d => d.name).join(', ')}
                  </Text>
                  <Text style={styles.creditRole}>Director, Writer</Text>
                </View>
              )}
              {writers.length > 0 && (
                <View style={styles.creditItem}>
                  <Text style={styles.creditName}>
                    {writers.map(w => w.name).join(', ')}
                  </Text>
                  <Text style={styles.creditRole}>Writer</Text>
                </View>
              )}
            </View>
          </View>

          {/* Tagline */}
          {movieDetail.tagline && (
            <View style={styles.taglineSection}>
              <Text style={styles.tagline}>{movieDetail.tagline}</Text>
            </View>
          )}

          {/* Overview */}
          <View style={styles.overviewSection}>
            <Text style={styles.overviewTitle}>Overview</Text>
            <Text style={styles.overviewText}>{movieDetail.overview}</Text>
          </View>

          {/* Add to Watchlist Button */}
          <View style={styles.watchlistSection}>
            <TouchableOpacity style={styles.watchlistButton}>
              <SvgIcon name="watchlist" size={20} color="#ffffff" />
              <Text style={styles.watchlistText}>Add To Watchlist</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cast Section */}
        {cast.length > 0 && (
          <View style={styles.castSection}>
            <Text style={styles.sectionTitle}>Top Billed Cast</Text>
            <FlatList
              data={cast}
              renderItem={renderCastMember}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0d7596',
    position: 'relative',
  },
  headerTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    padding: 4,
  },
  backChevron: {
    transform: [{rotate: '180deg'}],
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerYear: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0d7596',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#01B4E4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  movieHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#0d7596',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 20,
    color: '#ccc',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  certification: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFFFFFB2',
  },
  certificationText: {
    color: '#FFFFFFB2',
    fontSize: 12,
    fontWeight: '400',
  },
  releaseDate: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
    fontWeight: '400',
  },
  dot: {
    color: '#ccc',
    marginRight: 8,
  },
  runtime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  genres: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  status: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  originalLanguage: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  statusLabel: {
    fontWeight: 'bold',
  },
  creditsSection: {
    marginBottom: 8,
  },
  creditsLabel: {
    color: '#01B4E4',
    fontSize: 14,
    fontWeight: 'bold',
  },
  creditsNames: {
    color: '#fff',
    fontSize: 14,
  },
  movieDetailsSection: {
    backgroundColor: '#4fa8c5',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userScoreSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 60,
  },
  creditsContainer: {
    flex: 1,
  },
  creditItem: {
    marginBottom: 12,
  },
  creditName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  creditRole: {
    color: '#fff',
    fontSize: 14,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d7596',
    marginRight: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userScoreLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  taglineSection: {
    marginBottom: 20,
  },
  tagline: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overviewText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  watchlistSection: {
    marginBottom: 0,
    width: 190,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  watchlistText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  castSection: {
    marginBottom: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  castList: {
    paddingLeft: 20,
    paddingVertical: 5,
  },
  castMember: {
    width: 120,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  castImage: {
    width: 120,
    height: 160,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 8,
  },
  castInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  castName: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  castCharacter: {
    color: '#333',
    fontSize: 12,
  },
});

export default MovieDetailScreen;
