import axiosClient from './axios-client';

const baseUrl = '/lecturers';

const lecturerApi = {
  getAll: (page, limit) => {
    let url = `${baseUrl}`;

    if (page && limit)
      url += `?page=${page}&limit=${limit}`;

    return axiosClient.get(url);
  },
  getCourses: (page, limit) => {
    let url = `${baseUrl}/courses`;

    if (page && limit)
      url += `?page=${page}&limit=${limit}`;

    return axiosClient.get(url);
  },
  delete: (id) => {
    const url = `${baseUrl}/${id}`;
    return axiosClient.delete(url);
  },
  add: (params) => {
    const url = `${baseUrl}/`;
    return axiosClient.post(url, params);
  },
}

export default lecturerApi;