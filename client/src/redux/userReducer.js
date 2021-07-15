import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLogin, UserRegister } from '../api';

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
// export const registerUser = createAsyncThunk(
//   'user/register',
//   async ({ username, password, email }, { rejectWithValue }) => {
//     try {
//       const response = await UserRegister({ username, passwor, email });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    information: null,
    token: null,
  },
  reducers: {
    logout: (state) => {
      state.information = null;
      state.token = null;
    },
    setState: (state, action) => {
      state.information = action.payload.userInfo;
      state.token = action.payload.token;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      const info = action.payload.result;
      const token = action.payload.token;
      state.information = info;
      state.token = token;
      AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // [registerUser.fulfilled]: (state, action) => {
    //   const info = action.payload.result;
    //   const token = action.payload.token;
    //   state.information = info;
    //   state.token = token;
    //   AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
    // },
  },
});
export const { logout, setState } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;