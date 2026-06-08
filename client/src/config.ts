import {API_URL, LOCAL_API_URL} from '@env';

// Remplacez cette URL par votre URL Render réelle après le déploiement
export const RENDER_URL = 'https://quiz-g4-backend.onrender.com'; 

let currentServerMode: 'online' | 'local' = 'online';

export const setGlobalServerMode = (mode: 'online' | 'local') => {
  currentServerMode = mode;
};

export const getBaseUrl = () => {
  if (currentServerMode === 'local') {
    return LOCAL_API_URL;
  }
  // En mode online, on peut basculer entre l'API_URL (.env) ou RENDER_URL
  return API_URL || RENDER_URL;
};

export const apiUrl = () => `${getBaseUrl()}/api`;
export const socketUrl = () => `${getBaseUrl()}/socket`;
export const TRIVIA_CATEGORY_URL = 'https://opentdb.com/api_category.php';
export const deleteUserEndpoint = '/users/delete-user';
export const loginUserEndpoint = '/users/login';
export const registerUserEndpoint = '/users/register';
