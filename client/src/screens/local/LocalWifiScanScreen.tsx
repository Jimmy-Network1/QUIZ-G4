import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {GoBackArrow, GlassCard} from '../../components/common';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import Animated, {FadeInDown} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WifiManager from 'quiz-g4-wifi-manager';

type LocalWifiScanScreenRouteProp = RouteProp<
  RootStackParamList,
  AuthenticatedScreens.LocalWifiScanScreen
>;

type Props = {
  route: LocalWifiScanScreenRouteProp;
};

interface WifiNetwork {
  id: string;
  ssid: string;
  strength: number;
  isGameNetwork: boolean;
  isSecure: boolean;
}

export default function LocalWifiScanScreen({route}: Props): JSX.Element {
  const {gameMode, isHost} = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isScanning, setIsScanning] = useState(true);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permission de localisation",
            message: "L'application a besoin d'accéder à votre position pour scanner les réseaux Wi-Fi.",
            buttonNeutral: "Plus tard",
            buttonNegative: "Annuler",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const scanWifi = async () => {
    setIsScanning(true);
    setError(null);
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setError("Permission de localisation refusée. Le scan est impossible.");
      setIsScanning(false);
      return;
    }

    try {
      // Pour Android, loadWifiList() renvoie la liste des réseaux détectés
      const wifiList = await WifiManager.loadWifiList();
      
      const mappedNetworks: WifiNetwork[] = wifiList.map((net: any, index: number) => ({
        id: index.toString(),
        ssid: net.SSID || 'Réseau masqué',
        strength: Math.max(1, Math.min(5, Math.ceil((net.level + 100) / 20))), // Convertit RSSI en 1-5
        isGameNetwork: net.SSID === 'QUIZ_GAME_ARENA' || net.SSID?.includes('KNOWAR'),
        isSecure: net.capabilities.includes('WPA') || net.capabilities.includes('WEP'),
      }));

      // Trier : Arène en premier, puis par puissance
      mappedNetworks.sort((a, b) => {
        if (a.isGameNetwork && !b.isGameNetwork) return -1;
        if (!a.isGameNetwork && b.isGameNetwork) return 1;
        return b.strength - a.strength;
      });

      setNetworks(mappedNetworks);
    } catch (err: any) {
      setError("Échec du scan : " + (err.message || "Erreur inconnue"));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    scanWifi();
    
    // Refresh scan every 15 seconds (respecting Android throttle)
    const interval = setInterval(scanWifi, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectNetwork = async (network: WifiNetwork) => {
    if (network.isGameNetwork && !isHost) {
      // Optionnel : Tentative de connexion automatique si c'est l'arène
      try {
        // Si ouvert ou si on connaît le MDP par défaut
        // await WifiManager.connectToProtectedSSID(network.ssid, "PASSWORD", false);
      } catch (e) {
        console.log("Auto-connect failed, proceeding to manual IP screen");
      }
    }

    if (isHost) {
      navigation.navigate(AuthenticatedScreens.LocalWifiHostScreen, {gameMode});
    } else {
      navigation.navigate(AuthenticatedScreens.LocalWifiJoinScreen, {gameMode});
    }
  };

  const renderNetworkItem = ({item}: {item: WifiNetwork}) => {
    const isGame = item.isGameNetwork;
    
    return (
      <Animated.View entering={FadeInDown.delay(100)}>
        <TouchableOpacity
          onPress={() => handleSelectNetwork(item)}
          activeOpacity={0.7}
          style={[
            styles.networkItem,
            isGame && styles.gameNetworkItem
          ]}>
          <View style={styles.networkLeft}>
            <View style={[styles.iconContainer, isGame && styles.gameIconContainer]}>
              <Icon 
                name={isGame ? "controller-classic" : "wifi"} 
                size={24} 
                color={isGame ? colorList.vibrantGold : colorList.white} 
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.ssidText, isGame && styles.gameSsidText]} numberOfLines={1}>
                {item.ssid}
              </Text>
              <Text style={styles.securityText}>
                {isGame ? "ARÈNE DÉTECTÉE" : (item.isSecure ? "Sécurisé" : "Ouvert")}
              </Text>
            </View>
          </View>
          
          <View style={styles.networkRight}>
            <Icon 
              name={`wifi-strength-${item.strength}`} 
              size={20} 
              color={isGame ? colorList.vibrantGold : colorList.applePlaceholder} 
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={LoginScreenBg} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.4)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <GoBackArrow />
              <Text style={styles.headerTitle}>RÉSEAUX RÉELS</Text>
              <View style={{width: 40}} />
            </View>

            <View style={styles.content}>
              <GlassCard style={styles.glassContainer}>
                <View style={styles.scanStatusContainer}>
                  {isScanning && networks.length === 0 ? (
                    <>
                      <Icon name="radar" size={40} color={colorList.vibrantCyan} style={styles.scanIcon} />
                      <Text style={styles.statusText}>Scan en cours...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.resultCount}>
                        {networks.length} réseaux détectés
                      </Text>
                      <TouchableOpacity onPress={scanWifi} disabled={isScanning}>
                        <Text style={[styles.refreshText, isScanning && {opacity: 0.5}]}>
                          {isScanning ? "Mise à jour..." : "Actualiser le scan"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <FlatList
                  data={networks}
                  keyExtractor={(item) => item.ssid + item.id}
                  renderItem={renderNetworkItem}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    !isScanning ? (
                      <Text style={styles.emptyText}>Aucun réseau trouvé. Vérifiez que le Wi-Fi et la Localisation sont activés.</Text>
                    ) : null
                  }
                />
              </GlassCard>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1},
  overlay: {flex: 1},
  safeArea: {flex: 1, paddingHorizontal: 20},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {flex: 1, paddingBottom: 20},
  glassContainer: {flex: 1, padding: 15},
  scanStatusContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  scanIcon: {marginBottom: 10},
  statusText: {
    color: colorList.vibrantCyan,
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultCount: {
    color: colorList.applePlaceholder,
    fontSize: 13,
    marginBottom: 5,
  },
  refreshText: {
    color: colorList.vibrantCyan,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colorList.red,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    color: colorList.applePlaceholder,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontStyle: 'italic',
  },
  listContent: {paddingTop: 5},
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gameNetworkItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: colorList.vibrantGold,
    borderWidth: 2,
  },
  networkLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameIconContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  ssidText: {
    color: colorList.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  gameSsidText: {
    color: colorList.vibrantGold,
  },
  securityText: {
    color: colorList.applePlaceholder,
    fontSize: 11,
  },
  networkRight: {
    marginLeft: 10,
  },
});
