const API_BASE_URL = 'http://localhost:5000/api';

class CouponService {
  // Obter token do localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Headers padrão com autenticação
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Listar cupons
  async getCoupons(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/coupons?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar cupons');
    }

    return response.json();
  }

  // Obter detalhes de um cupom
  async getCouponDetails(couponId) {
    const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar detalhes do cupom');
    }

    return response.json();
  }

  // Criar novo cupom (admin)
  async createCoupon(couponData) {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(couponData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar cupom');
    }

    return response.json();
  }

  // Atualizar cupom (admin)
  async updateCoupon(couponId, couponData) {
    const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(couponData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar cupom');
    }

    return response.json();
  }

  // Deletar cupom (admin)
  async deleteCoupon(couponId) {
    const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar cupom');
    }

    return response.json();
  }

  // Validar cupom
  async validateCoupon(code, orderValue) {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        code: code,
        order_value: orderValue
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao validar cupom');
    }

    return response.json();
  }

  // Aplicar cupom
  async applyCoupon(code, orderValue) {
    const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        code: code,
        order_value: orderValue
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao aplicar cupom');
    }

    return response.json();
  }

  // Obter histórico de uso de cupons
  async getCouponUsage(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/coupons/usage?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar histórico de cupons');
    }

    return response.json();
  }

  // Validar dados de cupom
  validateCouponData(data) {
    const errors = [];
    
    if (!data.code || data.code.trim().length < 3) {
      errors.push('Código deve ter pelo menos 3 caracteres');
    }
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }
    
    if (!data.discount_type || !['percentage', 'fixed'].includes(data.discount_type)) {
      errors.push('Tipo de desconto deve ser "percentage" ou "fixed"');
    }
    
    if (!data.discount_value || data.discount_value <= 0) {
      errors.push('Valor do desconto deve ser maior que zero');
    }
    
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      errors.push('Desconto percentual não pode ser maior que 100%');
    }
    
    if (data.min_order_value && data.min_order_value < 0) {
      errors.push('Valor mínimo do pedido não pode ser negativo');
    }
    
    if (data.start_date && data.end_date && new Date(data.start_date) >= new Date(data.end_date)) {
      errors.push('Data de início deve ser anterior à data de fim');
    }
    
    return errors;
  }

  // Formatar valor de desconto para exibição
  formatDiscount(discountType, discountValue) {
    if (discountType === 'percentage') {
      return `${discountValue}%`;
    } else if (discountType === 'fixed') {
      return `R$ ${discountValue.toFixed(2)}`;
    }
    return '';
  }

  // Calcular desconto
  calculateDiscount(discountType, discountValue, orderValue, maxDiscountAmount = null) {
    if (discountType === 'percentage') {
      let discount = (orderValue * discountValue) / 100;
      
      if (maxDiscountAmount) {
        discount = Math.min(discount, maxDiscountAmount);
      }
      
      return Math.round(discount * 100) / 100;
    } else if (discountType === 'fixed') {
      return Math.min(discountValue, orderValue);
    }
    
    return 0;
  }

  // Formatar data para exibição
  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Verificar se cupom está expirado
  isExpired(endDate) {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  }

  // Verificar se cupom ainda não começou
  isNotStarted(startDate) {
    if (!startDate) return false;
    return new Date(startDate) > new Date();
  }

  // Obter status do cupom
  getCouponStatus(coupon) {
    if (!coupon.is_active) {
      return { status: 'inactive', label: 'Inativo', color: 'gray' };
    }
    
    if (this.isNotStarted(coupon.start_date)) {
      return { status: 'not_started', label: 'Não iniciado', color: 'yellow' };
    }
    
    if (this.isExpired(coupon.end_date)) {
      return { status: 'expired', label: 'Expirado', color: 'red' };
    }
    
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { status: 'exhausted', label: 'Esgotado', color: 'red' };
    }
    
    return { status: 'active', label: 'Ativo', color: 'green' };
  }
}

export default new CouponService();

