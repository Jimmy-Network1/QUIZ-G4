import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow, GlassCard} from '../../components/common';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import BluetoothService from '../../services/local/BluetoothService';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {getOfflineQuestionsForGame} from '../../services/OfflineQuestionService';
import {useAlert} from '../../store/alertContext';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {AuthContext} from '../../store/authContext';

export default function LocalBluetoothScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {userId, userName} = useContext(AuthContext);
  const {showAlert} = useAlert();
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBluetoothReady, setIsBluetoothReady] = useState(false);

  const setupBluetooth = useCallback(async () => {
    const hasPermission = await BluetoothService.requestPermissions();
    if (!hasPermission) {
      showAlert({
        title: 'Accès refusé',
        message: 'L\'app a besoin du Bluetooth et de la position pour trouver tes adversaires.',
        type: 'warning',
      });
      return;
    }

    const enabled = await BluetoothService.checkAndEnableBluetooth();
    if (!enabled) {
      showAlert({
        title: 'Bluetooth éteint',
        message: 'Active ton Bluetooth dans les réglages pour lancer le défi !',
        type: 'warning',
      });
      return;
    }

    setIsBluetoothReady(true);
  }, [showAlert]);

  useEffect(() => {
    setupBluetooth();
  }, [setupBluetooth]);

  const scanDevices = useCallback(async () => {
    if (!isBluetoothReady) {
      return;
    }
    setIsScanning(true);
    try {
      const paired = await BluetoothService.listPairedDevices();
      setDevices(paired || []);
      const discovered = await BluetoothService.startDiscovery();
      setDevices(prev => {
        const all = [...prev, ...(discovered || [])];
        return all.filter(
          (v, i, a) => a.findIndex(t => t.address === v.address) === i,
        );
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  }, [isBluetoothReady]);

  // Listen for incoming connection requests (acting as Client/Receiver)
  useEffect(() => {
    if (!isBluetoothReady) {
      return;
    }

    const listenForConnection = async () => {
      try {
        const device = await BluetoothService.acceptConnection();
        if (device) {
          // Connection accepted, wait for START_GAME message
          BluetoothService.setMessageHandler((msg: any) => {
            if (msg.type === 'START_GAME') {
              navigation.replace(AuthenticatedScreens.LocalGameScreen, {
                isHost: false,
                gameMode: msg.gameMode,
                categoryId: 'all',
                questions: msg.questions,
              });
            }
          });
        }
      } catch (err) {
        console.error('Accept error:', err);
      }
    };

    listenForConnection();
    scanDevices(); // auto start scan

    return () => {
      BluetoothService.disconnect();
    };
  }, [navigation, isBluetoothReady, scanDevices]);

  const handleConnect = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    const success = await BluetoothService.connectToDevice(device);
    setIsConnecting(false);

    if (success) {
      const questions = getOfflineQuestionsForGame('all', 10);

      await BluetoothService.send({
        type: 'START_GAME',
        questions,
        gameMode: '1v1',
      });

      navigation.replace(AuthenticatedScreens.LocalGameScreen, {
        isHost: true,
        gameMode: '1v1',
        categoryId: 'all',
        questions: questions,
      });
    } else {
      showAlert({
        title: 'Échec de connexion',
        message: 'Impossible de se connecter à cet appareil. Vérifie qu\'il est bien prêt.',
        type: 'error',
      });
    }
  };

  const renderDevice = ({item}: {item: BluetoothDevice}) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => handleConnect(item)}>
      <Text style={styles.deviceName}>{item.name || 'Appareil Inconnu'}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

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
              <Text style={styles.headerTitle}>BLUETOOTH 1v1</Text>
              <View style={{width: 40}} />
            </View>

            <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.content}>
              <GlassCard delay={100} style={styles.glassContainer}>
                <Text style={styles.subtitle}>JOUEURS À PROXIMITÉ</Text>

                {isScanning ? (
                  <ActivityIndicator
                    color={colorList.vibrantCyan}
                    size="large"
                    style={styles.loader}
                  />
                ) : (
                  <FlatList
                    data={devices}
                    renderItem={renderDevice}
                    keyExtractor={item => item.address}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                      <Text style={styles.emptyText}>
                        Aucun appareil trouvé. Vérifiez que le Bluetooth est
                        activé sur l'autre téléphone.
                      </Text>
                    }
                  />
                )}
              </GlassCard>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(200).duration(800)}
              style={styles.footer}>
              <ButtonComponent
                title="RECHERCHER À NOUVEAU"
                onPress={scanDevices}
                isLoading={isScanning}
                disabled={isConnecting || !isBluetoothReady}
                style={styles.button}
              />
              {isConnecting && (
                <Text style={styles.connectingText}>Connexion en cours...</Text>
              )}
              <Text style={styles.waitingHint}>
                En restant sur cet écran, vous êtes visible pour les autres.
              </Text>
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
  content: {flex: 1, paddingBottom: 20},
  glassContainer: {flex: 1, padding: 20},
  subtitle: {
    color: colorList.applePlaceholder,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {marginTop: 50},
  list: {paddingBottom: 20},
  deviceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colorList.appleGlassBorder,
  },
  deviceName: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  deviceAddress: {color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4},
  emptyText: {
    color: colorList.applePlaceholder,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {paddingBottom: 30},
  button: {marginHorizontal: 0, height: 55},
  connectingText: {
    color: colorList.vibrantCyan,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
  },
  waitingHint: {
    color: colorList.applePlaceholder,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});
