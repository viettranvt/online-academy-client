export const actionTypes = {
  app: {
    SWITCH_DARK_MODE: { type: 'SWITCH_DARK_MODE' },
    SET_LOADING: { type: 'SET_LOADING' },
    SHOW_NOTIFICATION: { type: 'SHOW_NOTIFICATION' },
    HIDE_NOTIFICATION: { type: 'HIDE_NOTIFICATION' },
    SET_ACTIVE_PAGE: { type: 'SET_ACTIVE_PAGE' },
    SET_COURSE_SEARCHING_QUERY: { type: 'SET_COURSE_SEARCHING_QUERY' },
    SET_CATEGORY_CLUSTER_LIST: { type: 'SET_CATEGORY_CLUSTER_LIST' },
  },
  page: {
    SET_PAGE_BASICS: { type: 'SET_PAGE_BASICS' },
    SET_PAGE_LOADING: { type: 'SET_PAGE_LOADING' }
  },
  user: {
    SIGN_IN: { type: 'SIGN_IN' },
    SIGN_OUT: { type: 'SIGN_OUT' }
  }
}