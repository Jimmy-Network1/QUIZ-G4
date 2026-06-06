import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useEffect} from 'react';
import ButtonComponent from '../components/common/ButtonComponent';
import {colorList} from '../constants/colors';
import socket from '../services/SocketService';
import {SocketEvents} from '../types/SocketEvents';
import {LoginScreenBg} from '../assets/images';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../store/authContext';
import LocalP2PService from '../services/local/LocalP2PService';

export default function MainMenuScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {serverMode, userName, isLocalSession, logout} =
    useContext(AuthContext);
  const isLocal = serverMode === 'local' || isLocalSession;

  useEffect(() => {
    if (!isLocal) {
      socket.on(SocketEvents.CONNECT, () => {
        socket.emit(SocketEvents.ON_CONNECT, 'someone connected');
      });
    }
  }, [isLocal]);

  const handleLogout = () => {
    if (isLocal) {
      LocalP2PService.disconnect();
    }
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.6)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.logoText}>
                QUIZ<Text style={styles.logoAccent}>G4</Text>
              </Text>
              <Text style={styles.subtitle}>
                {isLocal ? `LOCAL — ${userName}` : 'MENU PRINCIPAL'}
              </Text>
            </View>

            <View style={styles.menuContainer}>
              {isLocal ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Mode Local (hors-ligne)
                  </Text>
                  <ButtonComponent
                    title="Wi-Fi — 1v1 ou Compétition"
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate(
                        AuthenticatedScreens.LocalWifiMenuScreen,
                      )
                    }
                  />
                  <ButtonComponent
                    title="Bluetooth — 1 contre 1"
                    variant="bluish"
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate(
                        AuthenticatedScreens.LocalBluetoothScreen,
                      )
                    }
                  />
                </View>
              ) : (
                <>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>En ligne</Text>
                    <ButtonComponent
                      title="Duel 1 contre 1"
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate(
                          AuthenticatedScreens.MultiplayerLobbyScreen,
                        )
                      }
                    />
                    <ButtonComponent
                      title="Créer / Rejoindre une compétition"
                      variant="bluish"
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate(
                          AuthenticatedScreens.TournamentListScreen,
                        )
                      }
                    />
                  </View>

                  <View style={[styles.section, styles.extraSection]}>
                    <Text style={styles.sectionTitle}>Extras</Text>
                    <ButtonComponent
                      title="Solo (Entraînement)"
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate(
                          AuthenticatedScreens.CreateGameScreen,
                          {
                            isSinglePlayer: true,
                          },
                        )
                      }
                    />
                    <ButtonComponent
                      title="Mon Profil"
                      variant="bluish"
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate(AuthenticatedScreens.AccountScreen)
                      }
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ButtonComponent
              title={isLocal ? 'Changer de mode' : 'Déconnexion'}
              variant="bluish"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
            <Text style={styles.versionText}>v1.0.0 - Groupe 4 ICT202</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 50,
    fontWeight: '900',
    color: colorList.white,
    letterSpacing: 2,
    textShadowColor: colorList.neonPink,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  logoAccent: {
    color: colorList.neonPink,
  },
  subtitle: {
    color: colorList.vibrantCyan,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: -5,
  },
  menuContainer: {
    gap: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  extraSection: {
    borderColor: 'rgba(0, 242, 255, 0.2)',
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginHorizontal: 0,
    height: 55,
    marginTop: 10,
  },
  championshipButton: {
    marginHorizontal: 0,
    height: 60,
    marginTop: 10,
  },
  logoutButton: {
    marginHorizontal: 0,
    height: 45,
    marginBottom: 10,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
  },
});
