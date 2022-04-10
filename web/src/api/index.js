import API from "./API";

// user
export const fetchAllUsers = () => API.get('/user/fetchall');
export const fetchUserById = (userId) => API.get(`/user/fetchbyid/${userId}`);

// mission
export const fetchAllMissions = () => API.get('/mission/fetchall');

// pet
export const fetchPetById = (petId) => API.get(`/pet/${petId}`);

// feedback
export const fetchAllFeedbacks = () => API.get('/feedback/fetchall');

// violation-report
export const fetchAllViolationReports = () => API.get('violation-report/fetchall');