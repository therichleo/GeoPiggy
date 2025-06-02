import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const CircularProgress = ({ size = 120, strokeWidth = 10, progress = 0, duration = 1000 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const rotate = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.backgroundCircle, { borderWidth: strokeWidth }]} />
      <Animated.View
        style={[
          styles.progressCircle,
          {
            borderWidth: strokeWidth,
            transform: [{ rotate }],
          },
        ]}
      />
      <View style={styles.centerContent}>
        <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: '#ccc',
    borderRadius: 999,
  },
  progressCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: '#00BFFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 999,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CircularProgress;
