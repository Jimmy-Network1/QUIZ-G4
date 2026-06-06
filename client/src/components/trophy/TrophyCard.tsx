import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {ButtonComponent} from '../common';
import {colorList} from '../../constants/colors';

interface TrophyCardProps {
  winnerName: string;
  score: number;
  mode: '1v1' | 'tournament';
  onDone: () => void;
}

export default function TrophyCard({
  winnerName,
  score,
  mode,
  onDone,
}: TrophyCardProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        return;
      }
      await Share.open({
        url: uri,
        title: 'Mon trophée QuizG4',
        message: `${winnerName} a gagné avec ${score} points !`,
      });
    } catch {
      // user cancelled share
    }
  };

  return (
    <View style={styles.wrapper}>
      <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
        <View style={styles.trophyCard}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.trophyTitle}>CHAMPION</Text>
          <Text style={styles.winnerName}>{winnerName}</Text>
          <Text style={styles.scoreText}>{score} points</Text>
          <Text style={styles.modeText}>
            {mode === 'tournament' ? 'Compétition locale' : 'Duel local'}
          </Text>
          <Text style={styles.brand}>QuizG4</Text>
        </View>
      </ViewShot>

      <ButtonComponent
        title="Télécharger / Partager le trophée"
        onPress={handleShare}
        style={styles.shareButton}
      />
      <ButtonComponent
        title="Retour au Menu"
        variant="bluish"
        onPress={onDone}
        style={styles.menuButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  trophyCard: {
    width: 300,
    backgroundColor: colorList.deepBlue,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colorList.glowingYellow,
  },
  trophyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  trophyTitle: {
    color: colorList.glowingYellow,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  winnerName: {
    color: colorList.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  scoreText: {
    color: colorList.vibrantCyan,
    fontSize: 20,
    marginTop: 8,
    fontWeight: '600',
  },
  modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 16,
  },
  brand: {
    color: colorList.neonPink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 20,
    letterSpacing: 2,
  },
  shareButton: {
    marginTop: 24,
    marginHorizontal: 0,
    width: '100%',
  },
  menuButton: {
    marginTop: 12,
    marginHorizontal: 0,
    width: '100%',
  },
});
