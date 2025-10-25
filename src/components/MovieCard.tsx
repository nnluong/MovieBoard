import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Movie} from '../types/movie';
import {movieService} from '../services/movieService';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({movie, onPress}) => {
  const handlePress = () => {
    onPress?.(movie);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}>
      <View style={styles.content}>
        <Image
          source={{uri: movieService.getImageUrl(movie.poster_path)}}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.date}>
            {movieService.formatDate(movie.release_date)}
          </Text>
          <Text style={styles.description} numberOfLines={4}>
            {movie.overview}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default MovieCard;