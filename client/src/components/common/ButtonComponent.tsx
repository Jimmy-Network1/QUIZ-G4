import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {colorList} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

interface ButtonComponentProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'bluish';
}

export default function ButtonComponent({
  onPress,
  title,
  style,
  textStyle,
  disabled,
  isLoading,
  variant = 'default',
}: ButtonComponentProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const gradientColors =
    variant === 'bluish'
      ? [colorList.appleAccent, '#5AC8FA']
      : ['#FF2D55', '#FF6B8B']; // Soft Apple Pink/Rose gradient

  const shadowStyle = {
    shadowColor: variant === 'bluish' ? colorList.appleAccent : '#FF2D55',
  };

  const buttonTextStyle =
    variant === 'bluish'
      ? [styles.textBase, styles.bluishButtonText, textStyle]
      : [styles.textBase, styles.buttonText, textStyle];

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || isLoading}>
      <Animated.View style={{transform: [{scale: scaleValue}]}}>
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.buttonBase,
            shadowStyle,
            disabled && styles.disabled,
            style,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          {isLoading ? (
            <ActivityIndicator
              testID="activity-indicator"
              size={'small'}
              color={colorList.white}
            />
          ) : (
            <Text style={buttonTextStyle}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 25,
    height: 52,
    marginHorizontal: 35,
    justifyContent: 'center',
    marginTop: 20,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonText: {
    color: colorList.white,
  },
  bluishButtonText: {
    color: colorList.white,
  },
});
