import {useEffect, useState, useCallback} from 'react';
import {QuestionInterface} from '../types/questions';
import {useGameContext} from '../store/gameContext';
import LocalP2PService from '../services/local/LocalP2PService';
import BluetoothService from '../services/local/BluetoothService';

export default function useLocalGameLogic(
  questions: QuestionInterface[] | null,
  isHost: boolean,
  gameMode: '1v1' | 'tournament',
  onGameOver: (rankings: {pseudo: string; score: number}[]) => void,
  connectionType: 'wifi' | 'bluetooth' = 'wifi',
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
    (message: any) => {
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
    if (connectionType === 'wifi') {
      LocalP2PService.setMessageHandler(handleMessage);
    } else {
      BluetoothService.setMessageHandler(handleMessage);
    }
    return () => {
      LocalP2PService.setMessageHandler(null);
      BluetoothService.setMessageHandler(() => {});
    };
  }, [handleMessage, connectionType]);

  const sendScoreUpdate = (score: number, nextIdx: number) => {
    if (connectionType === 'wifi') {
      LocalP2PService.sendScoreUpdate(score, nextIdx);
    } else {
      BluetoothService.send({
        type: 'OPPONENT_SCORE',
        opponentScore: score,
        nextQuestionIndex: nextIdx,
      });
    }
  };

  const handleTimeElapsed = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    if (gameMode === '1v1') {
      sendScoreUpdate(playerScore, nextIndex);
    }
  };

  const isAnswerCorrect = (answer: string): boolean => {
    return (
      questions !== null &&
      questions[currentQuestionIndex] &&
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
    sendScoreUpdate(updatedPlayerScore, nextIndex);
  };

  useEffect(() => {
    setIsAnswered(false);
    setSelectedAnswer('');
    setAnsweredCorrect(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    triggerResetTimer();
  }, [currentQuestionIndex, triggerResetTimer]);

  useEffect(() => {
    if (
      isHost &&
      questions &&
      currentQuestionIndex >= questions.length &&
      questions.length > 0 &&
      !gameEnded
    ) {
      setGameEnded(true);

      let rankings = [];
      if (connectionType === 'wifi') {
        const players = LocalP2PService.getPlayers();
        const updatedPlayers = players.map(p =>
          p.socketId === 'host' ? {...p, score: playerScore} : p,
        );
        rankings = [...updatedPlayers]
          .sort((a, b) => b.score - a.score)
          .map(p => ({pseudo: p.pseudo, score: p.score}));
        LocalP2PService.endGame(rankings);
      } else {
        // Bluetooth simple ranking
        rankings = [
          {pseudo: 'Hôte', score: playerScore},
          {pseudo: 'Adversaire', score: opponentScore},
        ].sort((a, b) => b.score - a.score);
        BluetoothService.send({type: 'GAME_OVER', rankings});
      }
      onGameOver(rankings);
    }
  }, [
    currentQuestionIndex,
    questions,
    gameEnded,
    isHost,
    onGameOver,
    playerScore,
    connectionType,
    opponentScore,
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
