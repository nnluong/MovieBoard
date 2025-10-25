import React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabBarIcons} from '../assets/images/tabbar/icons';

interface TabBarIconProps {
  name: keyof typeof TabBarIcons;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  color,
  size,
}) => {
  const iconName = focused
    ? TabBarIcons[name].active
    : TabBarIcons[name].inactive;

  return (
    <View style={styles.container}>
      <MaterialIcons
        name={iconName}
        size={size}
        color={color}
        style={styles.icon}
      />
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