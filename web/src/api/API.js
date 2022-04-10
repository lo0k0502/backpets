import axios from 'axios';

export const SERVERURL = `http://localhost:8000`;

const API = axios.create({ baseURL: SERVERURL, timeout: 10000 , timeoutErrorMessage: 'Server timeout'});

export default API;