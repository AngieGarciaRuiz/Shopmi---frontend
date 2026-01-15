import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Debug: verificar qué usuario tenemos
      console.log('Usuario actual:', user);
      console.log('ID del usuario:', user?.codUsuario);
      
      if (!user || !user.codUsuario) {
        toast.error('Error: Usuario no autenticado correctamente');
        navigate('/login');
        return;
      }
      
      const pedidoData = {
        codUsuario: user.codUsuario,
        fecPed: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        detallePedido: items.map(item => ({
          codProducto: item.codProducto,
          cantidad: item.cantidad
        }))
      };
      
      console.log('Enviando pedido:', pedidoData);
      
      const response = await pedidosAPI.crear(pedidoData);
      
      console.log('Respuesta del servidor:', response.data);
      
      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al procesar el pedido';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de envío */}
        <div className="card">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Información de envío</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                {...register('nombre', { required: 'El nombre es requerido' })}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                {...register('telefono', { required: 'El teléfono es requerido' })}
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de envío
              </label>
              <textarea
                {...register('direccion', { required: 'La dirección es requerida' })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de pago
              </label>
              <select
                {...register('metodoPago', { required: 'Selecciona un método de pago' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="efectivo">Efectivo contra entrega</option>
                <option value="tarjeta">Tarjeta de crédito/débito</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
              {errors.metodoPago && (
                <p className="mt-1 text-sm text-red-600">{errors.metodoPago.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </form>
        </div>
        
        {/* Resumen del pedido */}
        <div>
          <div className="card">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.codProducto} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.descripcion}</p>
                    <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                  </div>
                  <p className="font-medium">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>S/ {getTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>S/ {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;