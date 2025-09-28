import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import Carousel from './Carousel';
import ProductCard from './ProductCard';
import Cart from './Cart';
import ProductSortDropdown from './ProductSortDropdown';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort_by: 'name',
    search: ''
  });

  const { toast } = useToast();
  const { 
    cartItems, 
    showCart, 
    searchQuery, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    handleCheckout, 
    setSearchQuery 
  } = useCart();
  const { isAuthenticated } = useAuth();

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Sincronizar busca com filtros
  useEffect(() => {
    if (searchQuery !== filters.search) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchQuery]);

  // Aplicar filtros de busca e ordenação
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];
    
    // Aplicar filtro de busca
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.title?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar ordenação
    applySorting(filters.sort_by, filtered);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const productsData = await ApiService.getProducts();
      setProducts(productsData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (sortBy, baseProducts = products) => {
    if (!Array.isArray(baseProducts) || baseProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const safeProducts = baseProducts.filter(p => p && typeof p === "object");
  
    const sorted = [...safeProducts];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
        break;
      case "price_desc":
        sorted.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
        break;
      case "name":
        sorted.sort((a, b) =>
          (a?.name ?? "Sem nome").localeCompare(b?.name ?? "Sem nome")
        );
        break;
      default:
        break;
    }
  
    setFilteredProducts(sorted);
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sort_by: sortBy })); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Carrossel de Promoções */}
      <Carousel />

      <div className="flex gap-8">
        {/* Products Grid */}
        <div className="flex-1">
          {/* Dropdown de ordenação */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Produtos Disponíveis
            </h2>
            <ProductSortDropdown 
              sortBy={filters.sort_by}
              onSortChange={handleSortChange}
            />
          </div>

          <p className="text-gray-600 mb-6">
            {filteredProducts.length} produtos encontrados
            {filters.search && filters.search.trim() !== '' && (
              <span> para "{filters.search}"</span>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filters.search && filters.search.trim() !== '' 
                  ? `Nenhum produto encontrado para "${filters.search}"`
                  : 'Nenhum produto disponível'
                }
              </p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="w-96 flex-shrink-0">
            <div className="sticky top-24">
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                isAuthenticated={isAuthenticated()}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
