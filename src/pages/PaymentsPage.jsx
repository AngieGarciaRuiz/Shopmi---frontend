import React from 'react';
import { useQuery } from 'react-query';
import { pagosAPI } from '../services/api';
import { CreditCard, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

const PaymentsPage = () => {
  const { data: pagos, isLoading, error } = useQuery('pagos', pagosAPI.listar);

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Completado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Fallido':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
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
          <h2 className="text-2xl font-bold text-gray-900">Error al cargar pagos</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const totalPagos = pagos?.data?.reduce((sum, pago) => sum + (pago.monto || 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Pagos</h1>
      
      {!pagos?.data || pagos.data.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">No hay pagos</h2>
          <p className="mt-2 text-gray-600">Aún no se han procesado pagos.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pagos</p>
                  <p className="text-2xl font-bold text-gray-900">{pagos.data.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monto Total</p>
                  <p className="text-2xl font-bold text-gray-900">S/ {totalPagos.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pagos.data.filter(p => p.estado === 'Completado').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {pagos.data.map((pago) => (
                <div key={pago.codPago} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(pago.estado)}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Pago #{pago.codPago}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Pedido #{pago.codPedido} - {pago.metodoPago}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        S/ {pago.monto?.toFixed(2) || '0.00'}
                      </p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {pago.estado || 'Sin estado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsPage;