import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PlusCircle, Loader2, Star } from 'lucide-react';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import { RatingDisplay, RatingDistribution } from './StarRating';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ReviewStats from './ReviewStats';
import ReviewFilters from './ReviewFilters';

const ReviewsSection = ({ productId, product }) => {
  const { 
    reviews, 
    reviewStats, 
    loading, 
    loadProductReviews, 
    loadProductReviewStats, 
    clearReviews,
    canUserReviewProduct
  } = useReview();
  const { isAuthenticated } = useAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userCanReview, setUserCanReview] = useState(false);
  const [filters, setFilters] = useState({
    sort_by: 'newest',
    rating: null,
    verified_only: false
  });

  useEffect(() => {
    if (productId) {
      const loadData = async () => {
        try {
          await loadProductReviews(productId, filters);
          await loadProductReviewStats(productId);
          if (isAuthenticated()) {
            await checkUserCanReview();
          }
        } catch (error) {
          console.error('Erro ao carregar dados de reviews:', error);
        }
      };
      
      loadData();
    }
    return () => clearReviews();
  }, [productId, filters, isAuthenticated]);

  const checkUserCanReview = async () => {
    const canReview = await canUserReviewProduct(productId);
    setUserCanReview(canReview);
  };

  const handleAddReviewClick = () => {
    if (!isAuthenticated()) {
      alert('Você precisa estar logado para escrever uma avaliação.');
      return;
    }
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewFormSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    loadProductReviews(productId, filters); // Recarregar lista de reviews
    loadProductReviewStats(productId); // Recarregar estatísticas
    checkUserCanReview(); // Re-verificar se pode avaliar
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Avaliações de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && reviews.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-600 mt-2">Carregando avaliações...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seção de Estatísticas */}
            <div className="lg:col-span-1 space-y-6">
              {reviewStats && reviewStats.total_reviews > 0 ? (
                <>
                  <ReviewStats stats={reviewStats} />
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhuma avaliação ainda.</p>
                </div>
              )}

              {userCanReview && (
                <Button 
                  onClick={handleAddReviewClick} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> Escrever uma avaliação
                </Button>
              )}
            </div>

            {/* Seção de Listagem de Avaliações */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Todas as Avaliações ({reviewStats?.total_reviews || 0})</h3>
                {/* <ReviewFilters filters={filters} onFilterChange={handleFilterChange} /> */}
              </div>
              <ReviewsList productId={productId} onEditReview={handleEditReview} />
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingReview ? 'Editar Avaliação' : 'Escrever Avaliação'}</DialogTitle>
          </DialogHeader>
          <ReviewForm 
            productId={productId} 
            product={product}
            existingReview={editingReview} 
            onClose={() => setShowReviewForm(false)} 
            onSuccess={handleReviewFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReviewsSection;

