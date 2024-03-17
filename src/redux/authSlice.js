import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  token: localStorage.getItem('token'),
  userType: localStorage.getItem('userType'),
  userId: localStorage.getItem('userId'),
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.userId = action.payload.userId;
      state.error = null;
      localStorage.setItem('userType', action.payload.userType);
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload.error.message || action.payload.error;
    },
    logout(state) {
      state.token = null;
      state.userType = null;
      state.userId = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    }
  }
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export const companyLogin = (email, password) => async dispatch => {
  dispatch(loginRequest());
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login/company', {
      email,
      password
    });
    console.log(response);
    const { token, userId, userType } = response.data;
    dispatch(loginSuccess({ token, userType, userId }));
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userId', userId);
  } catch (error) {
    dispatch(loginFailure({ error: error.message }));
  }
};

export const supervisorLogin = (email, password) => async dispatch => {

  dispatch(loginRequest());
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login/supervisor', {
      email,
      password
    });
    console.log(response);
    const { token, userId, userType } = response.data;
    dispatch(loginSuccess({ token, userType, userId }));
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userId', userId);
  } catch (error) {
    dispatch(loginFailure({ error: error.message }));
  }
 
};

export const studentLogin = (email, password) => async dispatch => {

  dispatch(loginRequest());
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login/student', {
      email,
      password
    });
    console.log(response);
    const { token, userId, userType } = response.data;
    dispatch(loginSuccess({ token, userType, userId }));
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userId', userId);
  } catch (error) {
    dispatch(loginFailure({ error: error.message }));
  }
  
};



export default authSlice.reducer;
