import axiosClient from './axios-client';
import axiosClient2 from './axios-client-2';
import { parseFormData } from 'helpers';

const baseUrl = '/courses';

const courseApi = {
    getAll: ({ page, limit, keyword, isSortUpAscending, sortBy, categoryId }) => {
        let url = `${baseUrl}`;

        if (page && limit)
            url += `?page=${page}&limit=${limit}`;

        if (keyword)
            url += `&keyword=${keyword}`;

        if (!isNaN(Number(isSortUpAscending)) && sortBy)
            url += `&isSortUpAscending=${isSortUpAscending}&sortBy=${sortBy}`;

        if (categoryId)
            url += `&categoryId=${categoryId}`;

        return axiosClient.get(url);
    },
    single: (id) => {
        const url = `${baseUrl}/${id}`;
        return axiosClient.get(url);
    },
    register: (id) => {
        const url = `${baseUrl}/${id}/registrations`;
        return axiosClient.post(url);
    },
    getFeedbacks: (id, page, limit) => {
        let url = `${baseUrl}/${id}/feedbacks`;

        if (page && limit)
            url += `?page=${page}&limit=${limit}`;

        return axiosClient.get(url);
    },
    addFeedback: (id, params) => {
        const url = `${baseUrl}/${id}/feedbacks`;
        return axiosClient.post(url, params);
    },
    add: (params) => {
        const url = `${baseUrl}`;
        return axiosClient2.post(url, parseFormData(params));
    },
    getChapters: (id) => {
        const url = `${baseUrl}/${id}/chapters`;
        return axiosClient.get(url);
    },
    getChapterVideos: (courseId, chapterId) => {
        const url = `${baseUrl}/${courseId}/chapters/${chapterId}/videos`;
        return axiosClient.get(url);
    },
    getVideoWatchings: (id, page, limit) => {
        let url = `${baseUrl}/${id}/video-watchings`;

        if (page && limit)
            url += `?page=${page}&limit=${limit}`;

        return axiosClient.get(url);
    },
    update: (id, params) => {
        const url = `${baseUrl}/${id}`;
        return axiosClient2.put(url, parseFormData(params));
    },
    addVideoWatching: (courseId, params) => {
        const url = `${baseUrl}/${courseId}/video-watchings`;
        return axiosClient.post(url, params);
    },
    addChapter: (courseId, params) => {
        const url = `${baseUrl}/${courseId}/chapters`;
        return axiosClient.post(url, params);
    },
    addChapterVideo: (courseId, chapterId, params) => {
        const url = `${baseUrl}/${courseId}/chapters/${chapterId}/videos`;
        return axiosClient2.post(url, parseFormData(params));
    },
    delete: (id) => {
        const url = `${baseUrl}/${id}`;
        return axiosClient.delete(url);
    }
}

export default courseApi;