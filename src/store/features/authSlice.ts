import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  _id: string;
  email: string;
  selectedCourses: string[];
  courseProgress: unknown[];
};

type initialStateType = {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
};
const initialState: initialStateType = {
  user: null,
  token: null,
  isAuth: false,
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuth = Boolean(state.token);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { setUser, setToken, clearUser, setLoading, setError, openAuthModal, closeAuthModal } =
  authSlice.actions;
export const authSliceReducer = authSlice.reducer;
