import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import TrophyCard from '../../components/trophy/TrophyCard';
import {ButtonComponent} from '../../components';

interface LocalEndGameScreenProps {
  playerScore: number;
  opponentScore: number;
  gameMode: '1v1' | 'tournament';
  rankings: {pseudo: string; score: number}[];
  isWinner: boolean;
  winnerName: string;
  onLeave: () => void;
}

export default function LocalEndGameScreen({
  playerScore,
  opponentScore,
  gameMode,
  rankings,
  isWinner,
  winnerName,
  onLeave,
}: LocalEndGameScreenProps) {
  const isDraw =
    gameMode === '1v1' && playerScore === opponentScore && rankings.length >= 2;

  let message = isWinner ? 'Victoire ! 🏆' : 'Partie terminée';
  if (isDraw) {
    message = 'Égalité ! 🤝';
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.bg}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.8)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.glassCard}>
            <Text style={styles.sectionTitle}>CLASSEMENT</Text>
            {rankings.map((r, i) => (
              <Text key={`${r.pseudo}-${i}`} style={styles.rankRow}>
                {i + 1}. {r.pseudo} — {r.score} pts
              </Text>
            ))}
          </View>

          {isWinner && !isDraw && (
            <TrophyCard
              winnerName={winnerName}
              score={rankings[0]?.score ?? playerScore}
              mode={gameMode}
              onDone={onLeave}
            />
          )}

          {(!isWinner || isDraw) && (
            <View style={styles.footer}>
              {!isWinner && gameMode === '1v1' && !isDraw && (
                <Text style={styles.lostText}>
                  Le trophée revient à {winnerName}
                </Text>
              )}
              <ButtonComponent
                title="Retour au Menu"
                variant="bluish"
                onPress={onLeave}
                style={styles.menuButton}
              />
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  bg: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 32,
    fontWeight: '900',
    color: colorList.vibrantCyan,
    marginBottom: 24,
    textAlign: 'center',
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 2,
  },
  rankRow: {
    color: colorList.white,
    fontSize: 16,
    marginVertical: 4,
  },
  footer: {marginTop: 20, width: '100%'},
  lostText: {color: '#ccc', textAlign: 'center', marginBottom: 16},
  menuButton: {marginHorizontal: 0, height: 55},
});
