import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    isAuthenticated:
        JSON.parse(
            localStorage.getItem("campusflow_token")
        ) || false,

    token:
        localStorage.getItem("campusflow_token") || null,

    user:
        JSON.parse(
            localStorage.getItem("campusflow_user")
        ) || null

};

const userSlice = createSlice({

    name: "user",

    initialState,

    reducers: {

        login: (state, action) => {

            state.isAuthenticated = true;

            state.token = action.payload.token;

            state.user = action.payload.user;

        },

        logout: (state) => {

            state.isAuthenticated = false;

            state.token = null;

            state.user = null;

        }

    }

});

export const {
    login,
    logout
} = userSlice.actions;

export default userSlice.reducer;


export const loginUser =
    ({ token, user }) =>
        (dispatch) => {

            localStorage.setItem(
                "campusflow_token",
                token
            );

            localStorage.setItem(
                "campusflow_user",
                JSON.stringify(user)
            );

            dispatch(
                login({
                    token,
                    user
                })
            );

        };



export const logoutUser =
    () =>
        (dispatch) => {

            localStorage.removeItem(
                "campusflow_token"
            );

            localStorage.removeItem(
                "campusflow_user"
            );

            dispatch(logout());

        };