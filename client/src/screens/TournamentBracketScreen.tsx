import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {LobbyBg} from '../assets/images';
import {colorList} from '../constants/colors';
import mainAxiosClient from '../api/axiosClients';
import {AuthContext} from '../store/authContext';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

export default function TournamentBracketScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const {tournamentId} = route.params;
  const {userId} = useContext(AuthContext);

  const [tournament, setTournament] = useState<any>(null);

  const fetchTournament = useCallback(async () => {
    try {
      // In a real app, we'd have a specific endpoint for one tournament
      const response = await mainAxiosClient.get('/tournaments/active');
      const current = response.data.find((t: any) => t._id === tournamentId);
      if (current) {
        setTournament(current);
      }
    } catch (error) {
      console.error('Error fetching tournament bracket:', error);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchTournament();
    const interval = setInterval(fetchTournament, 5000); // Refresh every 5s to see progress
    return () => clearInterval(interval);
  }, [fetchTournament]);

  const handleJoinMatch = (match: any) => {
    const isHost = match.player1._id === userId;
    navigation.navigate(AuthenticatedScreens.GameScreen, {
      categoryId: tournament.category,
      isHost: isHost,
      isSinglePlayer: false,
      // In a real tournament match, we'd pass the matchId to sync specifically
    });
  };

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text>Loading Bracket...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={LobbyBg} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)']}
        style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>{tournament.name}</Text>
          <Text style={styles.status}>
            Status: {tournament.status.toUpperCase()}
          </Text>
        </View>

        <ScrollView horizontal contentContainerStyle={styles.roundsContainer}>
          {tournament.rounds.map((round: any, rIdx: number) => (
            <View key={rIdx} style={styles.roundColumn}>
              <Text style={styles.roundTitle}>ROUND {round.roundNumber}</Text>
              <ScrollView>
                {round.matches.map((match: any, mIdx: number) => {
                  const isMyMatch =
                    match.player1?._id === userId ||
                    match.player2?._id === userId;
                  const canJoin = isMyMatch && match.status === 'pending';

                  return (
                    <View
                      key={mIdx}
                      style={[
                        styles.matchCard,
                        isMyMatch && styles.myMatchCard,
                      ]}>
                      <View style={styles.playerRow}>
                        <Text
                          style={[
                            styles.playerName,
                            match.winner === match.player1?._id &&
                              styles.winner,
                          ]}>
                          {match.player1?.userName || 'TBD'}
                        </Text>
                      </View>
                      <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                      </View>
                      <View style={styles.playerRow}>
                        <Text
                          style={[
                            styles.playerName,
                            match.winner === match.player2?._id &&
                              styles.winner,
                          ]}>
                          {match.player2?.userName || 'TBD'}
                        </Text>
                      </View>

                      {canJoin && (
                        <TouchableOpacity
                          style={styles.joinButton}
                          onPress={() => handleJoinMatch(match)}>
                          <Text style={styles.joinButtonText}>PLAY NOW</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate(AuthenticatedScreens.MainMenuScreen)
          }>
          <Text style={styles.backButtonText}>EXIT TO MENU</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {flex: 1},
  gradient: {flex: 1, padding: 10},
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {alignItems: 'center', marginVertical: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: colorList.vibrantCyan},
  status: {color: colorList.neonPink, fontSize: 12, fontWeight: 'bold'},
  roundsContainer: {paddingVertical: 20},
  roundColumn: {width: 250, marginHorizontal: 15, alignItems: 'center'},
  roundTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  matchCard: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  myMatchCard: {
    borderColor: colorList.vibrantCyan,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  playerRow: {marginVertical: 5},
  playerName: {color: '#fff', fontSize: 16, textAlign: 'center'},
  winner: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    textShadowColor: colorList.vibrantCyan,
    textShadowRadius: 5,
  },
  vsContainer: {alignItems: 'center', marginVertical: 5},
  vsText: {color: colorList.softPink, fontWeight: 'bold', fontSize: 12},
  joinButton: {
    backgroundColor: colorList.brightPurple,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  joinButtonText: {color: '#fff', fontWeight: 'bold'},
  backButton: {marginTop: 'auto', padding: 15, alignItems: 'center'},
  backButtonText: {color: '#fff', opacity: 0.6},
});
