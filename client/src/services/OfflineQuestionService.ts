import offlineQuestions from '../data/offlineQuestions.json';
import {QuestionInterface} from '../types/questions';
import {prepareQuestions} from '../util/questions';
import {LOCAL_QUESTIONS_PER_GAME} from '../constants/local';
import {decode} from 'html-entities';

type RawQuestion = Omit<QuestionInterface, 'all_answers'>;

const decodedQuestions: RawQuestion[] = (offlineQuestions as RawQuestion[]).map(
  q => ({
    ...q,
    question: decode(q.question),
    correct_answer: decode(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(a => decode(a)),
  }),
);

export function getOfflineCategories(): {id: string; name: string}[] {
  const categories = new Set(decodedQuestions.map(q => q.category));
  return Array.from(categories).map(name => ({
    id: name,
    name,
  }));
}

export function getOfflineQuestionsForGame(
  categoryId: string,
  count = LOCAL_QUESTIONS_PER_GAME,
): QuestionInterface[] {
  const pool =
    categoryId === 'all'
      ? decodedQuestions
      : decodedQuestions.filter(q => q.category === categoryId);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return prepareQuestions(selected as QuestionInterface[]);
}
