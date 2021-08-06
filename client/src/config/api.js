/* eslint-disable no-console */
import axios from 'axios';
import apiConfig from './apiConfig';

// import { requestHandler, successHandler, errorHandler } from './requestHandler';

const api = axios.create({
  baseURL: apiConfig.baseURL,
});

export const isHandlerEnabled = (config = {}) =>
  // eslint-disable-next-line no-prototype-builtins
  !(config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled);

export const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    request.headers = {
      authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
    };
  }
  return request;
};

export const errorHandler = async (error) => {
  if (isHandlerEnabled(error.config)) {
    console.log('error', error);
    const originalRequest = error.config;
    // Handle errors
    if (
      error.response.data.error === 'invalid_token' &&
      !originalRequest.isRetryAttempt
    ) {
      const config = {
        p_client_id: 'ooredoo',
        p_refresh_token: sessionStorage.getItem('refreshToken'),
      };
      try {
        const result = await api.post(apiConfig.refreshToken, config, {
          handlerEnabled: false,
        });
        console.log('result', result);
        sessionStorage.setItem('accessToken', result.data.access_token);
        sessionStorage.setItem('refreshToken', result.data.refresh_token);
        //  return api(error.config)
        originalRequest.headers = {
          authorization: `Bearer ${result.data.access_token}`,
        };
        originalRequest.isRetryAttempt = true;
        return api(originalRequest);
      } catch (err) {
        console.log('error', error);
      }
    }
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({ ...error });
};

export const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response;
};

api.interceptors.request.use((request) => requestHandler(request));

api.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error),
);

export default api;
