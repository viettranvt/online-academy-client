import axiosClient from './axios-client';

const baseUrl = '/categories';

const categoryApi = {
  add: (params) => {
    const url = `${baseUrl}`;
    return axiosClient.post(url, params);
  },
  delete: (id) => {
    const url = `${baseUrl}/${id}`;
    return axiosClient.delete(url);
  },
  update: (id, params) => {
    const url = `${baseUrl}/${id}`;
    return axiosClient.put(url, params);
  },
  getCourses: (id, page, limit) => {
    let url = `${baseUrl}/${id}/courses`;

    if (page && limit)
    url += `?page=${page}&limit=${limit}`;
    
    return axiosClient.get(url);
  },
}

export default categoryApi;