import {API_URL, LOCAL_API_URL} from '@env';

let currentServerMode: 'online' | 'local' = 'online';

export const setGlobalServerMode = (mode: 'online' | 'local') => {
  currentServerMode = mode;
};

export const getBaseUrl = () => {
  return currentServerMode === 'local' ? LOCAL_API_URL : API_URL;
};

export const apiUrl = () => `${getBaseUrl()}/api`;
export const socketUrl = () => `${getBaseUrl()}/socket`;
export const TRIVIA_CATEGORY_URL = 'https://opentdb.com/api_category.php';
export const deleteUserEndpoint = '/users/delete-user';
export const loginUserEndpoint = '/users/login';
export const registerUserEndpoint = '/users/register';
