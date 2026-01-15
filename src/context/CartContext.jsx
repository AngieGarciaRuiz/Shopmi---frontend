import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.codProducto === action.payload.codProducto);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.codProducto === action.payload.codProducto
              ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.codProducto !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.codProducto === action.payload.codProducto
            ? { ...item, cantidad: action.payload.cantidad }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('shopmi-cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('shopmi-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (producto, cantidad = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        codProducto: producto.codProducto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad,
      },
    });
  };

  const removeItem = (codProducto) => {
    dispatch({ type: 'REMOVE_ITEM', payload: codProducto });
  };

  const updateQuantity = (codProducto, cantidad) => {
    if (cantidad <= 0) {
      removeItem(codProducto);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { codProducto, cantidad },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotal = () => {
    return state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.cantidad, 0);
  };

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};