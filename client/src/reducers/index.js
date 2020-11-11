import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';

export default combineReducers({
  // Will take in an object (whose values are reducers) that has all the reduces I create ex: auth reducer
  alert,
  auth,
  profile,
  post,
});

// Flow of redux:
// To add new recources and fuctionality, you can just simply create a new reducer and a new actions file and then create the components
