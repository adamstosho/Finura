import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptors
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { ...JSON.parse(user), token },
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/auth/login', { email, password });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return userData;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/auth/register', { name, email, password });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return userData;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateProfile = async (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put('/auth/settings', updates);
      const updatedUser = { ...state.user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...updatedUser, token: response.data.token || state.token } });
      return updatedUser;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};