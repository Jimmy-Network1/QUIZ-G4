import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  SafeAreaView,
} from 'react-native';
import {colorList} from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {LoginScreenBg} from '../assets/images';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import {
  ActiveRooms,
  LobbyScreenHeader,
  ButtonComponent,
  GoBackArrow,
} from '../components';

export default function MultiplayerLobbyScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.7)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.header}>
            <GoBackArrow />
            <Text style={styles.headerTitle}>Salons Publics</Text>
            <View style={{width: 40}} />
          </View>

          <View style={styles.lobbyContainer}>
            <LobbyScreenHeader />
            <View style={styles.glassList}>
              <ActiveRooms />
            </View>
          </View>

          <View style={styles.footer}>
            <ButtonComponent
              title="Retour au Menu"
              variant="bluish"
              onPress={() =>
                navigation.navigate(AuthenticatedScreens.MainMenuScreen)
              }
              style={styles.backButton}
            />
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  lobbyContainer: {
    flex: 1,
    marginBottom: 20,
  },
  glassList: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 15,
  },
  footer: {
    paddingBottom: 30,
  },
  backButton: {
    marginHorizontal: 0,
    height: 55,
  },
});
