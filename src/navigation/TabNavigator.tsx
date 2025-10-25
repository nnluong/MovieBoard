import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';

const Tab = createBottomTabNavigator();

const HomeTabIcon: React.FC<{
  focused: boolean;
  color: string;
  size: number;
}> = ({focused, color, size}) => (
  <TabBarIcon name="home" focused={focused} color={color} size={size} />
);

const WatchlistTabIcon: React.FC<{
  focused: boolean;
  color: string;
  size: number;
}> = ({focused, color, size}) => (
  <TabBarIcon name="watchlist" focused={focused} color={color} size={size} />
);

const TabNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#032541',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarLabelStyle: {
            fontSize: 0, // Hide labels to match design
          },
          tabBarShowLabel: false,
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: HomeTabIcon,
          }}
        />
        <Tab.Screen
          name="Watchlist"
          component={BookmarksScreen}
          options={{
            tabBarIcon: WatchlistTabIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;