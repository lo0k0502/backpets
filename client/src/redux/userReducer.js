import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLogin, GoogleLogin, RefreshToken } from '../api';

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
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    information: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    logout: (state) => {
      state.information = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setState: (state, action) => {
      state.information = action.payload.userInfo;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      state.information = action.payload.result;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    [googleLogin.fulfilled]: (state, action) => {
      const result = action.payload.result;
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken
      state.information = result;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      if (action.payload.isFirst) {
        Alert.alert('Safety alert', 
          'Your password is now set to 10 zeroes, we highly recommend you to change your password immediately!!', 
          [{ text: 'OK' }],
        );
      }
      AsyncStorage.setItem('userInfo', JSON.stringify({ result, accessToken, refreshToken }));
    },
    [tokenRefresh.fulfilled]: (state, action) => {
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
      } else {
        console.log('While refreshing', action.payload.message);
      }
    },
  },
});
export const { logout, setState } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;