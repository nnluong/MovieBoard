import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const TMDBLogo: React.FC = () => {
  const logoSource = require('../assets/images/logo.jpg');
  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 60,
  },
  instruction: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TMDBLogo;