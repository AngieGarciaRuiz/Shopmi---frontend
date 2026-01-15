import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI, pagosAPI } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, CreditCard, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  
  // Debug: verificar usuario
  console.log('Usuario en OrdersPage:', user);
  
  if (!user || !user.codUsuario) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Debes iniciar sesión</h2>
          <p className="mt-2 text-gray-600">Para ver tus pedidos necesitas estar autenticado</p>
        </div>
      </div>
    );
  }
  
  const codUsuario = user.codUsuario;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: pedidos, isLoading } = useQuery(
    ['pedidos', codUsuario],
    () => pedidosAPI.obtenerPorUsuario(codUsuario)
  );

  const cancelOrderMutation = useMutation(
    (codPedido) => pedidosAPI.cancelar(codPedido),
    {
      onSuccess: () => {
        toast.success('Pedido cancelado exitosamente');
        queryClient.invalidateQueries(['pedidos', codUsuario]);
      },
      onError: () => {
        toast.error('Error al cancelar pedido');
      }
    }
  );

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Pagado':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'Preparado':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'Procesado':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'Entregado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Stock insuficiente':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pagado':
        return 'bg-blue-100 text-blue-800';
      case 'Preparado':
        return 'bg-orange-100 text-orange-800';
      case 'Procesado':
        return 'bg-purple-100 text-purple-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Stock insuficiente':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatus = (codPedido) => {
    // Simulamos estado de pago basado en el estado del pedido
    const pedido = pedidos?.data?.find(p => p.codPedido === codPedido);
    return pedido?.nomEstado === 'Pagado' ? { estado: 'Pagado' } : null;
  };

  const canCancel = (estado) => {
    return ['Pendiente', 'Pagado'].includes(estado);
  };

  const handleCancelOrder = (codPedido) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      cancelOrderMutation.mutate(codPedido);
    }
  };

  const handleViewDetails = (pedido) => {
    setSelectedOrder(pedido);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>
      
      {pedidos?.data?.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">No tienes pedidos</h2>
          <p className="mt-2 text-gray-600">¡Realiza tu primera compra!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos?.data?.map((pedido) => {
            const pago = getPaymentStatus(pedido.codPedido);
            return (
              <div key={pedido.codPedido} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(pedido.nomEstado)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Pedido #{pedido.codPedido}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(pedido.fecPed).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.nomEstado)}`}>
                        {pedido.nomEstado}
                      </span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          S/ {pedido.precioTotal?.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cliente: {pedido.cliente}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estado de Pago */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Estado de pago:</span>
                      {pago ? (
                        <span className="text-sm font-medium text-green-600">Pagado</span>
                      ) : (
                        <span className="text-sm font-medium text-red-600">Pendiente de pago</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(pedido)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver detalles</span>
                      </button>
                      
                      {canCancel(pedido.nomEstado) && (
                        <button
                          onClick={() => handleCancelOrder(pedido.codPedido)}
                          disabled={cancelOrderMutation.isLoading}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancelar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de detalles */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles del Pedido #{selectedOrder.codPedido}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedOrder.nomEstado)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.nomEstado)}`}>
                        {selectedOrder.nomEstado}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      S/ {selectedOrder.precioTotal?.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedOrder.fecPed).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pago</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      {getPaymentStatus(selectedOrder.codPedido) ? (
                        <span className="text-sm font-medium text-green-600">Pagado</span>
                      ) : (
                        <span className="text-sm font-medium text-red-600">Pendiente</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                {canCancel(selectedOrder.nomEstado) && (
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder.codPedido);
                      setShowModal(false);
                    }}
                    disabled={cancelOrderMutation.isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancelar Pedido
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;