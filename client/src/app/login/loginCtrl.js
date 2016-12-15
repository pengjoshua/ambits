import axios from 'axios';

const tokenKey = 'auth.ambitually';

// Todo: refactor for correct catch handling

const setToken = (res) =>
  window.localStorage.setItem(tokenKey, res.data.token);

export const login = (user) =>
  axios.post('/login', user)
  .then(res => {
    setToken(res);
    // Need to have return to continue promise in login.js
    return res;
  });

export const signup = (user) =>
  axios.post('/register', user)
  .then(res => {
    setToken(res)
    // Need to have return to continue promise in login.js
    return res;
  });

export const logout = (user) =>
  window.localStorage.removeItem(tokenKey);

export const getJwt = () =>
  window.localStorage.getItem(tokenKey);
