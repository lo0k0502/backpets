import axios from 'axios';

export const SERVERURL = 'http://192.168.1.103:5001';

const API = axios.create({ baseURL: SERVERURL });

export const UserLogin = (payload) => API.post('/auth/login', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);