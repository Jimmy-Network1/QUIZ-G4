import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {
  ButtonComponent,
  GoBackArrow,
  Input,
  GlassCard,
} from '../../components/common';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import LocalP2PService from '../../services/local/LocalP2PService';
import {AuthContext} from '../../store/authContext';
import {LocalMessage} from '../../types/LocalP2P';
import Animated, {FadeInDown} from 'react-native-reanimated';

type Route = {
  params: {gameMode: '1v1' | 'tournament'};
};

export default function LocalWifiJoinScreen({
  route,
}: {
  route: Route;
}): JSX.Element {
  const {gameMode} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {userId, userName} = useContext(AuthContext);
  const [hostIp, setHostIp] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("Entrez l'IP de l'hôte");

  const handleConnect = async () => {
    const ip = hostIp.trim();
    if (!ip) {
      Alert.alert(
        'IP requise',
        "Demandez l'IP Wi-Fi à la personne qui a créé la partie.",
      );
      return;
    }

    setIsConnecting(true);
    setStatus('Connexion en cours...');

    LocalP2PService.setLocalIdentity(userId, userName);
    LocalP2PService.setMessageHandler((message: LocalMessage) => {
      if (message.type === 'LOBBY_UPDATE') {
        setStatus(`${message.players.length} joueur(s) connecté(s)`);
      }
      if (message.type === 'START_GAME') {
        navigation.replace(AuthenticatedScreens.LocalGameScreen, {
          isHost: false,
          gameMode,
          categoryId: 'all',
          questions: message.questions,
        });
      }
      if (message.type === 'ERROR') {
        setStatus(message.message);
        setIsConnecting(false);
      }
    });

    try {
      await LocalP2PService.connectToHost(ip);
      setStatus('Connecté ! En attente du lancement...');
    } catch {
      setStatus("Connexion impossible. Vérifiez l'IP et le réseau.");
      setIsConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.bg}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.4)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <GoBackArrow />
              <Text style={styles.headerTitle}>REJOINDRE</Text>
              <View style={{width: 40}} />
            </View>

            <Animated.View
              entering={FadeInDown.duration(800)}
              style={styles.content}>
              <GlassCard delay={100} style={styles.glassContainer}>
                <Text style={styles.subtitle}>
                  Même Wi-Fi ou hotspot du créateur
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IP DE L'HÔTE</Text>
                  <Input
                    placeholder="Ex: 192.168.1.42"
                    keyboardType="numeric"
                    onChangeText={setHostIp}
                    style={styles.input}
                  />
                </View>

                <Text style={styles.status}>{status}</Text>

                <ButtonComponent
                  title={isConnecting ? 'CONNEXION...' : 'REJOINDRE LA PARTIE'}
                  onPress={handleConnect}
                  style={styles.button}
                  disabled={isConnecting}
                />
              </GlassCard>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  overlay: {flex: 1},
  safeArea: {flex: 1, paddingHorizontal: 20, backgroundColor: 'transparent'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {flex: 1, justifyContent: 'center', paddingBottom: 40},
  glassContainer: {padding: 25},
  subtitle: {
    color: colorList.applePlaceholder,
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputGroup: {marginBottom: 15, width: '100%'},
  inputLabel: {
    color: colorList.vibrantCyan,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    letterSpacing: 1,
    marginBottom: -10,
  },
  input: {marginHorizontal: 0},
  status: {
    color: colorList.vibrantCyan,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  button: {marginHorizontal: 0, height: 55},
});
