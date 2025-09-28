const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    //const token = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos genéricos
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Products
  async getProducts() {
    return this.get('/products');
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async searchProducts(query) {
    return this.get(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductsByCategory(category) {
    return this.get(`/products/category/${encodeURIComponent(category)}`);
  }

  async filterProducts(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    return this.get(`/products/filter?${queryParams}`);
  }

  async getCategories() {
    return this.get('/products/categories');
  }

  async getPriceRange() {
    return this.get('/products/price-range');
  }

  // Users
  async getUsers() {
    return this.get('/users');
  }

  async createUser(userData) {
    return this.post('/users', userData);
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // Purchases
  async getPurchases() {
    return this.get('/purchases');
  }

  async createPurchase(purchaseData) {
    return this.post('/purchases', purchaseData);
  }

  async getPurchase(id) {
    return this.get(`/purchases/${id}`);
  }

  async getUserPurchases() {
    return this.get(`/purchases/user`);
  }

  async deletePurchase(id) {
    return this.delete(`/purchases/${id}`);
  }
}

export default new ApiService();
