import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({

    name: 'auth',
    initialState: {
        userId: null,
        role: null,
        isAuthenticated: false,
        authLoading: true,
    },

    reducers: {

        setUserCredentials: (state, action)=>{
            state.userId = action.payload.userId;
            state.role = action.payload.role;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.authLoading = action.payload.authLoading;
        },

        clearUserCredentials: (state, action)=>{
            state.userId = null;
            state.role = null;
            state.isAuthenticated = false;
        },

        setAuthLoading: (state,action)=>{
            state.authLoading = action.payload.authLoading
        },
    },
});


export const {setUserCredentials, clearUserCredentials, setAuthLoading} = authSlice.actions;
export default authSlice.reducer;