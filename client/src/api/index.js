import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SERVERURL = 'http://192.168.1.103:5001';

const API = axios.create({ baseURL: SERVERURL });

API.interceptors.request.use(async (req) => {
    const userInfo = await AsyncStorage.getItem('userInfo')
    if (userInfo) {
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
})

//auth
export const UserLogin = (payload) => API.post('/auth/login', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);

//user
export const fetchAllUsers = () => API.get('/user/fetchall');
export const deleteUser = (payload) => API.post('/user/delete', payload);