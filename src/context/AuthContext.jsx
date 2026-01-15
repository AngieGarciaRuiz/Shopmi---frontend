import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar si hay tokens guardados al cargar la app
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');
    
    console.log('Verificando datos guardados:');
    console.log('AccessToken:', accessToken ? 'Existe' : 'No existe');
    console.log('RefreshToken:', refreshToken ? 'Existe' : 'No existe');
    console.log('UserData:', userData);
    
    if (accessToken && refreshToken && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Usuario parseado:', user);
        console.log('codUsuario del usuario:', user?.codUsuario);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user }
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login(username, password);
      console.log('Respuesta completa del login:', response.data);
      
      const { accessToken, refreshToken, user } = response.data;
      
      console.log('Datos del usuario recibidos:', user);
      console.log('codUsuario:', user?.codUsuario);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};