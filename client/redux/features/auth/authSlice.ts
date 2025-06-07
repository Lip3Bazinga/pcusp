import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: ""
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (
      state,
      action: PayloadAction<{
        token: string
      }>
    ) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{
        accessToken: string,
        user: string
      }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    }
  }
});

// Exportando as ações
export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

// Exportando o reducer
export default authSlice.reducer;
