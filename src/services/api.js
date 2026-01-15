import axios from 'axios';

// Usar proxy local para evitar CORS
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, intentar renovar
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Reintentar la petición original
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh falló, redirigir a login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  logout: (refreshToken) => 
    api.post('/auth/logout', { refreshToken }),
  
  refresh: (refreshToken) => 
    api.post('/auth/refresh', { refreshToken }),

  register: (userData) => 
    api.post('/auth/register', userData),

  updateProfile: (userData) => 
    api.put('/api/users/profile', userData),

  changePassword: (passwordData) => 
    api.put('/api/users/password', passwordData),

  toggleAccount: (enabled) => 
    api.patch('/api/users/toggle', { enabled }),
};

export const productosAPI = {
  obtenerPorCategoria: (codCategoria, filtros = {}) => 
    api.get(`/productos/public/ListarPorCategoria/${codCategoria}`, { params: filtros }),
  
  obtenerTop5MasBaratos: () => 
    api.get('/productos/public/ListarTop5ProductosMasBaratos'),
  
  obtenerPorId: (codProducto) => 
    api.get(`/productos/public/ObtenerProducto/${codProducto}`),
  
  verificarStock: (codProducto, cantidad) => 
    api.get(`/productos/VerificarStock/${codProducto}/${cantidad}`),
};

export const categoriasAPI = {
  listar: () => api.get('/categorias/public/listarCategorias'),
};

export const marcasAPI = {
  listar: () => api.get('/marcas/public/ListarMarcas'),
};

export const pedidosAPI = {
  crear: (pedido) => api.post('/pedidos/RegistrarPedido', pedido),
  
  obtenerPorUsuario: (codUsuario) => 
    api.get(`/pedidos/ObtenerPedidos/${codUsuario}`),
  
  obtenerDetalle: (codPedido) => 
    api.get(`/pedidos/ObtenerPedido/${codPedido}`),

  listarTodos: () => api.get('/pedidos/ListarPedidos'),

  actualizar: (codPedido, codEstado) => 
    api.put(`/pedidos/ActualizarPedido/${codPedido}?codEstado=${codEstado}`),

  cancelar: (codPedido) => 
    api.delete(`/pedidos/EliminarPedido/${codPedido}`),
};

export const pagosAPI = {
  listar: () => api.get('/pagos/ListarPagos'),
  
  obtenerPorPedido: (codPedido) => 
    api.get(`/pagos/ObtenerPago/${codPedido}`),

  actualizar: (codPago, estado) => 
    api.put(`/pagos/ActualizarPago/${codPago}`, { estado }),
};

export const estadosAPI = {
  listar: () => api.get('/estados/ListarEstados'),
};

export default api;