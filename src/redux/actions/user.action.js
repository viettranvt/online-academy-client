import { actionTypes } from './action-types';

const userActionTypes = { ...actionTypes.user };

export const signIn = (user) => {
  return {
    type: userActionTypes.SIGN_IN,
    payload: user
  }
}

export const signOut = () => {
  return {
    type: userActionTypes.SIGN_OUT
  }
}