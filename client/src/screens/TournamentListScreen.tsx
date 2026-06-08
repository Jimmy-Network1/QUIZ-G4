import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {LobbyBg} from '../assets/images';
import {colorList} from '../constants/colors';
import mainAxiosClient from '../api/axiosClients';
import {ButtonComponent} from '../components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

export default function TournamentListScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await mainAxiosClient.get('/tournaments/active');
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(AuthenticatedScreens.TournamentWaitingRoomScreen, {
          tournamentId: item._id,
          isCreator: false,
        })
      }>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>Host: {item.creator.userName}</Text>
      <Text style={styles.cardInfo}>
        Participants: {item.participants.length}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={LobbyBg} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)']}
        style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.title}>CHAMPIONSHIPS</Text>
          <FlatList
            data={tournaments}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No active tournaments. Create one!
              </Text>
            }
          />
          <ButtonComponent
            title="CREATE TOURNAMENT"
            onPress={() => {
              // For simplicity, we create one directly here or go to a form
              navigation.navigate(AuthenticatedScreens.CreateGameScreen, {
                isSinglePlayer: false,
              });
            }}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  gradient: {flex: 1},
  container: {flex: 1, padding: 20},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colorList.vibrantCyan,
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: colorList.brightPurple,
    textShadowRadius: 10,
  },
  list: {paddingBottom: 20},
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: colorList.softPink,
    borderWidth: 1,
  },
  cardTitle: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  cardSubtitle: {color: colorList.neonPink, fontSize: 14},
  cardInfo: {color: '#ccc', fontSize: 12, marginTop: 5},
  empty: {color: '#fff', textAlign: 'center', marginTop: 50, opacity: 0.5},
});
