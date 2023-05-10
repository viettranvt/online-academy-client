import { actionTypes } from '../actions/action-types';

const initialStates = {
  basics: null,
  isLoading: false
}

const pageActionTypes = { ...actionTypes.page };

const pageReducer = (states = initialStates, action) => {
  switch (action.type) {
    case pageActionTypes.SET_PAGE_BASICS:
      return { ...states, basics: action.payload };

    case pageActionTypes.SET_PAGE_LOADING:
      return { ...states, isLoading: action.payload }

    default:
      return states;
  }
}

export default pageReducer;