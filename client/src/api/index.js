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
export const updateUserPoints = (payload) => API.post('/user/updatepoints', payload);
export const updateUserSearchHistory = (payload) => API.post('/user/updatesearchhistory', payload);
export const deleteUser = (payload) => API.post('/user/delete', payload);

// pet
export const addPet = (payload) => API.post('/pet/add', payload);
export const editPet = (petId, payload) => API.post(`/pet/${petId}`, payload);
export const fetchAllPets = () => API.get('/pet/fetchall');
export const fetchPetsByUserId = (userId) => API.get(`/pet/fetchbyuserid/${userId}`);
export const fetchPet = (petId) => API.get(`/pet/${petId}`);

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
export const editMission = (missionId, payload) => API.post(`/mission/${missionId}`, payload);
export const completeMission = (missionId, payload) => API.post(`/mission/completemission/${missionId}`, payload);
export const fetchAllMissions = () => API.get('/mission/fetchall');
export const fetchMissionsByUserId = (userId) => API.get(`/mission/fetchbyuserid/${userId}`);
export const fetchMissionsByPetId = (petId) => API.get(`/mission/fetchbypetid/${petId}`);
export const fetchMission = (missionid) => API.get(`/mission/${missionid}`);
export const deleteMission = (missionId) => API.delete(`/mission/${missionId}`);

// clue
export const addClue = (payload) => API.post('/clue/add', payload);
export const fetchCluesByMissionId = (missionId) => API.get(`/clue/fetchbymissionid/${missionId}`);
export const fetchCluesByUserId = (userId) => API.get(`/clue/fetchbyuserid/${userId}`)
export const fetchClue = (clueId) => API.get(`/clue/${clueId}`);

// report
export const addReport = (payload) => API.post('/report/add', payload);
export const editReport = (reportId, payload) => API.post(`/report/${reportId}`, payload);
export const fetchAllReports = () => API.get('/report/fetchall');

// put up for adoption
export const addPutUpForAdoption = (payload) => API.post('/put-up-for-adoption/add', payload);
export const editPutUpForAdoption = (putUpForAdoptionId, payload) => API.post(`/put-up-for-adoption/${putUpForAdoptionId}`, payload);
export const completePutUpForAdoption = (putUpForAdoptionId, payload) => API.post(`/put-up-for-adoption/completeputupforadoption/${putUpForAdoptionId}`, payload);
export const fetchAllPutUpForAdoptions = () => API.get('/put-up-for-adoption/fetchall');
export const fetchPutUpForAdoptionsByUserId = (userId) => API.get(`/put-up-for-adoption/fetchbyuserid/${userId}`);
export const fetchPutUpForAdoption = (putUpForAdoptionId) => API.get(`/put-up-for-adoption/${putUpForAdoptionId}`);

// point record
export const fetchPointRecordsByUserId = (userId) => API.get(`/point-record/fetchbyuserid/${userId}`);

// feedback
export const addFeedback = (payload) => API.post('/feedback/add', payload);

// violation report
export const addViolationReport = (payload) => API.post('/violation-report/add', payload);
export const deleteViolationReport = (violationReportId) => API.delete(`/violation-report/${violationReportId}`);

// adoption record
export const fetchAdoptionRecordsByUserId = (userId) => API.get(`/adoption-record/fetchbyuserid/${userId}`);
export const fetchAdoptionRecordsByPutUserId = (userId) => API.get(`/adoption-record/fetchbyputuserid/${userId}`);

// product
export const fetchAllProducts = () => API.get('/product/fetchall');
export const fetchProductById = (productId) => API.get(`/product/${productId}`);

// coupon
export const generateCoupon = (payload) => API.post('/coupon/generatecoupon', payload);
export const fetchCouponsByUserId = (userId) => API.get(`/coupon/fetchbyuserid/${userId}`);