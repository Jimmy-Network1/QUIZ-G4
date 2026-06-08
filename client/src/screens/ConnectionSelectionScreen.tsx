import React, {useContext} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {ButtonComponent} from '../components';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import {AuthContext} from '../store/authContext';
import {setGlobalServerMode} from '../config';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, UnauthenticatedScreens} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

export default function ConnectionSelectionScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {setServerMode} = useContext(AuthContext);

  const handleSelectMode = (mode: 'online' | 'local') => {
    setServerMode(mode);
    setGlobalServerMode(mode);
    if (mode === 'local') {
      navigation.navigate(UnauthenticatedScreens.LocalPseudoScreen);
    } else {
      navigation.navigate(UnauthenticatedScreens.LoginScreen);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.image}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', colorList.darkBackgroundBlue]}
          style={styles.gradient}>
          <Text style={styles.title}>CHOISISSEZ VOTRE MODE</Text>
          <Text style={styles.subtitle}>Comment voulez-vous jouer ?</Text>

          <View style={styles.buttonContainer}>
            <ButtonComponent
              title="🌐 MODE EN LIGNE"
              onPress={() => handleSelectMode('online')}
              style={styles.onlineButton}
            />
            <Text style={styles.description}>
              Jouez avec n'importe qui via Internet (Render).
            </Text>

            <View style={styles.spacer} />

            <ButtonComponent
              title="🏠 MODE LOCAL"
              onPress={() => handleSelectMode('local')}
              style={styles.localButton}
            />
            <Text style={styles.description}>
              Wi-Fi ou hotspot — sans compte, questions embarquées.
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colorList.darkBackgroundBlue,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colorList.vibrantCyan,
    textShadowColor: colorList.brightPurple,
    textShadowRadius: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  onlineButton: {
    backgroundColor: colorList.brightPurple,
    borderColor: colorList.vibrantCyan,
    borderWidth: 2,
  },
  localButton: {
    backgroundColor: colorList.darkBackgroundBlue,
    borderColor: colorList.softPink,
    borderWidth: 2,
  },
  description: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  spacer: {
    height: 30,
  },
});
