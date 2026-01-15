import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { pedidosAPI } from '../services/api';
import OrderStatusChanger from '../components/OrderStatusChanger';

const AdminOrdersPage = () => {
  const { data: pedidos, isLoading, error } = useQuery('admin-pedidos', pedidosAPI.listarTodos);

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error al cargar pedidos</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Pedidos</h1>
      
      {!pedidos?.data || pedidos.data.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">No hay pedidos</h2>
          <p className="mt-2 text-gray-600">Aún no se han realizado pedidos.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Total de pedidos: {pedidos.data.length}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pedidos.data.map((pedido) => (
              <div key={pedido.codPedido} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(pedido.estado)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        Pedido #{pedido.codPedido}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(pedido.fechaPedido).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        S/ {pedido.total?.toFixed(2) || '0.00'}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pedido.estado)}`}>
                        {pedido.estado || 'Sin estado'}
                      </span>
                    </div>
                    <OrderStatusChanger pedido={pedido} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;