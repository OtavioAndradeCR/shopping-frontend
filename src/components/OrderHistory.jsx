import React, { useEffect, useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import OrderList from './OrderList';
import OrderFilters from './OrderFilters';
import OrderStats from './OrderStats';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const OrderHistory = () => {
  const { user } = useAuth();
  const {
    orders,
    stats,
    loading,
    error,
    pagination,
    filters,
    fetchUserOrders,
    fetchUserStats,
    setFilters,
    clearError
  } = useOrders();

  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserOrders(1, filters);
      if (showStats) {
        fetchUserStats();
      }
    }
  }, [user, filters, fetchUserOrders, fetchUserStats, showStats]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUserOrders(page, filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Login Necessário
            </h2>
            <p className="text-gray-600 text-center">
              Você precisa fazer login para ver seu histórico de compras.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Histórico de Compras
          </h1>
        </div>
        <p className="text-gray-600">
          Acompanhe todos os seus pedidos e compras realizadas
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-2 h-auto p-0 text-red-600 hover:text-red-800"
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Section */}
      {showStats && stats && (
        <div className="mb-8">
          <OrderStats stats={stats} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Loading State */}
      {loading && orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Carregando histórico de compras...</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 text-center mb-4">
              {Object.keys(filters).length > 0
                ? 'Nenhum pedido corresponde aos filtros aplicados.'
                : 'Você ainda não fez nenhuma compra.'}
            </p>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <>
          <OrderList
            orders={orders}
            loading={loading}
          />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev || loading}
                >
                  Anterior
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    
                    return (
                      <Button
                        key={page}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {pagination.pages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.pages)}
                        disabled={loading}
                      >
                        {pagination.pages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next || loading}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Mostrando {orders.length} de {pagination.total} pedidos
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;

