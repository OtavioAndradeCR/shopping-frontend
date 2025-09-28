import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import ReviewService from '../services/reviewService';

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview deve ser usado dentro de um ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  });
  const { toast } = useToast();

  // Carregar avaliações de um produto
  const loadProductReviews = useCallback(async (productId, params = {}) => {
    try {
      setLoading(true);
      const response = await ReviewService.getProductReviews(productId, params);
      
      setReviews(response.reviews || []);
      setReviewStats(response.stats || null);
      setPagination(response.pagination || pagination);
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, pagination]);

  // Carregar estatísticas de avaliações de um produto
  const loadProductReviewStats = useCallback(async (productId) => {
    try {
      const stats = await ReviewService.getProductReviewStats(productId);
      setReviewStats(stats);
      return stats;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Criar nova avaliação
  const createReview = useCallback(async (productId, reviewData) => {
    try {
      setLoading(true);
      
      // Validar dados
      const validationErrors = ReviewService.validateReviewData(reviewData);
      if (validationErrors.length > 0) {
        toast({
          title: "Dados inválidos",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        return false;
      }

      const response = await ReviewService.createReview(productId, reviewData);
      
      toast({
        title: "Sucesso",
        description: "Avaliação criada com sucesso!",
      });

      // Recarregar avaliações do produto
      await loadProductReviews(productId);
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, loadProductReviews]);

  // Atualizar avaliação
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      setLoading(true);
      
      // Validar dados
      const validationErrors = ReviewService.validateReviewData(reviewData);
      if (validationErrors.length > 0) {
        toast({
          title: "Dados inválidos",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        return false;
      }

      const response = await ReviewService.updateReview(reviewId, reviewData);
      
      toast({
        title: "Sucesso",
        description: "Avaliação atualizada com sucesso!",
      });

      // Atualizar a avaliação na lista local
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? response.review : review
        )
      );
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Deletar avaliação
  const deleteReview = useCallback(async (reviewId, productId = null) => {
    try {
      setLoading(true);
      
      await ReviewService.deleteReview(reviewId);
      
      toast({
        title: "Sucesso",
        description: "Avaliação removida com sucesso!",
      });

      // Remover da lista local
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewId)
      );

      // Se temos o productId, recarregar as estatísticas
      if (productId) {
        await loadProductReviewStats(productId);
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, loadProductReviewStats]);

  // Votar se uma avaliação é útil
  const voteReviewHelpful = useCallback(async (reviewId, isHelpful) => {
    try {
      const response = await ReviewService.voteReviewHelpful(reviewId, isHelpful);
      
      // Atualizar os votos na lista local
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? {
                ...review,
                helpful_votes: response.helpful_votes,
                unhelpful_votes: response.unhelpful_votes
              }
            : review
        )
      );

      toast({
        title: "Sucesso",
        description: "Voto registrado com sucesso!",
      });
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Carregar avaliações do usuário
  const loadUserReviews = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await ReviewService.getUserReviews(params);
      
      setUserReviews(response.reviews || []);
      setPagination(response.pagination || pagination);
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, pagination]);

  // Carregar avaliações pendentes (admin)
  const loadPendingReviews = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await ReviewService.getPendingReviews(params);
      
      setPendingReviews(response.reviews || []);
      setPagination(response.pagination || pagination);
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, pagination]);

  // Aprovar/rejeitar avaliação (admin)
  const moderateReview = useCallback(async (reviewId, isApproved) => {
    try {
      setLoading(true);
      
      const response = await ReviewService.approveReview(reviewId, isApproved);
      
      toast({
        title: "Sucesso",
        description: `Avaliação ${isApproved ? 'aprovada' : 'rejeitada'} com sucesso!`,
      });

      // Remover da lista de pendentes
      setPendingReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewId)
      );
      
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Limpar estado
  const clearReviews = useCallback(() => {
    setReviews([]);
    setReviewStats(null);
    setUserReviews([]);
    setPendingReviews([]);
    setPagination({
      page: 1,
      per_page: 10,
      total: 0,
      pages: 0,
      has_next: false,
      has_prev: false
    });
  }, []);

  // Verificar se usuário pode avaliar produto
  const canUserReviewProduct = useCallback(async (productId) => {
    try {
      return await ReviewService.canUserReviewProduct(productId);
    } catch (error) {
      return false;
    }
  }, []);

  // Funções utilitárias
  const formatRating = ReviewService.formatRating;
  const getStarsArray = ReviewService.getStarsArray;
  const getRatingColor = ReviewService.getRatingColor;
  const formatReviewDate = ReviewService.formatReviewDate;

  const value = {
    // Estado
    reviews,
    reviewStats,
    userReviews,
    pendingReviews,
    loading,
    pagination,

    // Ações
    loadProductReviews,
    loadProductReviewStats,
    createReview,
    updateReview,
    deleteReview,
    voteReviewHelpful,
    loadUserReviews,
    loadPendingReviews,
    moderateReview,
    clearReviews,
    canUserReviewProduct,

    // Utilitários
    formatRating,
    getStarsArray,
    getRatingColor,
    formatReviewDate
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

