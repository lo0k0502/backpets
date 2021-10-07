import axios from 'axios';
import * as SecureStorage from 'expo-secure-store';
import { BASE_URL } from '@env';

export const SERVERURL = `http://${BASE_URL}:8000`;
console.log('Server URL: ', SERVERURL)
const API = axios.create({ baseURL: SERVERURL });

API.interceptors.request.use(async (req) => {
  req.headers.Authorization = `Bearer ${JSON.parse(await SecureStorage.getItemAsync('tokens'))?.accessToken}`;
  return req;
});

export default API;