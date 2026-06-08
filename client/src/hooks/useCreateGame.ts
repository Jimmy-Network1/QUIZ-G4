import {AuthContext} from '../store/authContext';
import {useContext} from 'react';
import useFetchTriviaCategories from './useFetchTriviaCategories';
import {AuthenticatedScreens, RootStackParamList} from '../types/navigation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SocketService} from '../services';
import {useAlert} from '../store/alertContext';

export default function useCreateGame(
  categoryName: string | null,
  categoryId: string | null,
  isSinglePlayer: boolean,
  fileData?: { data: string; mimeType: string },
) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const categories = useFetchTriviaCategories();
  const {showAlert} = useAlert();

  const {userId, userName} = useContext(AuthContext);

  function startSinglePlayerGame() {
    if (!categoryId && !fileData) {
      showAlert({
        title: 'Choix requis',
        message: 'Sélectionne une catégorie ou utilise un mode IA pour commencer !',
        type: 'warning',
      });
      return;
    }

    navigation.navigate(AuthenticatedScreens.GameScreen, {
      categoryId: categoryId || 'ai_multimodal',
      isHost: true,
      isSinglePlayer: true,
      fileData,
    });
  }

  async function createRoom() {
    if ((!categoryName || !categoryId) && !fileData) {
      showAlert({
        title: 'Salon non prêt',
        message: 'Choisis un thème pour ton arène avant d\'inviter d\'autres joueurs.',
        type: 'warning',
      });
      return;
    }
    try {
      const roomId = await SocketService.createRoom(
        categoryName || 'Analyse Multimodale',
        userId,
        userName,
      );

      if (roomId) {
        navigation.navigate(AuthenticatedScreens.GameScreen, {
          categoryId: categoryId || 'ai_multimodal',
          isHost: true,
          isSinglePlayer,
          fileData,
        });
      } else {
        showAlert({
          title: 'Échec de création',
          message: 'Impossible de créer le salon. Vérifie ta connexion.',
          type: 'error',
        });
      }
    } catch (error) {
      showAlert({
        title: 'Erreur réseau',
        message: 'L\'arène est inaccessible pour le moment. Réessaie plus tard.',
        type: 'error',
      });
      console.error("Couldn't create game room.", error);
    }
  }

  return {createRoom, startSinglePlayerGame, categories};
}
