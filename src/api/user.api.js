import { parseFormData } from 'helpers';
import axiosClient from './axios-client';
import axiosClient2 from './axios-client-2';

const baseUrl = '/users';

const userApi = {
  single: () => {
    const url = `${baseUrl}/`;
    return axiosClient.get(url);
  },
  update: (params) => {
    const url = `${baseUrl}/`;
    return axiosClient2.put(url, parseFormData(params));
  },
  updateByAdminRole: (id, params) => {
    const url = `${baseUrl}/${id}`;
    return axiosClient.put(url, params);
  },
}

export default userApi;