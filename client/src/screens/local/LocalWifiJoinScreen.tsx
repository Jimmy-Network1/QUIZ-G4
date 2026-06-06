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
import {ButtonComponent, GoBackArrow, Input} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import LocalP2PService from '../../services/local/LocalP2PService';
import {AuthContext} from '../../store/authContext';
import {LocalMessage} from '../../types/LocalP2P';

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
            <Text style={styles.headerTitle}>Rejoindre</Text>
            <View style={{width: 40}} />
          </View>

          <Text style={styles.subtitle}>Même Wi-Fi ou hotspot du créateur</Text>

          <Input
            placeholder="IP de l'hôte (ex: 192.168.1.42)"
            keyboardType="numeric"
            onChangeText={setHostIp}
            style={styles.input}
          />

          <Text style={styles.status}>{status}</Text>

          <ButtonComponent
            title={isConnecting ? 'Connexion...' : 'Rejoindre la partie'}
            onPress={handleConnect}
            style={styles.button}
            disabled={isConnecting}
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
  subtitle: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  input: {marginHorizontal: 0},
  status: {
    color: colorList.vibrantCyan,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {marginHorizontal: 0, height: 55},
});
