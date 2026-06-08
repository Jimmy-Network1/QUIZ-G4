import {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {AuthContext} from '../store/authContext';
import {
  AuthenticatedScreens,
  RootStackParamList,
  UnauthenticatedScreens,
} from '../types/navigation';
import {KeychainService, AuthService} from '../services';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAlert} from '../store/alertContext';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  UnauthenticatedScreens.LoginScreen
>;

export default function useLogin(email: string, password: string) {
  const navigation = useNavigation<LoginNavigationProp>();

  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const {showAlert} = useAlert();

  const loginHandler = async () => {
    setIsLoading(true);
    try {
      const data = await AuthService.login(email, password);

      if (data.status === 'ok') {
        const {token, email: userEmail, userName, userId} = data.data;
        authCtx.authenticate(token, userEmail, userName, userId);

        const keychainData = {token, userName, userId};
        await KeychainService.setCredentials(userEmail, keychainData);
        navigation.replace(AuthenticatedScreens.MainMenuScreen);
      } else {
        showAlert({
          title: 'Accès refusé',
          message: 'Email ou mot de passe incorrect. Es-tu sûr d\'être bien inscrit ?',
          type: 'error',
        });
      }
    } catch (error) {
      showAlert({
        title: 'Erreur de connexion',
        message: 'Le serveur est injoignable. Vérifie ton réseau et réessaie !',
        type: 'error',
      });
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {loginHandler, isLoading};
}
