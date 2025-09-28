const API_BASE_URL = 'http://localhost:5000/api';

class ReviewService {
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

  // Listar avaliações de um produto
  async getProductReviews(productId, params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.verified_only) queryParams.append('verified_only', params.verified_only);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);

    const url = `${API_BASE_URL}/products/${productId}/reviews?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar avaliações');
    }

    return response.json();
  }

  // Criar nova avaliação
  async createReview(productId, reviewData) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar avaliação');
    }

    return response.json();
  }

  // Obter detalhes de uma avaliação
  async getReviewDetails(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar detalhes da avaliação');
    }

    return response.json();
  }

  // Atualizar avaliação
  async updateReview(reviewId, reviewData) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar avaliação');
    }

    return response.json();
  }

  // Deletar avaliação
  async deleteReview(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar avaliação');
    }

    return response.json();
  }

  // Votar se uma avaliação é útil
  async voteReviewHelpful(reviewId, isHelpful) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ is_helpful: isHelpful })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao votar na avaliação');
    }

    return response.json();
  }

  // Listar avaliações do usuário
  async getUserReviews(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/reviews/user?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar suas avaliações');
    }

    return response.json();
  }

  // Listar avaliações pendentes (admin)
  async getPendingReviews(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const url = `${API_BASE_URL}/reviews/pending?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar avaliações pendentes');
    }

    return response.json();
  }

  // Aprovar/rejeitar avaliação (admin)
  async approveReview(reviewId, isApproved) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ is_approved: isApproved })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao moderar avaliação');
    }

    return response.json();
  }

  // Obter estatísticas de avaliações de um produto
  async getProductReviewStats(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar estatísticas de avaliações');
    }

    return response.json();
  }

  // Verificar se o usuário pode avaliar um produto
  async canUserReviewProduct(productId) {
    try {
      // Tentar criar uma avaliação vazia para verificar se é permitido
      // (isso retornará erro de validação, mas não de permissão se for permitido)
      await this.createReview(productId, {});
      return true;
    } catch (error) {
      // Se o erro for sobre dados inválidos, significa que pode avaliar
      if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
        return true;
      }
      // Se o erro for sobre já ter avaliado, não pode avaliar novamente
      if (error.message.includes('já avaliou')) {
        return false;
      }
      // Outros erros também indicam que não pode avaliar
      return false;
    }
  }

  // Formatar rating para exibição
  formatRating(rating) {
    return Number(rating).toFixed(1);
  }

  // Gerar array de estrelas para exibição
  getStarsArray(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    // Meia estrela
    if (hasHalfStar) {
      stars.push('half');
    }
    
    // Estrelas vazias
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    
    return stars;
  }

  // Obter cor baseada no rating
  getRatingColor(rating) {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  }

  // Formatar data de avaliação
  formatReviewDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mês${months > 1 ? 'es' : ''} atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  }

  // Validar dados de avaliação
  validateReviewData(data) {
    const errors = [];

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push('Rating deve ser entre 1 e 5 estrelas');
    }

    if (data.title && data.title.length > 200) {
      errors.push('Título deve ter no máximo 200 caracteres');
    }

    if (data.comment && data.comment.length > 2000) {
      errors.push('Comentário deve ter no máximo 2000 caracteres');
    }

    return errors;
  }
}

export default new ReviewService();

