import { createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, googleLogin, logoutUser, tokenRefresh, updateProfile } from './userReducer';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    information: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
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
      if (action.payload.result) {
        Alert.alert('Welcome Back!', 
          `${action.payload.result.username}, welcome back!`, 
          [{ text: 'OK' }],
        );
      }
    },
    [googleLogin.fulfilled]: (state, action) => {
      const result = action.payload.result;
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken
      state.information = result;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      AsyncStorage.setItem('userInfo', JSON.stringify({ result, accessToken, refreshToken }));
      if (action.payload.isFirst) {
        Alert.alert('Safety alert', 
          'Your password is now set to 10 zeroes, we highly recommend you to change your password immediately!!', 
          [{ text: 'OK' }],
        );
      } else if (action.payload.result) {
        Alert.alert('Welcome Back!', 
          `${action.payload.result.username}, welcome back!`, 
          [{ text: 'OK' }],
        );
      }
    },
    [logoutUser.fulfilled]: (state) => {
      state.information = null;
      state.accessToken = null;
      state.refreshToken = null;
      AsyncStorage.removeItem('userInfo');
    },
    [tokenRefresh.fulfilled]: (state, action) => {
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
      if (action.payload.message) {
        console.log('While refreshing:', action.payload.message);
      }
    },
    [updateProfile.fulfilled]: (state, action) => {
      console.log('get result');
      if (action.payload.result) {
        state.information = action.payload.result;
        console.log('update success');
        AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
      if (action.payload.message) {
        console.log('While updating:', action.payload.message);
      }
    },
  },
});
export const { setState } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;