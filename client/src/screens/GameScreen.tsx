import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ImageBackground,
} from 'react-native';
import React from 'react';
import EndGameScreen from './EndGameScreen';
import LoadingScreen from './LoadingScreen';
import {colorList} from '../constants/colors';
import {useGameLogic, useSocketLogic, useQuestions} from '../hooks';
import {TimeBar, ScorePanel, Question, ButtonComponent} from '../components';
import {
  AuthenticatedScreens,
  GameScreenParams,
  RootStackParamList,
} from '../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoginScreenBg} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<
  RootStackParamList,
  AuthenticatedScreens.GameScreen
>;

export default function GameScreen({route, navigation}: Props): JSX.Element {
  const {categoryId, isHost, isSinglePlayer, fileData} = route.params;

  const {questions, setQuestions} = useQuestions(categoryId, isHost, fileData);

  const {
    gameEnded,
    currentQuestionIndex,
    playerScore,
    opponentScore,
    answeredCorrect,
    selectedAnswer,
    isAnswered,
    handleOptionPress,
    handleTimeElapsed,
  } = useGameLogic(questions);

  const opponent = useSocketLogic(isHost, questions, setQuestions);

  const isWaitingForOpponent = isHost && !opponent && !isSinglePlayer;

  if (gameEnded) {
    return (
      <EndGameScreen
        playerScore={playerScore}
        opponentScore={opponentScore}
        isSinglePlayer={isSinglePlayer}
      />
    );
  }

  if (isWaitingForOpponent) {
    return (
      <LoadingScreen
        text="En attente d'un adversaire..."
        buttonText="Annuler"
      />
    );
  }

  if (questions) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={LoginScreenBg} style={styles.backgroundImage}>
          <LinearGradient
            colors={['rgba(11, 2, 53, 0.8)', colorList.darkBackgroundBlue]}
            style={styles.overlay}>
            <View style={styles.gameHeader}>
              <ScorePanel
                playerScore={playerScore}
                opponentScore={opponentScore}
                isSinglePlayer={isSinglePlayer}
              />
              <View style={styles.timerWrapper}>
                <TimeBar onTimeElapsed={handleTimeElapsed} />
              </View>
            </View>

            <View style={styles.questionContainer}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Question {currentQuestionIndex + 1} / {questions.length}
                </Text>
              </View>

              <View style={styles.glassCard}>
                <Question
                  questionObj={questions[currentQuestionIndex]}
                  onOptionPress={selected => handleOptionPress(selected)}
                  isAnswered={isAnswered}
                  answeredCorrect={answeredCorrect}
                  selectedAnswer={selectedAnswer}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <ButtonComponent
                title="Quitter la partie"
                variant="bluish"
                onPress={() =>
                  navigation.replace(AuthenticatedScreens.MainMenuScreen)
                }
                style={styles.quitButton}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <LoadingScreen text="Chargement des questions..." buttonText="Retour" />
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
    paddingHorizontal: 20,
  },
  gameHeader: {
    paddingVertical: 20,
  },
  timerWrapper: {
    marginTop: 15,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressText: {
    color: colorList.vibrantCyan,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 350,
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: 30,
  },
  quitButton: {
    marginHorizontal: 0,
    height: 50,
    opacity: 0.8,
  },
});
