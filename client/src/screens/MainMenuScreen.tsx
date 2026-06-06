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
import {GlassCard} from '../components/common';
import Animated, {FadeInDown} from 'react-native-reanimated';

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
          colors={['rgba(11, 2, 53, 0.4)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View
              entering={FadeInDown.duration(800)}
              style={styles.headerContainer}>
              <Text style={styles.logoText}>
                QUIZ<Text style={styles.logoAccent}>G4</Text>
              </Text>
              <Text style={styles.subtitle}>
                {isLocal ? `LOCAL — ${userName}` : 'MENU PRINCIPAL'}
              </Text>
            </Animated.View>

            <View style={styles.menuContainer}>
              {isLocal ? (
                <GlassCard delay={100} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    MODE LOCAL (HORS-LIGNE)
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
                </GlassCard>
              ) : (
                <>
                  <GlassCard delay={100} style={styles.section}>
                    <Text style={styles.sectionTitle}>EN LIGNE</Text>
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
                  </GlassCard>

                  <GlassCard
                    delay={200}
                    style={[styles.section, styles.extraSection]}>
                    <Text style={styles.sectionTitle}>EXTRAS</Text>
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
                  </GlassCard>
                </>
              )}
            </View>
          </ScrollView>

          <Animated.View
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.footer}>
            <ButtonComponent
              title={isLocal ? 'CHANGER DE MODE' : 'DÉCONNEXION'}
              variant="bluish"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
            <Text style={styles.versionText}>v1.0.0 - Groupe 4 ICT202</Text>
          </Animated.View>
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
    marginBottom: 40,
  },
  logoText: {
    fontSize: 50,
    fontWeight: '900',
    color: colorList.white,
    letterSpacing: 2,
    textShadowColor: colorList.neonPink,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  logoAccent: {
    color: colorList.vibrantCyan,
  },
  subtitle: {
    color: colorList.softPink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: -5,
  },
  menuContainer: {
    gap: 20,
  },
  section: {
    padding: 20,
  },
  extraSection: {
    borderColor: 'rgba(0, 242, 255, 0.2)',
  },
  sectionTitle: {
    color: colorList.applePlaceholder,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginHorizontal: 0,
    height: 55,
    marginTop: 10,
  },
  logoutButton: {
    marginHorizontal: 0,
    height: 50,
    marginBottom: 15,
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
