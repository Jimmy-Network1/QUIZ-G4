// URL UNIQUE DE PRODUCTION (Vérifiée sur le dashboard Render)
export const RENDER_URL = 'https://quiz-g4.onrender.com'; 

let currentServerMode: 'online' | 'local' = 'online';

export const setGlobalServerMode = (mode: 'online' | 'local') => {
  currentServerMode = mode;
};

export const getBaseUrl = () => {
  if (currentServerMode === 'local') {
    return LOCAL_API_URL || 'http://10.0.2.2:5000';
  }
  return RENDER_URL; // On ne prend plus rien d'autre en mode online
};

export const apiUrl = () => `${getBaseUrl()}/api`;
export const socketUrl = () => `${getBaseUrl()}/socket`;
export const TRIVIA_CATEGORY_URL = 'https://opentdb.com/api_category.php';
export const deleteUserEndpoint = '/users/delete-user';
export const loginUserEndpoint = '/users/login';
export const registerUserEndpoint = '/users/register';
