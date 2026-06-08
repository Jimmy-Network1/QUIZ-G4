import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {ButtonComponent, GoBackArrow, GlassCard} from '../../components/common';
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
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useAlert} from '../../store/alertContext';

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
  const {showAlert} = useAlert();
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
      showAlert({
        title: 'Hébergement impossible',
        message: 'L\'arène locale n\'a pas pu démarrer. Vérifie tes paramètres Wi-Fi.',
        type: 'error',
      });
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
              <Text style={styles.headerTitle}>
                {gameMode === '1v1' ? 'HÔTE 1v1' : 'HÔTE COMPÉTITION'}
              </Text>
              <View style={{width: 40}} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <Animated.View entering={FadeInDown.duration(400)}>
                {!isHosting ? (
                  <GlassCard delay={100} style={styles.glassContainer}>
                    <Text style={styles.label}>CATÉGORIE (HORS-LIGNE)</Text>
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
                      title="DÉMARRER LE SALON"
                      onPress={handleStartHost}
                      style={styles.actionButton}
                    />
                  </GlassCard>
                ) : (
                  <GlassCard delay={100} style={styles.glassContainer}>
                    <Text style={styles.info}>
                      Partagez votre IP Wi-Fi avec les autres joueurs.
                      {'\n'}Routeur ou hotspot : même réseau requis.
                    </Text>
                    <Text style={styles.port}>Port : 9090</Text>

                    <Text style={styles.label}>
                      JOUEURS ({players.length}/{maxPlayers})
                    </Text>
                    <View style={styles.playersList}>
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
                          ? 'LANCER LA PARTIE'
                          : `EN ATTENTE (${minPlayers} joueurs min.)`
                      }
                      onPress={handleStartGame}
                      style={styles.actionButton}
                      disabled={!canStart}
                    />
                  </GlassCard>
                )}
              </Animated.View>
            </ScrollView>
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
  content: {paddingBottom: 40, justifyContent: 'center', flexGrow: 1},
  glassContainer: {padding: 20},
  label: {
    color: colorList.applePlaceholder,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryList: {gap: 10},
  categoryButton: {marginHorizontal: 0, height: 50},
  actionButton: {marginTop: 25, marginHorizontal: 0, height: 55},
  info: {
    color: colorList.applePlaceholder,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  port: {
    color: colorList.vibrantCyan,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 18,
    letterSpacing: 2,
  },
  playersList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playerText: {
    color: colorList.white,
    fontSize: 16,
    marginVertical: 4,
    fontWeight: 'bold',
  },
  error: {color: colorList.red, textAlign: 'center', marginTop: 12},
});
