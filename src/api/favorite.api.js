import axiosClient from './axios-client';

const baseUrl = '/favorites';

const favoriteApi = {
    getAll: (page, limit) => {
        let url = `${baseUrl}`;

        if (page && limit)
            url += `?page=${page}&limit=${limit}`;

        return axiosClient.get(url);
    },
    add: (params) => {
        const url = `${baseUrl}`;
        return axiosClient.post(url, params);
    },
    delete: (id) => {
        const url = `${baseUrl}/${id}`;
        return axiosClient.delete(url);
    }
}

export default favoriteApi;