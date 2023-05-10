import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import appReducer from './app.reducer';
import pageReducer from './page.reducer';

export default combineReducers({
  user: userReducer,
  app: appReducer,
  page: pageReducer
});