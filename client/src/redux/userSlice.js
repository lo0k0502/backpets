import { createSlice } from '@reduxjs/toolkit';
import { Alert, Clipboard } from 'react-native';
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
    },
    [googleLogin.fulfilled]: (state, action) => {
      state.information = action.payload.result;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
      if (action.payload.firstPassword) {
        const firstPassword = action.payload.firstPassword;
        console.log(firstPassword)
        Alert.alert('Safety alert', 
          `Your password is now set to ${firstPassword}.\nClick the button bellow to copy to clipboard.`, 
            [{ text: 'Copy', style: 'default', onPress: () => {
              Clipboard.setString(firstPassword);
              Alert.alert('', 'Password Copyed!!');
            } }, ]
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
        state.information = action.payload.result;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        AsyncStorage.setItem('userInfo', JSON.stringify({
          result: action.payload.result,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }));
      }
      console.log('While refreshing:', action.payload.message);
    },
    [updateProfile.fulfilled]: (state, action) => {
      if (action.payload.result) {
        state.information = action.payload.result;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        AsyncStorage.setItem('userInfo', JSON.stringify({
          result: action.payload.result,
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