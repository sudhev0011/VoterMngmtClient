import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({

    name: 'auth',
    initialState: {
        userId: null,
        role: null,
        isAuthenticated: false,
    },

    reducers: {

        setUserCredentials: (state, action)=>{
            state.userId = action.payload.userId;
            state.role = action.payload.role;
            state.isAuthenticated = action.payload.isAuthenticated;
        },

        clearUserCredentials: (state, action)=>{
            state.userId = null;
            state.role = null;
            state.isAuthenticated = false;
        },
    },
});


export const {setUserCredentials, clearUserCredentials} = authSlice.actions;
export default authSlice.reducer;