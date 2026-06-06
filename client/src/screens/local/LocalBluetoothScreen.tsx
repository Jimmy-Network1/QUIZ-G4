import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import BluetoothService from '../../services/local/BluetoothService';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {getOfflineQuestionsForGame} from '../../services/OfflineQuestionService';

export default function LocalBluetoothScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Listen for incoming connection requests (acting as Client/Receiver)
  useEffect(() => {
    const listenForConnection = async () => {
      try {
        const device = await BluetoothService.acceptConnection();
        if (device) {
          // Connection accepted, wait for START_GAME message
          BluetoothService.setMessageHandler((msg: any) => {
            if (msg.type === 'START_GAME') {
              navigation.navigate(AuthenticatedScreens.LocalGameScreen, {
                isHost: false,
                gameMode: msg.gameMode,
                categoryId: 'all',
                questions: msg.questions,
                connectionType: 'bluetooth',
              });
            }
          });
        }
      } catch (err) {
        console.error('Accept error:', err);
      }
    };

    listenForConnection();
    return () => {
      BluetoothService.disconnect();
    };
  }, [navigation]);

  const setupBluetooth = useCallback(async () => {
    const hasPermission = await BluetoothService.requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissions requises',
        'Le Bluetooth et la localisation sont nécessaires pour jouer en local.',
      );
      return;
    }
    scanDevices();
  }, []);

  useEffect(() => {
    setupBluetooth();
  }, [setupBluetooth]);

  const scanDevices = async () => {
    setIsScanning(true);
    try {
      const paired = await BluetoothService.listPairedDevices();
      setDevices(paired);
      const discovered = await BluetoothService.startDiscovery();
      setDevices(prev => {
        const all = [...prev, ...discovered];
        return all.filter(
          (v, i, a) => a.findIndex(t => t.address === v.address) === i,
        );
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

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

      navigation.navigate(AuthenticatedScreens.LocalGameScreen, {
        isHost: true,
        gameMode: '1v1',
        categoryId: 'all',
        questions: questions,
        connectionType: 'bluetooth',
      });
    } else {
      Alert.alert('Échec', 'Impossible de se connecter à cet appareil.');
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

          <View style={styles.content}>
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
                    Aucun appareil trouvé. Vérifiez que le Bluetooth est activé
                    sur l'autre téléphone.
                  </Text>
                }
              />
            )}
          </View>

          <View style={styles.footer}>
            <ButtonComponent
              title="RECHERCHER À NOUVEAU"
              onPress={scanDevices}
              isLoading={isScanning}
              disabled={isConnecting}
            />
            {isConnecting && (
              <Text style={styles.connectingText}>Connexion en cours...</Text>
            )}
            <Text style={styles.waitingHint}>
              En restant sur cet écran, vous êtes visible pour les autres.
            </Text>
          </View>
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
  content: {flex: 1},
  subtitle: {
    color: colorList.vibrantCyan,
    fontSize: 14,
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
    borderColor: 'rgba(255,255,255,0.1)',
  },
  deviceName: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  deviceAddress: {color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4},
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
  footer: {paddingBottom: 30},
  connectingText: {
    color: colorList.softPink,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  waitingHint: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
