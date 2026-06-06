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

export default function LocalBluetoothScreen(): JSX.Element {
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
            <Text style={styles.headerTitle}>Bluetooth 1v1</Text>
            <View style={{width: 40}} />
          </View>

          <Text style={styles.emoji}>📶</Text>
          <Text style={styles.title}>Mode Bluetooth</Text>
          <Text style={styles.description}>
            Le duel Bluetooth 1v1 sera disponible avec
            react-native-bluetooth-classic.
            {'\n\n'}
            Pour l'instant, utilisez le mode Wi-Fi local : il fonctionne aussi
            sans routeur (hotspot du créateur).
          </Text>

          <ButtonComponent
            title="Utiliser le Wi-Fi local"
            onPress={() =>
              navigation.navigate(AuthenticatedScreens.LocalWifiHostScreen, {
                gameMode: '1v1',
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
  overlay: {flex: 1, paddingHorizontal: 20, justifyContent: 'center'},
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
  emoji: {fontSize: 48, textAlign: 'center', marginBottom: 16},
  title: {
    color: colorList.softPink,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {marginHorizontal: 0, height: 55},
});
