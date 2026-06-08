import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ButtonComponent, Input} from '../components';
import {LoginScreenBg} from '../assets/images';
import {colorList} from '../constants/colors';
import {AuthContext} from '../store/authContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import {GoBackArrow} from '../components';

const LOCAL_PSEUDO_KEY = 'localPseudo';

export default function LocalPseudoScreen(): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {authenticateLocal} = useContext(AuthContext);
  const [pseudo, setPseudo] = useState('');

  const handleContinue = async () => {
    const trimmed = pseudo.trim();
    if (trimmed.length < 2) {
      Alert.alert('Pseudo invalide', 'Entrez au moins 2 caractères.');
      return;
    }

    await AsyncStorage.setItem(LOCAL_PSEUDO_KEY, trimmed);
    authenticateLocal(trimmed);
    navigation.replace(AuthenticatedScreens.MainMenuScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.image}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', colorList.darkBackgroundBlue]}
          style={styles.gradient}>
          <View style={styles.header}>
            <GoBackArrow />
          </View>

          <Text style={styles.title}>MODE LOCAL</Text>
          <Text style={styles.subtitle}>
            Pas de compte requis. Choisissez un pseudo pour cette session.
          </Text>

          <Input
            placeholder="Votre pseudo"
            onChangeText={setPseudo}
            style={styles.input}
          />

          <ButtonComponent
            title="Continuer"
            onPress={handleContinue}
            style={styles.button}
          />

          <Text style={styles.hint}>
            Connectez-vous au même Wi-Fi ou au hotspot du créateur.
          </Text>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

export {LOCAL_PSEUDO_KEY};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  image: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {position: 'absolute', top: 50, left: 10},
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colorList.softPink,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {marginHorizontal: 0},
  button: {marginTop: 30, marginHorizontal: 0},
  hint: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
