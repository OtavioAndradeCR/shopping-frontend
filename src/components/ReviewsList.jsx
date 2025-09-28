import React from 'react';
import ReviewCard from './ReviewCard';
import { useReview } from '../contexts/ReviewContext';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const ReviewsList = ({ productId, onEditReview }) => {
  const { reviews, loading, pagination, loadProductReviews, deleteReview } = useReview();

  const handleLoadMore = () => {
    if (pagination.has_next) {
      loadProductReviews(productId, { page: pagination.page + 1, per_page: pagination.per_page });
    }
  };

  const handleReviewDeleted = async (reviewId) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await deleteReview(reviewId, productId); // Passa productId para recarregar stats
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
      }
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-gray-600 mt-2">Carregando avaliações...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma avaliação encontrada para este produto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          onEditReview={onEditReview}
          onReviewDeleted={handleReviewDeleted}
        />
      ))}
      {pagination.has_next && (
        <div className="text-center mt-6">
          <Button 
            onClick={handleLoadMore} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Carregar Mais Avaliações
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;

