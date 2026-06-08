import {API_URL, LOCAL_API_URL} from '@env';

// URL de votre backend sur Render
export const RENDER_URL = 'https://quiz-g4-backend.onrender.com'; 

let currentServerMode: 'online' | 'local' = 'online';

export const setGlobalServerMode = (mode: 'online' | 'local') => {
  currentServerMode = mode;
};

export const getBaseUrl = () => {
  if (currentServerMode === 'local') {
    return LOCAL_API_URL || 'http://localhost:5000';
  }
  // On utilise RENDER_URL en priorité, sinon l'API_URL du .env
  return RENDER_URL || API_URL;
};

export const apiUrl = () => `${getBaseUrl()}/api`;
export const socketUrl = () => `${getBaseUrl()}/socket`;
export const TRIVIA_CATEGORY_URL = 'https://opentdb.com/api_category.php';
export const deleteUserEndpoint = '/users/delete-user';
export const loginUserEndpoint = '/users/login';
export const registerUserEndpoint = '/users/register';
