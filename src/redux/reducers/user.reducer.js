import { actionTypes } from '../actions/action-types';
import { localStorageItems } from 'constants/local-storage.constant';

const initialStates = {
  authUser: localStorage.getItem(localStorageItems.AUTH_USER.name) ? JSON.parse(localStorage.getItem(localStorageItems.AUTH_USER.name)) : null
}

const userActionTypes = { ...actionTypes.user };

const userReducer = (states = initialStates, action) => {
  switch (action.type) {
    case userActionTypes.SIGN_IN:
      return { ...states, authUser: action.payload };

    case userActionTypes.SIGN_OUT:
      return { ...states, authUser: null }

    default:
      return states;
  }
}

export default userReducer;