import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const getProductImage = (producto) => {
  const imageMap = {
    'Smartphones y Accesorios': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    'Laptops y Equipos de Cómputo': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    'Audio y Accesorios Bluetooth': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    'Gaming y Consolas': 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=300&fit=crop',
    'Hogar Inteligente y Domótica': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    'Cámaras y Fotografía Digital': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop'
  };
  
  return imageMap[producto.nomCategoria] || `https://picsum.photos/300/300?random=${producto.codProducto}`;
};

const ProductCard = ({ producto }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({
      codProducto: producto.codProducto,
      descripcion: producto.descripcion,
      precio: producto.preUni,
      imagen: getProductImage(producto),
    }, 1);
    toast.success('Producto agregado al carrito');
  };

  const handleViewDetails = () => {
    navigate(`/product/${producto.codProducto}`);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
        <img
          src={getProductImage(producto)}
          alt={producto.descripcion}
          className="h-48 w-full object-cover object-center"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {producto.descripcion}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            S/ {producto.preUni?.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {producto.stock}
          </span>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center space-x-1 btn-secondary text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Ver</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={producto.stock <= 0}
            className="flex-1 flex items-center justify-center space-x-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;