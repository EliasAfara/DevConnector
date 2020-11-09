// Function that takes in the token
// if the token is available, it's going to add it to the headers (x-auth-token)
// if not it's gonna delete it from the headers

import axios from 'axios';

const setAuthToken = (token) => {
  // Takes token as a param and check for it if it's available in local storage

  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
  // Send the token with every request instead of picking and choosing which request tp send it with
};

export default setAuthToken;
