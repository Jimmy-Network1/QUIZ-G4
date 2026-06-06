import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import {
  getOfflineCategories,
  getOfflineQuestionsForGame,
} from '../../services/OfflineQuestionService';
import LocalP2PService from '../../services/local/LocalP2PService';
import {AuthContext} from '../../store/authContext';
import {MAX_LOCAL_TOURNAMENT_PLAYERS} from '../../constants/local';

type Route = {
  params: {gameMode: '1v1' | 'tournament'};
};

export default function LocalWifiHostScreen({
  route,
}: {
  route: Route;
}): JSX.Element {
  const {gameMode} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {userId, userName} = useContext(AuthContext);
  const categories = getOfflineCategories();

  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.id ?? 'all',
  );
  const [isHosting, setIsHosting] = useState(false);
  const [players, setPlayers] = useState(LocalP2PService.getPlayers());
  const [error, setError] = useState('');

  const minPlayers = 2;
  const maxPlayers = gameMode === '1v1' ? 2 : MAX_LOCAL_TOURNAMENT_PLAYERS;

  const handleStartHost = async () => {
    try {
      LocalP2PService.setLocalIdentity(userId, userName);
      LocalP2PService.setMessageHandler(message => {
        if (message.type === 'LOBBY_UPDATE') {
          setPlayers(message.players);
        }
        if (message.type === 'ERROR') {
          setError(message.message);
        }
      });
      await LocalP2PService.startHost(gameMode);
      setIsHosting(true);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de démarrer le serveur local.');
    }
  };

  const handleStartGame = () => {
    const questions = getOfflineQuestionsForGame(selectedCategory);
    LocalP2PService.startGame(questions, gameMode);
    navigation.replace(AuthenticatedScreens.LocalGameScreen, {
      isHost: true,
      gameMode,
      categoryId: selectedCategory,
    });
  };

  const canStart = players.length >= minPlayers;

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
            <Text style={styles.headerTitle}>
              {gameMode === '1v1' ? 'Hôte 1v1' : 'Hôte Compétition'}
            </Text>
            <View style={{width: 40}} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {!isHosting ? (
              <>
                <Text style={styles.label}>Catégorie (hors-ligne)</Text>
                <View style={styles.categoryList}>
                  {categories.map(cat => (
                    <ButtonComponent
                      key={cat.id}
                      title={cat.name}
                      variant={
                        selectedCategory === cat.id ? 'default' : 'bluish'
                      }
                      onPress={() => setSelectedCategory(cat.id)}
                      style={styles.categoryButton}
                    />
                  ))}
                </View>
                <ButtonComponent
                  title="Démarrer le salon"
                  onPress={handleStartHost}
                  style={styles.actionButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.info}>
                  Partagez votre IP Wi-Fi avec les autres joueurs.
                  {'\n'}Routeur ou hotspot : même réseau requis.
                </Text>
                <Text style={styles.port}>Port : 9090</Text>

                <Text style={styles.label}>
                  Joueurs ({players.length}/{maxPlayers})
                </Text>
                <View style={styles.glassCard}>
                  {players.map(p => (
                    <Text key={p.id} style={styles.playerText}>
                      • {p.pseudo}
                      {p.id === userId ? ' (vous)' : ''}
                    </Text>
                  ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <ButtonComponent
                  title={
                    canStart
                      ? 'Lancer la partie'
                      : `En attente (${minPlayers} joueurs min.)`
                  }
                  onPress={handleStartGame}
                  style={styles.actionButton}
                  disabled={!canStart}
                />
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1},
  overlay: {flex: 1, paddingHorizontal: 20},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {color: colorList.white, fontSize: 20, fontWeight: 'bold'},
  content: {paddingBottom: 40},
  label: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  categoryList: {gap: 8},
  categoryButton: {marginHorizontal: 0, height: 48},
  actionButton: {marginTop: 24, marginHorizontal: 0, height: 55},
  info: {
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
  },
  port: {
    color: colorList.glowingYellow,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playerText: {color: colorList.white, fontSize: 16, marginVertical: 4},
  error: {color: colorList.red, textAlign: 'center', marginTop: 12},
});
