import React, {useEffect, useRef, useContext} from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';
import {KnowarLogo} from '../assets/images';
import {colorList} from '../constants/colors';
import {AuthContext} from '../store/authContext';
import {
  AuthenticatedScreens,
  UnauthenticatedScreens,
} from '../types/navigation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

export default function SplashScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const nextScreen = authCtx.isAuthenticated
          ? AuthenticatedScreens.MainMenuScreen
          : UnauthenticatedScreens.ConnectionSelectionScreen;
        (navigation as any).replace(nextScreen);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation, authCtx.isAuthenticated]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={KnowarLogo}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}
        resizeMode="contain"
      />
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Powered by <Text style={styles.brandText}>Gemini AI</Text>
        </Text>
        <Text style={styles.footerSubText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorList.darkBackgroundBlue,
  },
  logo: {
    width: '100%',
    height: '50%',
    marginBottom: 20,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  brandText: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
  },
  footerSubText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
});
