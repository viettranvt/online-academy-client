import { actionTypes } from '../actions/action-types';
import { localStorageItems } from 'constants/local-storage.constant';

const currentDarkMode = localStorage.getItem(localStorageItems.DARK_MODE.name);
const urlParams = new URLSearchParams(window.location.search);

const initialStates = {
  darkMode: currentDarkMode ? (currentDarkMode === 'true') : true,
  isLoading: false,
  notification: {
    type: '',
    message: ''
  },
  isNotificationOpened: false,
  activePage: null,
  courseSearchingQuery: urlParams ? urlParams.get('q') : '',
  categoryClusterList: [],
}

const appActionTypes = { ...actionTypes.app };

const appReducer = (states = initialStates, action) => {
  switch (action.type) {
    case appActionTypes.SWITCH_DARK_MODE:
      localStorage.setItem(localStorageItems.DARK_MODE.name, !states.darkMode);
      return { ...states, darkMode: !states.darkMode };

    case appActionTypes.SET_LOADING:
      return { ...states, isLoading: action.payload };

    case appActionTypes.SHOW_NOTIFICATION:
      return { ...states, notification: action.payload, isNotificationOpened: true };

    case appActionTypes.HIDE_NOTIFICATION:
      return { ...states, isNotificationOpened: false }

    case appActionTypes.SET_ACTIVE_PAGE:
      return { ...states, activePage: action.payload }

    case appActionTypes.SET_COURSE_SEARCHING_QUERY:
      return { ...states, courseSearchingQuery: action.payload }

    case appActionTypes.SET_CATEGORY_CLUSTER_LIST:
      return { ...states, categoryClusterList: action.payload }

    default:
      return states;
  }
}

export default appReducer;