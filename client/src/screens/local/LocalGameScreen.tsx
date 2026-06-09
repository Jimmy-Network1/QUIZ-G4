import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ImageBackground,
} from 'react-native';
import {LoginScreenBg} from '../../assets/images';
import {colorList} from '../../constants/colors';
import {TimeBar, ScorePanel, Question, ButtonComponent} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {AuthenticatedScreens, RootStackParamList} from '../../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LoadingScreen from '../LoadingScreen';
import LocalEndGameScreen from './LocalEndGameScreen';
import useLocalGameLogic from '../../hooks/useLocalGameLogic';
import {getOfflineQuestionsForGame} from '../../services/OfflineQuestionService';
import LocalP2PService from '../../services/local/LocalP2PService';
import {QuestionInterface} from '../../types/questions';
import {LocalMessage} from '../../types/LocalP2P';
import {AuthContext} from '../../store/authContext';

type Route = {
  params: {
    isHost: boolean;
    gameMode: '1v1' | 'tournament';
    categoryId: string;
    questions?: QuestionInterface[];
  };
};

type Nav = NativeStackNavigationProp<
  RootStackParamList,
  AuthenticatedScreens.LocalGameScreen
>;

export default function LocalGameScreen({route}: {route: Route}): JSX.Element {
  const navigation = useNavigation<Nav>();
  const {userName} = useContext(AuthContext);
  const {
    isHost,
    gameMode,
    categoryId,
    questions: initialQuestions,
  } = route.params;

  const [questions, setQuestions] = useState<QuestionInterface[] | null>(
    initialQuestions ??
      (isHost ? getOfflineQuestionsForGame(categoryId) : null),
  );
  const [rankings, setRankings] = useState<
    {pseudo: string; score: number}[] | null
  >(null);

  const onGameOver = useCallback(
    (finalRankings: {pseudo: string; score: number}[]) => {
      setRankings(finalRankings);
    },
    [],
  );

  useEffect(() => {
    if (!isHost) {
      LocalP2PService.setMessageHandler((message: LocalMessage) => {
        if (message.type === 'START_GAME') {
          setQuestions(message.questions);
        }
      });
    }
  }, [isHost]);

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
  } = useLocalGameLogic(
    questions,
    isHost,
    gameMode,
    onGameOver,
    connectionType,
  );

  const handleLeave = () => {
    LocalP2PService.disconnect();
    navigation.replace(AuthenticatedScreens.MainMenuScreen);
  };

  if (
    questions &&
    currentQuestionIndex >= questions.length &&
    !gameEnded &&
    !isHost
  ) {
    return (
      <LoadingScreen text="Calcul des résultats..." buttonText="Quitter" />
    );
  }

  if (gameEnded && rankings) {
    const winner = rankings[0];
    const isWinner = winner?.pseudo === userName;
    return (
      <LocalEndGameScreen
        playerScore={playerScore}
        opponentScore={opponentScore}
        gameMode={gameMode}
        rankings={rankings}
        isWinner={isWinner}
        winnerName={winner?.pseudo ?? userName}
        onLeave={handleLeave}
      />
    );
  }

  if (!questions) {
    return (
      <LoadingScreen
        text="En attente des questions de l'hôte..."
        buttonText="Quitter"
      />
    );
  }

  const isSinglePlayer = gameMode === 'tournament';

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
                Question {Math.min(currentQuestionIndex + 1, questions.length)}{' '}
                / {questions.length}
              </Text>
            </View>

            {currentQuestionIndex < questions.length && (
              <View style={styles.glassCard}>
                <Question
                  questionObj={questions[currentQuestionIndex]}
                  onOptionPress={handleOptionPress}
                  isAnswered={isAnswered}
                  answeredCorrect={answeredCorrect}
                  selectedAnswer={selectedAnswer}
                />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <ButtonComponent
              title="Quitter la partie"
              variant="bluish"
              onPress={handleLeave}
              style={styles.quitButton}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  backgroundImage: {flex: 1, backgroundColor: colorList.darkBackgroundBlue},
  overlay: {flex: 1, paddingHorizontal: 20},
  gameHeader: {paddingVertical: 20},
  timerWrapper: {
    marginTop: 15,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionContainer: {flex: 1, justifyContent: 'center'},
  progressContainer: {alignItems: 'center', marginBottom: 15},
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
  footer: {paddingBottom: 30},
  quitButton: {marginHorizontal: 0, height: 50, opacity: 0.8},
});
height: 50, opacity: 0.8},
});
