import * as SecureStorage from 'expo-secure-store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserLogin, GoogleLogin, RefreshToken, Logout, updateUserProfile } from '../api';

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await UserLogin({ email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
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
    async ({}, { rejectWithValue }) => {
        try {
            const { refreshToken } = JSON.parse(await SecureStorage.getItemAsync('tokens'));
            await Logout({ refreshToken });
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const tokenRefresh = createAsyncThunk(
    'auth/refreshtoken',
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
    async ({ photoUrl, username, newUsername, email, refreshToken }, {rejectWithValue}) => {
        try {
            const response = await updateUserProfile({ photoUrl, username, newUsername, email, refreshToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);