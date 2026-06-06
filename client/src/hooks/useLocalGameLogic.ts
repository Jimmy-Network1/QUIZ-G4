import {useEffect, useState, useCallback} from 'react';
import {QuestionInterface} from '../types/questions';
import {useGameContext} from '../store/gameContext';
import LocalP2PService from '../services/local/LocalP2PService';
import {LocalMessage} from '../types/LocalP2P';

export default function useLocalGameLogic(
  questions: QuestionInterface[] | null,
  isHost: boolean,
  gameMode: '1v1' | 'tournament',
  onGameOver: (rankings: {pseudo: string; score: number}[]) => void,
) {
  const {triggerResetTimer} = useGameContext();

  const [gameEnded, setGameEnded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleMessage = useCallback(
    (message: LocalMessage) => {
      if (message.type === 'OPPONENT_SCORE') {
        setOpponentScore(message.opponentScore);
        setCurrentQuestionIndex(message.nextQuestionIndex);
      }
      if (message.type === 'GAME_OVER') {
        setGameEnded(true);
        onGameOver(message.rankings);
      }
    },
    [onGameOver],
  );

  useEffect(() => {
    LocalP2PService.setMessageHandler(handleMessage);
    return () => LocalP2PService.setMessageHandler(null);
  }, [handleMessage]);

  const handleTimeElapsed = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    if (gameMode === '1v1') {
      LocalP2PService.sendScoreUpdate(playerScore, nextIndex);
    }
  };

  const isAnswerCorrect = (answer: string): boolean => {
    return (
      questions !== null &&
      answer === questions[currentQuestionIndex].correct_answer
    );
  };

  const handleOptionPress = (answer: string) => {
    if (isAnswered) {
      return;
    }

    let updatedPlayerScore = playerScore;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (isAnswerCorrect(answer)) {
      setAnsweredCorrect(true);
      updatedPlayerScore += 10;
    } else {
      setAnsweredCorrect(false);
    }

    const nextIndex = currentQuestionIndex + 1;
    setPlayerScore(updatedPlayerScore);
    setCurrentQuestionIndex(nextIndex);
    LocalP2PService.sendScoreUpdate(updatedPlayerScore, nextIndex);
  };

  useEffect(() => {
    setIsAnswered(false);
    setSelectedAnswer('');
    setAnsweredCorrect(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    triggerResetTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (
      isHost &&
      questions &&
      currentQuestionIndex >= questions.length &&
      questions.length > 0 &&
      !gameEnded
    ) {
      setGameEnded(true);
      const players = LocalP2PService.getPlayers();
      const updatedPlayers = players.map(p =>
        p.socketId === 'host' ? {...p, score: playerScore} : p,
      );
      const rankings = [...updatedPlayers]
        .sort((a, b) => b.score - a.score)
        .map(p => ({pseudo: p.pseudo, score: p.score}));
      LocalP2PService.endGame(rankings);
      onGameOver(rankings);
    }
  }, [
    currentQuestionIndex,
    questions,
    gameEnded,
    isHost,
    onGameOver,
    playerScore,
  ]);

  return {
    gameEnded,
    currentQuestionIndex,
    playerScore,
    opponentScore,
    answeredCorrect,
    selectedAnswer,
    isAnswered,
    handleOptionPress,
    handleTimeElapsed,
  };
}
