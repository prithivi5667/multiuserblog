import fetch from 'isomorphic-fetch';
import { API } from '../config';
import queryString from 'querystring';
import { isAuth, handleResponse } from './auth';

export const emailContactForm = (data) => {
  let emailEndpoint;
  if (data.authorEmail) {
    emailEndpoint = `${API}/contact-blog-author`;
  } else {
    emailEndpoint = `${API}/contact`;
  }

  return fetch(`${emailEndpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
