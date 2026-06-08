import React from 'react';
import {StyleSheet, ViewStyle, Platform, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {colorList} from '../../constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export default function GlassCard({
  children,
  style,
  delay = 0,
}: GlassCardProps) {
  const isAndroid = Platform.OS === 'android';

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600)}
      style={[styles.container, style]}>
      {!isAndroid ? (
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={12}
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.5)"
        />
      ) : (
        <View style={styles.androidFallback} />
      )}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    backgroundColor: 'transparent',
    shadowColor: colorList.vibrantCyan,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 3,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  androidFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 2, 53, 0.85)', // Dark background matching the theme
  },
});
