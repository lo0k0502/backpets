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

// pet
export const addPet = (payload) => API.post('/pet/add', payload);
export const fetchPet = (petId) => API.get(`/pet/${petId}`);
export const fetchPetsByUserId = (userId) => API.get(`/pet/fetchbyuserid/${userId}`);

// image
export const uploadImage = (payload) => API.post('/image/upload', payload, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const fetchAllImages = () => API.get('/image/fetchall');
export const deleteImage = (photoId) => API.delete(`/image/${photoId}`);

// mission
export const addMission = (payload) => API.post('/mission/add', payload);
export const deleteMission = (missionId) => API.delete(`/mission/${missionId}`);
export const fetchAllMissions = () => API.get('/mission/fetchall');
export const fetchSelfMissions = (userId) => API.get(`/mission/fetchbyuserid/${userId}`);
export const fetchMission = (missionid) => API.get(`/mission/${missionid}`);

// clue
export const addClue = (payload) => API.post('/clue/add', payload);
export const fetchCluesByMission = (missionId) => API.get(`/clue/fetchbymission/${missionId}`);

// report
export const addReport = (payload) => API.post('/report/add', payload);
export const fetchAllReports = () => API.get('/report/fetchall');

// put up for adoption
export const addPutUpForAdoption = (payload) => API.post('/put-up-for-adoption/add', payload);
export const fetchAllPutUpForAdoptions = () => API.get('/put-up-for-adoption/fetchall');