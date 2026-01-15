import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Shopmi</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Pedidos
                </Link>
                {user?.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Admin Pedidos
                    </Link>
                    <Link
                      to="/admin/payments"
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Pagos
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="btn-primary"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;