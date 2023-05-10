import { actionTypes } from './action-types';

const appActionTypes = { ...actionTypes.app };

export const switchDarkMode = () => {
  return {
    type: appActionTypes.SWITCH_DARK_MODE
  }
}

export const setLoading = (isLoading) => {
  return {
    type: appActionTypes.SET_LOADING,
    payload: isLoading
  }
}

export const showNotification = (type, message) => {
  return {
    type: appActionTypes.SHOW_NOTIFICATION,
    payload: { type, message }
  }
}

export const hideNotification = () => {
  return {
    type: appActionTypes.HIDE_NOTIFICATION
  }
}

export const setActivePage = (page) => {
  return {
    type: appActionTypes.SET_ACTIVE_PAGE,
    payload: page
  }
}

export const setCourseSearchingQuery = (query) => {
  return {
    type: appActionTypes.SET_COURSE_SEARCHING_QUERY,
    payload: query
  }
}

export const setAppCategoryClusterList = (list) => {
  return {
    type: appActionTypes.SET_CATEGORY_CLUSTER_LIST,
    payload: list
  }
}