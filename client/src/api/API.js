import axios from 'axios';
import { BASE_URL } from '@env';

let store;

export const injectStore = _store => {
  store = _store;
};

export const SERVERURL = `http://${BASE_URL}:8000`;
console.log('Server URL: ', SERVERURL)
const API = axios.create({ baseURL: SERVERURL });

API.interceptors.request.use(async (req) => {
  req.headers.Authorization = `Bearer ${store.getState().user?.accessToken}`;
  return req;
});

export default API;