import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {colorList} from '../../constants/colors';
import Animated, {FadeInUp} from 'react-native-reanimated';

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
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600).springify()}
      style={[styles.container, style]}>
      <BlurView
        style={styles.blurView}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="rgba(11, 2, 53, 0.9)"
      />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colorList.appleGlassBorder,
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // subtle fallback base for platforms without native blur
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
});
