import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  showPercentage?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 60,
  strokeWidth = 6,
  progress,
  color = '#21d07a',
  backgroundColor = '#4a4a4a',
  textColor = '#ffffff',
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const containerSize = size + 10;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
      ]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.progressText, {color: textColor}]}>
          {Math.round(progress)}
        </Text>
        {showPercentage && (
          <Text style={[styles.percentageText, {color: textColor}]}>%</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#042541',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
    marginLeft: 1,
  },
});

export default CircularProgress;
