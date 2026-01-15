import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { categoriasAPI, marcasAPI, productosAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { data: categorias } = useQuery('categorias', categoriasAPI.listar);
  const { data: marcas } = useQuery('marcas', marcasAPI.listar);
  const { data: topProductos } = useQuery('top-productos', productosAPI.obtenerTop5MasBaratos);

  const { data: productos, isLoading } = useQuery(
    ['productos', selectedCategory, selectedMarca, searchTerm, priceRange],
    () => {
      if (!selectedCategory) return { data: [] };
      
      const filtros = {};
      if (selectedMarca) filtros.codMarca = selectedMarca;
      if (searchTerm) filtros.descripcion = searchTerm;
      if (priceRange.min) filtros.precioMin = parseFloat(priceRange.min);
      if (priceRange.max) filtros.precioMax = parseFloat(priceRange.max);
      
      return productosAPI.obtenerPorCategoria(selectedCategory, filtros);
    },
    { enabled: !!selectedCategory }
  );

  const displayProducts = selectedCategory ? productos?.data || [] : topProductos?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Shopmi
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encuentra los mejores productos al mejor precio
        </p>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias?.data?.map((categoria) => (
                <option key={categoria.codcategoria} value={categoria.codcategoria}>
                  {categoria.nomcategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <select
              value={selectedMarca}
              onChange={(e) => setSelectedMarca(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las marcas</option>
              {marcas?.data?.map((marca) => (
                <option key={marca.codmarca} value={marca.codmarca}>
                  {marca.nombremarca}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar producto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio mín.
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="0"
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máx.
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="999"
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory ? 'Productos filtrados' : 'Productos más baratos'}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((producto) => (
              <ProductCard key={producto.codProducto} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory ? 'No se encontraron productos con los filtros seleccionados' : 'No hay productos disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;