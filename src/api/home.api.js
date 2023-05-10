import axiosClient from './axios-client';

const baseUrl = '/home';

const userApi = {
  getAll: () => {
    const url = `${baseUrl}/`;
    return axiosClient.get(url);
  }
}

export default userApi;