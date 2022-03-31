import * as SecureStorage from 'expo-secure-store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserLogin, GoogleLogin, RefreshToken, Logout, updateUserProfile, updateUserPoints } from '../api';

// All requests that will affect redux state or SecureStorage should be configured by redux, 
// so you should dispatch these function rather than request them directly using axios.
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await UserLogin({ email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const googleLogin = createAsyncThunk(
    'user/googlelogin',
    async ({ username, email, photoId }, { rejectWithValue }) => {
        try {
            const response = await GoogleLogin({ username, email, photoId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const logoutUser = createAsyncThunk(
    'user/logout',
    async ({}, { rejectWithValue, getState }) => {
        try {
            const { user: { info: { _id } } } = getState();
            await Logout(_id);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const tokenRefresh = createAsyncThunk(
    'auth/refreshtoken',
    async ({ refreshToken }, { rejectWithValue }) => {
        try {
            const response = await RefreshToken({ refreshToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const updateProfile = createAsyncThunk(
    'user/updateprofile',
    async ({ userId, photoId, username, email }, { rejectWithValue, getState }) => {
        try {
            const { user: { info } } = getState();

            if (!photoId) photoId = info.photoId;
            if (!username) username = info.username;
            if (!email) email = info.email;

            const response = await updateUserProfile({ userId, photoId, username, email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const updatePoints = createAsyncThunk(
    'user/updatepoints',
    async ({ clueId, points }, { rejectWithValue, getState }) => {
        try {
            const { user: { info } } = getState();

            const response = await updateUserPoints({ userId: info._id, clueId, points });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)