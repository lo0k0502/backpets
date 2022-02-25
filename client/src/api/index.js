import API from './API';

//auth
export const UserLogin = (payload) => API.post('/auth/login', payload);
export const GoogleLogin = (payload) => API.post('/auth/googlelogin', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);
export const Logout = (userId) => API.delete(`/auth/${userId}`);
export const RefreshToken = (payload) => API.post('/auth/refreshtoken', payload);
export const SendResetPasswordEmail = (payload) => API.post('/auth/resetpassword', payload);

//user
export const fetchAllUsers = () => API.get('/user/fetchall');
export const fetchUserById = (userId) => API.get(`/user/fetchbyid/${userId}`);
export const updateUserPassword = (payload) => API.post('/user/updatepassword', payload);
export const updateUserProfile = (payload) => API.post('/user/updateprofile', payload);
export const deleteUser = (payload) => API.post('/user/delete', payload);

//image
export const uploadImage = (payload) => API.post('/image/upload', payload, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteImage = (photoId) => API.delete(`/image/${photoId}`);

//post
export const AddPost = (payload) => API.post('/post/add', payload);
export const DeletePost = (postId) => API.delete(`/post/${postId}`);
export const fetchAllPosts = () => API.get('/post/fetchall');
export const fetchPost = (postid) => API.get(`/post/${postid}`);