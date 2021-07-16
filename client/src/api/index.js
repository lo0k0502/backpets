import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SERVERURL = 'http://192.168.1.103:5001';

const API = axios.create({ baseURL: SERVERURL });

API.interceptors.request.use(async (req) => {
    const userInfo = await AsyncStorage.getItem('userInfo')
    if (userInfo) {
        req.headers.Authorization = `Bearer ${userInfo.accessToken}`;
    }
    return req;
});

//auth
export const GoogleLogin = (payload) => API.post('/auth/googlelogin', payload);
export const UserLogin = (payload) => API.post('/auth/login', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);
export const Logout = (payload) => API.delete('/auth/logout', payload);
export const RefreshToken = (payload) => API.post('/auth/refreshtoken', payload);

//user
export const fetchUserByEmail = (payload) => API.post('/user/fetchbyemail', payload);
export const fetchAllUsers = () => API.get('/user/fetchall');
export const updateUserPassword = (payload) => API.post('/user/updatepassword', payload);
export const updateUser = (payload) => API.post('/update', payload);
export const deleteUser = (payload) => API.post('/user/delete', payload);