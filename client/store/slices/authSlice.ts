import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('amazon_user', JSON.stringify(action.payload.user));
        localStorage.setItem('amazon_token', action.payload.accessToken);
      }
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('amazon_user', JSON.stringify(state.user));
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('amazon_user');
        localStorage.removeItem('amazon_token');
      }
    },
    restoreUserSession: (state) => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('amazon_user');
        const storedToken = localStorage.getItem('amazon_token');

        if (storedUser && storedToken) {
          try {
            state.user = JSON.parse(storedUser);
            state.accessToken = storedToken;
            state.isAuthenticated = true;
          } catch {
            localStorage.removeItem('amazon_user');
            localStorage.removeItem('amazon_token');
          }
        }
      }
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateCurrentUser, logout, restoreUserSession } =
  authSlice.actions;
export default authSlice.reducer;
