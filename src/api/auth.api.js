import axiosClient from './axios-client';

const baseUrl = '/auth';

const authApi = {
  register: (params) => {
    const url = `${baseUrl}/register`;
    return axiosClient.post(url, params);
  },
  confirm: (params) => {
    const url = `${baseUrl}/confirm`;
    return axiosClient.post(url, params);
  },
  login: (params) => {
    const url = `${baseUrl}/login`;
    return axiosClient.post(url, params);
  },
  refresh: (params) => {
    const url = `${baseUrl}/refresh`;
    return axiosClient.post(url, params);
  },
  updatePassword: (params) => {
    const url = `${baseUrl}/password`;
    return axiosClient.put(url, params);
  },
  sendOtp: (params) => {
    const url = `${baseUrl}/otp-code`;
    return axiosClient.post(url, params);
  },
}

export default authApi;