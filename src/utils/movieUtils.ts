export const formatRuntime = (runtime: number | null): string => {
  if (!runtime) {
    return 'N/A';
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatRating = (rating: number): string => {
  return `${Math.round(rating * 10)}%`;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 7) {
    return '#21d07a';
  }
  if (rating >= 4) {
    return '#d2d531';
  }
  return '#db2360';
};
