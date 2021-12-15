import fetch from 'isomorphic-fetch';
import { API } from '../config';
import cookie from 'js-cookie';
import Router from 'next/router';

export const handleResponse = (response) => {
  if (response.status === 401) {
    signout(() => {
      Router.push({
        pathname: '/signin',
        query: { message: 'Your session is expired. Please signin' },
      });
    });
  } else return;
};

export const preSignup = (user) => {
  return fetch(`${API}/pre-signup`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};
export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};

export const signout = (callback) => {
  removeCookie('token');
  removeLocalStorage('user');
  callback();
  return fetch(`${API}/signout`, { method: 'GET' })
    .then(() => console.log('signout success'))
    .catch((err) => console.log(err));
};

export const setCookie = (key, value) => process.browser && cookie.set(key, value, { expires: 1 });

export const removeCookie = (key) => process.browser && cookie.remove(key, { expires: 1 });

export const getCookie = (key) => process.browser && cookie.get(key);

export const setLocalStorage = (key, value) =>
  process.browser && localStorage.setItem(key, JSON.stringify(value));

export const removeLocalStorage = (key) => process.browser && localStorage.removeItem(key);

// authenticate user by pass data to cookie and localstorage
export const authenticate = (data, cb) => {
  setCookie('token', data.token);
  setLocalStorage('user', data.user);
  cb();
};

export const isAuth = () => {
  // FIXME: if the user changes his role in the localstorage, he can access admin resources
  if (process.browser && getCookie('token')) {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user);
  }
  return false;
};

export const updateUser = (user, callback) => {
  if (process.browser) {
    const authUser = JSON.parse(localStorage.getItem('user'));
    if (authUser) {
      localStorage.setItem('user', JSON.stringify(user));
      callback();
    }
  }
};

export const forgotPassword = (email) => {
  return fetch(`${API}/forgot-password`, {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(email),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};
export const resetPassword = (resetInfo) => {
  return fetch(`${API}/reset-password`, {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(resetInfo),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};
export const loginWithGoogle = (user) => {
  return fetch(`${API}/google-login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
};
