import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Settings, Shield } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@email.com',
    telefono: '999888777',
    username: user?.username || 'usuario'
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const password = watch('newPassword');

  useEffect(() => {
    // Cargar datos del usuario si están disponibles
    if (user) {
      setUserData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user]);

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      // Simular actualización exitosa
      setUserData({
        ...userData,
        ...data
      });
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoading(true);
    try {
      // Simular cambio de contraseña exitoso
      toast.success('Contraseña cambiada exitosamente');
      reset();
    } catch (error) {
      toast.error('Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const onToggleAccount = async (enabled) => {
    setLoading(true);
    try {
      toast.success(`Cuenta ${enabled ? 'activada' : 'desactivada'} exitosamente`);
    } catch (error) {
      toast.error('Error al cambiar estado de cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Seguridad
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    {...register('nombre', { required: 'El nombre es requerido' })}
                    type="text"
                    defaultValue={userData.nombre}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    {...register('apellido', { required: 'El apellido es requerido' })}
                    type="text"
                    defaultValue={userData.apellido}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.apellido && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    {...register('correo', { 
                      required: 'El email es requerido',
                      pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                    })}
                    type="email"
                    defaultValue={userData.correo}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.correo && (
                    <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    {...register('telefono', { required: 'El teléfono es requerido' })}
                    type="tel"
                    defaultValue={userData.telefono}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña actual
                </label>
                <input
                  {...register('currentPassword', { required: 'La contraseña actual es requerida' })}
                  type="password"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('newPassword', { 
                      required: 'La nueva contraseña es requerida',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar nueva contraseña
                </label>
                <input
                  {...register('confirmPassword', { 
                    required: 'Confirma tu nueva contraseña',
                    validate: value => value === password || 'Las contraseñas no coinciden'
                  })}
                  type="password"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Estado de cuenta</h3>
                  <p className="text-sm text-gray-500">
                    Tu cuenta está activa - Usuario: {userData.username}
                  </p>
                </div>
                <button
                  onClick={() => onToggleAccount(true)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Cuenta Activa'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;