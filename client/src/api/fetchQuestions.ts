import axios from 'axios';
import {QuestionInterface} from '../types/questions';
import mainAxiosClient from './axiosClients';
import {getOfflineQuestionsForGame} from '../services/OfflineQuestionService';

const ID_TO_THEME: {[key: string]: string} = {
  '9': 'Culture Générale',
  '10': 'Littérature',
  '11': 'Cinéma',
  '12': 'Musique',
  '13': 'Théâtre',
  '14': 'Télévision',
  '15': 'Jeux Vidéo',
  '16': 'Jeux de Société',
  '17': 'Sciences et Nature',
  '18': 'Informatique',
  '19': 'Mathématiques',
  '20': 'Mythologie',
  '21': 'Sports',
  '22': 'Géographie',
  '23': 'Histoire',
  '24': 'Politique',
  '25': 'Art',
  '26': 'Célébrités',
  '27': 'Animaux',
  '28': 'Véhicules',
  '29': 'BD / Comics',
  '30': 'Gadgets',
  '31': 'Anime Japonais et Manga',
  '32': 'Dessins Animés',
};

export async function fetchQuestionsFromAPI(
  categoryId: string,
  amount = 10,
  fileData?: { data: string; mimeType: string },
): Promise<QuestionInterface[] | null> {
  if (!categoryId && !fileData) {
    return null;
  }

  // Déterminer le thème pour l'IA
  let theme = '';
  if (typeof categoryId === 'string' && categoryId.startsWith('ai_')) {
    theme = categoryId.replace('ai_', '');
  } else if (ID_TO_THEME[categoryId]) {
    theme = ID_TO_THEME[categoryId];
  }

  // 1. SI ON A UN THÈME OU UN FICHIER, ON UTILISE L'IA
  if (theme || fileData) {
    try {
      const response = await mainAxiosClient.post('/ai/generate', {
        theme: theme || 'Analyse Multimodale',
        count: amount,
        fileData,
      });
      if (response && response.data && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.error('Failed to fetch AI questions: ', err);
    }
  }

  // 2. TENTATIVE LOCAL (INSTANTANÉ)
  try {
    const localQuestions = getOfflineQuestionsForGame(categoryId, amount);
    if (localQuestions && localQuestions.length > 0 && categoryId !== 'all') {
      return localQuestions;
    }
  } catch (e) {
    console.warn('Local fetch failed');
  }

  // 3. TENTATIVE API (ANGLAIS - UNIQUEMENT EN DERNIER RECOURS)
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}`;
    const response = await axios.get(url, {timeout: 4000});
    if (response.data.response_code === 0) {
      return response.data.results;
    }
  } catch (err) {
    console.error('API fetch failed');
  }

  // 4. ULTIME RECOURS : QUESTIONS LOCALES GÉNÉRIQUES
  return getOfflineQuestionsForGame('all', amount);
}

