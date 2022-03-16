import API from './API';

// auth
export const UserLogin = (payload) => API.post('/auth/login', payload);
export const GoogleLogin = (payload) => API.post('/auth/googlelogin', payload);
export const UserRegister = (payload) => API.post('/auth/register', payload);
export const Logout = (userId) => API.delete(`/auth/${userId}`);
export const RefreshToken = (payload) => API.post('/auth/refreshtoken', payload);
export const SendResetPasswordEmail = (payload) => API.post('/auth/resetpassword', payload);

// user
export const fetchAllUsers = () => API.get('/user/fetchall');
export const fetchUserById = (userId) => API.get(`/user/fetchbyid/${userId}`);
export const updateUserPassword = (payload) => API.post('/user/updatepassword', payload);
export const updateUserProfile = (payload) => API.post('/user/updateprofile', payload);
export const deleteUser = (payload) => API.post('/user/delete', payload);

// image
export const uploadImage = (payload) => API.post('/image/upload', payload, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteImage = (photoId) => API.delete(`/image/${photoId}`);

// mission
export const addMission = (payload) => API.post('/mission/add', payload);
export const deleteMission = (missionId) => API.delete(`/mission/${missionId}`);
export const fetchAllMissions = () => API.get('/mission/fetchall');
export const fetchMission = (missionid) => API.get(`/mission/${missionid}`);

// clue
export const addClue = (payload) => API.post('/clue/add', payload);
export const fetchCluesByMission = (missionId) => API.get(`fetchbymission/${missionId}`);