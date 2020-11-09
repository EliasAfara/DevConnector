// A function that takes in a piece of state, a state that has to do with alerts and actions
// And action gonna get dispatched from the action file

// Alerts are objects in the initialState array
// payload: {
//     id: 1,
//     message: 'Please login',
//     alertType: 'success',
// }
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

// Action: constains 2 things, 1 manditory which is the TYPE, and then the payload which will be the data. (Sometimes Data might not be available)
// We need to evaluate the TYPE using switch statement

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload]; // Add to the initialState array
    case REMOVE_ALERT: // Remove specific alert by its ID
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
