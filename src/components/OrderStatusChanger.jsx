import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { pedidosAPI } from '../services/api';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderStatusChanger = ({ pedido }) => {
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const queryClient = useQueryClient();

  const estados = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pagado' },
    { id: 3, nombre: 'Preparado' },
    { id: 4, nombre: 'Procesado' },
    { id: 5, nombre: 'Cancelado' },
    { id: 6, nombre: 'Entregado' },
    { id: 7, nombre: 'Stock insuficiente' }
  ];

  const updateOrderMutation = useMutation(
    ({ codPedido, codEstado }) => pedidosAPI.actualizar(codPedido, codEstado),
    {
      onSuccess: () => {
        toast.success('Estado actualizado exitosamente');
        queryClient.invalidateQueries('admin-pedidos');
        setShowModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error al actualizar estado');
      }
    }
  );

  const handleUpdateOrder = () => {
    if (newStatus) {
      updateOrderMutation.mutate({
        codPedido: pedido.codPedido,
        codEstado: parseInt(newStatus)
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-primary-600 hover:text-primary-900 p-1"
        title="Cambiar estado"
      >
        <Edit className="h-4 w-4" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cambiar Estado - Pedido #{pedido.codPedido}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Estado actual: <span className="font-medium">{pedido.estado}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar estado...</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateOrder}
                  disabled={!newStatus || updateOrderMutation.isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {updateOrderMutation.isLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderStatusChanger;