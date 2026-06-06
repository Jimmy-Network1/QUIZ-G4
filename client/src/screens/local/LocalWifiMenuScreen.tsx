import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';

export default function LocalWifiMenuScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.bg}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.7)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.header}>
            <GoBackArrow />
            <Text style={styles.headerTitle}>Wi-Fi Local</Text>
            <View style={{width: 40}} />
          </View>

          <Text style={styles.sectionLabel}>CRÉER</Text>
          <ButtonComponent
            title="Partie 1 contre 1"
            onPress={() =>
              navigation.navigate(AuthenticatedScreens.LocalWifiHostScreen, {
                gameMode: '1v1',
              })
            }
            style={styles.button}
          />
          <ButtonComponent
            title="Compétition (jusqu'à 8 joueurs)"
            variant="bluish"
            onPress={() =>
              navigation.navigate(AuthenticatedScreens.LocalWifiHostScreen, {
                gameMode: 'tournament',
              })
            }
            style={styles.button}
          />

          <Text style={[styles.sectionLabel, styles.joinLabel]}>REJOINDRE</Text>
          <ButtonComponent
            title="Rejoindre une partie 1v1"
            onPress={() =>
              navigation.navigate(AuthenticatedScreens.LocalWifiJoinScreen, {
                gameMode: '1v1',
              })
            }
            style={styles.button}
          />
          <ButtonComponent
            title="Rejoindre une compétition"
            variant="bluish"
            onPress={() =>
              navigation.navigate(AuthenticatedScreens.LocalWifiJoinScreen, {
                gameMode: 'tournament',
              })
            }
            style={styles.button}
          />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1},
  overlay: {flex: 1, paddingHorizontal: 20, paddingTop: 100},
  header: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {color: colorList.white, fontSize: 20, fontWeight: 'bold'},
  sectionLabel: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 1,
  },
  joinLabel: {marginTop: 32},
  button: {marginHorizontal: 0, height: 55, marginTop: 8},
});
