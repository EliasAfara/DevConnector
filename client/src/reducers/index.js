import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({
  // Will take in an object (whose values are reducers) that has all the reduces I create ex: auth reducer
  alert,
  auth,
});