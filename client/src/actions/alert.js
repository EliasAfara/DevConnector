import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Dsipatch the type and payload of set alert to the reducer which will adds the alert to the state, which initally is an empty array.
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4(); // Generate an ID

  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
