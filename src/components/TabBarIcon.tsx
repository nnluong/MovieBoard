import React from 'react';
import {View, StyleSheet} from 'react-native';
import SvgIcon from './SvgIcon';
import {TabBarIcons} from '../assets/images/tabbar/icons';

interface TabBarIconProps {
  name: keyof typeof TabBarIcons;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused: _focused,
  color,
  size,
}) => {
  // Map tab bar names to SVG icon names
  const getSvgIconName = (
    tabName: keyof typeof TabBarIcons,
  ): 'home' | 'watchlist' => {
    switch (tabName) {
      case 'home':
        return 'home';
      case 'watchlist':
        return 'watchlist';
      default:
        return 'home';
    }
  };

  const svgIconName = getSvgIconName(name);

  return (
    <View style={styles.container}>
      <SvgIcon name={svgIconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  icon: {
    textAlign: 'center',
  },
});

export default TabBarIcon;
