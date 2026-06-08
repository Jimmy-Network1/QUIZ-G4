import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {ButtonComponent} from '../components/common';
import {useNavigation} from '@react-navigation/native';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LoginScreenBg} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {colorList} from '../constants/colors';

interface EndGameScreenProps {
  playerScore: number;
  opponentScore: number;
  isSinglePlayer: boolean;
}

type EndGameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  AuthenticatedScreens.GameScreen
>;

export default function EndGameScreen({
  playerScore,
  opponentScore,
  isSinglePlayer,
}: EndGameScreenProps) {
  const navigation = useNavigation<EndGameScreenNavigationProp>();
  const didWin = playerScore > opponentScore;
  const isDraw = playerScore === opponentScore;

  let message;
  let statusColor = colorList.vibrantCyan;

  if (isSinglePlayer) {
    message = 'Partie Terminée !';
    statusColor = colorList.neonPink;
  } else if (isDraw) {
    message = 'Égalité ! 🤝';
    statusColor = colorList.glowingYellow;
  } else {
    message = didWin ? 'Victoire ! 🏆' : 'Défaite... 🥲';
    statusColor = didWin ? colorList.green : colorList.red;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={LoginScreenBg}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 2, 53, 0.8)', colorList.darkBackgroundBlue]}
          style={styles.overlay}>
          <View style={styles.content}>
            <Text style={[styles.message, {color: statusColor}]}>
              {message}
            </Text>

            <View style={styles.glassCard}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>VOTRE SCORE</Text>
                <Text style={styles.scoreValue}>{playerScore}</Text>
              </View>

              {!isSinglePlayer && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>ADVERSAIRE</Text>
                    <Text style={styles.scoreValue}>{opponentScore}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.footer}>
              <ButtonComponent
                title="Retour au Menu"
                variant="bluish"
                onPress={() =>
                  navigation.replace(AuthenticatedScreens.MainMenuScreen)
                }
                style={styles.button}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: colorList.darkBackgroundBlue,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  scoreRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  scoreValue: {
    color: colorList.white,
    fontSize: 64,
    fontWeight: '900',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  footer: {
    width: '100%',
    marginTop: 50,
  },
  button: {
    marginHorizontal: 0,
    height: 60,
  },
});
