import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar el pedido');
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
          <p className="mt-2 text-gray-600">¡Agrega algunos productos para comenzar!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 btn-primary"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.codProducto} className="flex items-center space-x-4 p-4 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.imagen || `https://picsum.photos/300/300?random=${item.codProducto}`}
                    alt={item.descripcion}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.descripcion}</h3>
                    <p className="text-sm text-gray-500">S/ {item.precio.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.codProducto, item.cantidad - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">{item.cantidad}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.codProducto, item.cantidad + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.codProducto)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>S/ {getTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>S/ {getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full mt-6 btn-primary"
            >
              Proceder al pago
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 btn-secondary"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;