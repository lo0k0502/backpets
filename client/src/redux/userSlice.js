import { createSlice } from '@reduxjs/toolkit';
import { Alert, Clipboard } from 'react-native';
import * as SecureStorage from 'expo-secure-store';
import { loginUser, googleLogin, logoutUser, tokenRefresh, updateProfile } from './userReducer';

// The redux state instance, contains state control and the configuration when the dispatched function finish its work.
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null,
  },
  reducers: {},
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      state.info = action.payload.result;
      SecureStorage.setItemAsync('tokens', JSON.stringify({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }));
    },
    [googleLogin.fulfilled]: (state, action) => {
      state.info = action.payload.result;
      SecureStorage.setItemAsync('tokens', JSON.stringify({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }));
      if (action.payload.firstPassword) {
        const firstPassword = action.payload.firstPassword;
        console.log(firstPassword)
        Alert.alert('安全性警告', 
          `您的密碼已被設定為${firstPassword}.\n點選下方按鈕以複製.`, 
            [{ text: '複製', style: 'default', onPress: () => {
              Clipboard.setString(firstPassword);
              Alert.alert('', '複製成功!!');
            } }, ]
        );
      }
    },
    [logoutUser.fulfilled]: (state) => {
      state.info = null;
      SecureStorage.deleteItemAsync('tokens');
    },
    [tokenRefresh.fulfilled]: (state, action) => {
      state.info = action.payload.result;
      if (action.payload.accessToken) {
        SecureStorage.setItemAsync('tokens', JSON.stringify({
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }));
      }
      console.log('While refreshing:', action.payload.message);
    },
    [updateProfile.fulfilled]: (state, action) => {
      if (action.payload.result) {
        state.info = action.payload.result;
        SecureStorage.setItemAsync('tokens', JSON.stringify({
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }));
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