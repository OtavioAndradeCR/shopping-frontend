import React, { createContext, useContext, useReducer, useCallback } from 'react';
//import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';
import orderService from '../services/orderService';

const OrderContext = createContext();

// Estados possíveis
const initialState = {
  orders: [],
  currentOrder: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  },
  filters: {}
};

// Actions
const ORDER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  FETCH_ORDERS_SUCCESS: 'FETCH_ORDERS_SUCCESS',
  FETCH_ORDER_DETAILS_SUCCESS: 'FETCH_ORDER_DETAILS_SUCCESS',
  FETCH_STATS_SUCCESS: 'FETCH_STATS_SUCCESS',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  UPDATE_ORDER_STATUS_SUCCESS: 'UPDATE_ORDER_STATUS_SUCCESS',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_CURRENT_ORDER: 'CLEAR_CURRENT_ORDER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function orderReducer(state, action) {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ORDER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ORDER_ACTIONS.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        currentOrder: action.payload.order,
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.FETCH_STATS_SUCCESS:
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [action.payload.order, ...state.orders],
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.order.id ? action.payload.order : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.order.id 
          ? action.payload.order 
          : state.currentOrder,
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.SET_FILTERS:
      return { ...state, filters: action.payload };
    
    case ORDER_ACTIONS.CLEAR_CURRENT_ORDER:
      return { ...state, currentOrder: null };
    
    case ORDER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Provider
export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { user } = useAuth();

  // Buscar pedidos do usuário
  const fetchUserOrders = useCallback(async (page = 1, filters = {}) => {
    if (!user) return;

    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await orderService.getUserOrders(page, filters);
      dispatch({ 
        type: ORDER_ACTIONS.FETCH_ORDERS_SUCCESS, 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.response?.data?.error || 'Erro ao buscar pedidos' 
      });
    }
  }, [user]);

  // Buscar detalhes de um pedido
  const fetchOrderDetails = useCallback(async (orderId) => {
    if (!user) return;

    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await orderService.getOrderDetails(orderId);
      dispatch({ 
        type: ORDER_ACTIONS.FETCH_ORDER_DETAILS_SUCCESS, 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.response?.data?.error || 'Erro ao buscar detalhes do pedido' 
      });
    }
  }, [user]);

  // Buscar estatísticas do usuário
  const fetchUserStats = useCallback(async () => {
    if (!user) return;

    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await orderService.getUserOrderStats();
      dispatch({ 
        type: ORDER_ACTIONS.FETCH_STATS_SUCCESS, 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.response?.data?.error || 'Erro ao buscar estatísticas' 
      });
    }
  }, [user]);

  // Criar novo pedido
  const createOrder = useCallback(async (orderData) => {
    if (!user) return;

    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await orderService.createOrder(orderData);
      dispatch({ 
        type: ORDER_ACTIONS.CREATE_ORDER_SUCCESS, 
        payload: response 
      });
      return response;
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.response?.data?.error || 'Erro ao criar pedido' 
      });
      throw error;
    }
  }, [user]);

  // Atualizar status do pedido (admin)
  const updateOrderStatus = useCallback(async (orderId, status, notes = '') => {
    if (!user || user.role !== 'admin') return;

    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await orderService.updateOrderStatus(orderId, status, notes);
      dispatch({ 
        type: ORDER_ACTIONS.UPDATE_ORDER_STATUS_SUCCESS, 
        payload: response 
      });
      return response;
    } catch (error) {
      dispatch({ 
        type: ORDER_ACTIONS.SET_ERROR, 
        payload: error.response?.data?.error || 'Erro ao atualizar status do pedido' 
      });
      throw error;
    }
  }, [user]);

  // Definir filtros
  const setFilters = useCallback((filters) => {
    dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Limpar pedido atual
  const clearCurrentOrder = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_CURRENT_ORDER });
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ERROR });
  }, []);

  // Função para obter status em português
  const getStatusDisplay = useCallback((status) => {
    const statusMap = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }, []);

  // Função para obter cor do status
  const getStatusColor = useCallback((status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const value = {
    // Estado
    ...state,
    
    // Ações
    fetchUserOrders,
    fetchOrderDetails,
    fetchUserStats,
    createOrder,
    updateOrderStatus,
    setFilters,
    clearCurrentOrder,
    clearError,
    
    // Utilitários
    getStatusDisplay,
    getStatusColor
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

// Hook para usar o contexto
export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders deve ser usado dentro de um OrderProvider');
  }
  return context;
}

export default OrderContext;

