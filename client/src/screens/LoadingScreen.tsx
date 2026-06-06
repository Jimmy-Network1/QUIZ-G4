import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import {ButtonComponent} from '../components/common';
import {useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

interface LoadingScreenProps {
  text: string;
  buttonText?: string;
}

type LoadingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  any
>;

export default function LoadingScreen({text, buttonText}: LoadingScreenProps) {
  const navigation = useNavigation<LoadingScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={LoginScreenBg} style={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.8)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.glassCard}>
              <ActivityIndicator size="large" color={colorList.vibrantCyan} />
              <Text style={styles.text}>{text}</Text>
            </View>

            {buttonText && (
              <ButtonComponent
                title={buttonText}
                variant="bluish"
                onPress={() =>
                  navigation.replace(AuthenticatedScreens.MainMenuScreen)
                }
                style={styles.button}
              />
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginBottom: 30,
  },
  text: {
    color: colorList.white,
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
  },
  button: {
    width: '100%',
    marginHorizontal: 0,
    height: 55,
  },
});
