import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import ReviewsSection from './ReviewsSection';
import Cart from './Cart';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import { RatingDisplay } from './StarRating';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState(null);
  const { toast } = useToast();
  const { 
    addToCart, 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    handleCheckout, 
    showCart, 
    setShowCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { loadProductReviewStats } = useReview();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProduct(id);
        setProduct(data);
        
        try {
          const stats = await loadProductReviewStats(id);
          setReviewStats(stats);
        } catch (reviewError) {
          console.log('Erro ao carregar estatísticas de reviews:', reviewError);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast, loadProductReviewStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="ml-4 text-gray-600">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
        <p className="text-gray-600 mb-8">O produto que você está procurando não existe ou foi removido.</p>
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para a loja
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Product Details */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center items-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-w-full h-auto rounded-lg shadow-sm object-contain max-h-96"
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-xl text-gray-600">{product.category}</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                {reviewStats && reviewStats.total_reviews > 0 && (
                  <RatingDisplay rating={reviewStats.average_rating} totalReviews={reviewStats.total_reviews} size="md" />
                )}
              </div>
              <Button 
                className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao Carrinho
              </Button>
            </div>
          </div>

          <ReviewsSection productId={product.id} product={product} />
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
};

export default ProductDetailPage;

