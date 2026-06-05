import axios from 'axios';
import {apiUrl} from '../config';

// the main api's url
const mainAxiosClient = axios.create({
  timeout: 10000,
});

mainAxiosClient.interceptors.request.use(config => {
  config.baseURL = apiUrl();
  return config;
});

mainAxiosClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = formatErrorMessage(error);
    console.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  },
);

function formatErrorMessage(error: any) {
  if (error.response) {
    const {status, statusText, config, data} = error.response;
    return `
      API call error:
      URL: ${config.url}
      Method: ${config.method.toUpperCase()}
      Status: ${status} ${statusText}
      Response Data: ${data ? JSON.stringify(data) : 'N/A'}
    `;
  } else if (error.request) {
    return `
      API call error:
      No response received.
      Request: ${JSON.stringify(error.request)}
    `;
  } else {
    return `
      API call error:
      Message: ${error.message}
    `;
  }
}

export default mainAxiosClient;
