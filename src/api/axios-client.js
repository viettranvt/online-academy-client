import axios from 'axios';
import { localStorageItems } from 'constants/local-storage.constant';
import queryString from 'query-string';
import authApi from './auth.api';

const accessTokenName = 'accessToken';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(localStorageItems.ACCESS_TOKEN.name);
    if (accessToken) {
      config.headers[accessTokenName] = accessToken;
    }

    return config;
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data)
      return response.data;

    return response;
  },
  async (error) => {
    if (error.response && error.response.data) {

      if (error.response.data.messages[0] === 'ACCESS_TOKEN_EXPIRED') {
        const originalRequest = error.config;
        const authUser = JSON.parse(localStorage.getItem(localStorageItems.AUTH_USER.name));
        const res = await authApi.refresh({
          accessToken: originalRequest.headers[accessTokenName],
          refreshToken: authUser.refreshToken
        });
        const { accessToken } = res.data;
        localStorage.setItem(localStorageItems.ACCESS_TOKEN.name, accessToken);
        originalRequest.headers[accessTokenName] = accessToken;
        return await axiosClient.request(originalRequest);
      }

      throw error.response.data;
    }

    throw error;
  }
);

export default axiosClient;