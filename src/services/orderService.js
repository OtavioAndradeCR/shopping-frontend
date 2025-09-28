// src/services/orderService.js
import api from './api';

const orderService = {
  // Listar pedidos do usuário
  async getUserOrders(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        ...filters,
      });
      const response = await api.get(`/purchases/user?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  },

  // Obter detalhes de um pedido específico
  async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      throw error;
    }
  },

  // Criar novo pedido (checkout)
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Obter estatísticas do usuário
  async getUserOrderStats() {
    try {
      const response = await api.get("/purchases/user/stats");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  },

  // Atualizar status do pedido (admin)
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  },

  // Listar todos os pedidos (admin)
  async getAllOrdersAdmin(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
        ...filters,
      });
      const response = await api.get(`/orders/admin?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os pedidos:', error);
      throw error;
    }
  },
};

export default orderService;
