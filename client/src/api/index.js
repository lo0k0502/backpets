import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export const SERVERURL = `http://${BASE_URL}:8000`;

const API = axios.create({ baseURL: SERVERURL });

API.interceptors.request.use(async (req) => {
    const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
    if (userInfo) {
        req.headers.Authorization = `Bearer ${userInfo.accessToken}`;
    }
    return req;
});

//auth
export const GoogleLogin = (payload) => API.post('/auth/googlelogin', payload);
export const UserLogin = (payload) => API.post('/auth/login', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);
export const Logout = (payload) => API.post('/auth/logout', payload);
export const RefreshToken = (payload) => API.post('/auth/refreshtoken', payload);
export const sendEmailVerification = (payload) => API.post('/auth/testemail', payload);

//user
export const fetchAllUsers = () => API.get('/user/fetchall');
export const updateUserPassword = (payload) => API.post('/user/updatepassword', payload);
export const updateUserProfile = (payload) => API.post('/user/updateprofile', payload);
export const deleteUser = (payload) => API.post('/user/delete', payload);

//avatar
export const uploadAvatar = (payload) => API.post('/avatar/upload', payload, {
    headers:{
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteAvatar = (filename) => API.delete(`/avatar/${filename}`);

//post
export const AddPost = (payload) => API.post('/post/add', payload);
export const fetchAllPosts = () => API.get('/post/fetchall');