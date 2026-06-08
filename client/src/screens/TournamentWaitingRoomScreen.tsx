import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {View, Text, StyleSheet, ImageBackground, Animated} from 'react-native';
import {LobbyBg} from '../assets/images';
import {colorList} from '../constants/colors';
import socket from '../services/SocketService';
import {AuthContext} from '../store/authContext';
import {ButtonComponent} from '../components';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import mainAxiosClient from '../api/axiosClients';

export default function TournamentWaitingRoomScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const {tournamentId, isCreator} = route.params;
  const {userId, userName} = useContext(AuthContext);

  const [_participants, setParticipants] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchTournamentData = useCallback(async () => {
    try {
      const response = await mainAxiosClient.get('/tournaments/active');
      const current = response.data.find((t: any) => t._id === tournamentId);
      if (current) {
        setParticipants(current.participants);
        setParticipantCount(current.participants.length);
      }
    } catch (error) {
      console.error('Error fetching tournament details:', error);
    }
  }, [tournamentId]);

  useEffect(() => {
    // Pulse animation logic
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    // Join tournament room
    socket.emit('tournament_join', {tournamentId, userId, userName});

    socket.on('participant_count', (count: number) => {
      setParticipantCount(count);
    });

    socket.on('tournament_started', () => {
      (navigation as any).replace(
        AuthenticatedScreens.TournamentBracketScreen,
        {
          tournamentId,
        },
      );
    });

    fetchTournamentData();

    return () => {
      socket.off('participant_count');
      socket.off('tournament_started');
      pulse.stop();
    };
  }, [
    tournamentId,
    pulseAnim,
    userId,
    userName,
    navigation,
    fetchTournamentData,
  ]);

  const handleStart = async () => {
    try {
      await mainAxiosClient.post('/tournaments/start', {tournamentId});
      socket.emit('tournament_start', {tournamentId});
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  return (
    <ImageBackground source={LobbyBg} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.title}>ARENA LOBBY</Text>
          <Animated.View
            style={[styles.counterBox, {transform: [{scale: pulseAnim}]}]}>
            <Text style={styles.counterText}>{participantCount}</Text>
            <Text style={styles.counterLabel}>PLAYERS READY</Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>PARTICIPANTS</Text>
          <Text style={styles.waitingText}>Waiting for more champions...</Text>

          <View style={styles.footer}>
            {isCreator ? (
              <ButtonComponent
                title="START COMPETITION"
                onPress={handleStart}
                disabled={participantCount < 2}
              />
            ) : (
              <Text style={styles.footerInfo}>
                Waiting for host to start...
              </Text>
            )}
            <ButtonComponent
              variant="default"
              title="LEAVE"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  gradient: {flex: 1},
  container: {flex: 1, padding: 30, alignItems: 'center'},
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colorList.vibrantCyan,
    marginBottom: 40,
  },
  counterBox: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: colorList.softPink,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,255,0.1)',
    marginBottom: 40,
    shadowColor: colorList.softPink,
    shadowRadius: 20,
    elevation: 20,
  },
  counterText: {fontSize: 60, fontWeight: 'bold', color: '#fff'},
  counterLabel: {fontSize: 12, color: colorList.neonPink, fontWeight: 'bold'},
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  waitingText: {color: '#ccc', fontStyle: 'italic', marginTop: 20},
  footer: {width: '100%', marginTop: 'auto'},
  footerInfo: {
    color: colorList.vibrantCyan,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
});
