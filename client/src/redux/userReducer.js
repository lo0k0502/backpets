import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserLogin, GoogleLogin, RefreshToken, Logout, updateUserProfile } from '../api';

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await UserLogin({ username, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const googleLogin = createAsyncThunk(
    'user/googlelogin',
    async ({ username, email, photoUrl }, { rejectWithValue }) => {
        try {
            const response = await GoogleLogin({ username, email, photoUrl });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const logoutUser = createAsyncThunk(
    'user/logout',
    async ({ refreshToken }, { rejectWithValue }) => {
        try {
            await Logout({ refreshToken });
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const tokenRefresh = createAsyncThunk(
    'user/refreshtoken',
    async ({ accessToken, refreshToken }, { rejectWithValue }) => {
        try {
            const response = await RefreshToken({ accessToken, refreshToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const updateProfile = createAsyncThunk(
    'user/updateprofile',
    async ({ photoUrl, username, newUsername, email }, {rejectWithValue}) => {
        try {
            const response = await updateUserProfile({ photoUrl, username, newUsername, email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);