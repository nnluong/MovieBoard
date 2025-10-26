import React from 'react';
import {View, StyleSheet} from 'react-native';

// Import SVG icons
import IcHome from '../assets/images/tabbar/ic_home.svg';
import IcWatchlist from '../assets/images/tabbar/ic_watchlist.svg';
import IcChevronDown from '../assets/svg/ic_chevron_down.svg';
import IcChevronRight from '../assets/svg/ic_chevron-right.svg';

interface SvgIconProps {
  name: 'home' | 'watchlist' | 'chevron-down' | 'chevron-right';
  size?: number;
  color?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({name, size = 24, color = '#000'}) => {
  const iconProps = {
    width: size,
    height: size,
    fill: color,
    color: color, // This is the proper way to override SVG colors
  };

  switch (name) {
    case 'home':
      return <IcHome {...iconProps} />;
    case 'watchlist':
      return <IcWatchlist {...iconProps} />;
    case 'chevron-down':
      return <IcChevronDown {...iconProps} />;
    case 'chevron-right':
      return <IcChevronRight {...iconProps} />;
    default:
      return <View style={[styles.placeholder, {width: size, height: size}]} />;
  }
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
});

export default SvgIcon;
