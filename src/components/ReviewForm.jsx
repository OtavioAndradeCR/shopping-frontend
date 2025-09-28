import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Star, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';

const ReviewForm = ({ 
  productId, 
  product = null,
  existingReview = null, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createReview, updateReview } = useReview();
  const { isAuthenticated } = useAuth();
  
  const isEditing = !!existingReview;
  
  // Preencher formulário se estiver editando
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating || 0,
        title: existingReview.title || '',
        comment: existingReview.comment || ''
      });
    }
  }, [existingReview]);
  
  // Verificar se usuário está autenticado
  if (!isAuthenticated()) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Login Necessário</h3>
            <p className="text-gray-600 mb-4">
              Você precisa fazer login para avaliar produtos.
            </p>
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erros quando o usuário começar a digitar
    if (errors.length > 0) {
      setErrors([]);
    }
  };
  
  const validateForm = () => {
    const newErrors = [];
    
    if (formData.rating === 0) {
      newErrors.push('Por favor, selecione uma classificação');
    }
    
    if (formData.title.length > 200) {
      newErrors.push('O título deve ter no máximo 200 caracteres');
    }
    
    if (formData.comment.length > 2000) {
      newErrors.push('O comentário deve ter no máximo 2000 caracteres');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing) {
        result = await updateReview(existingReview.id, formData);
      } else {
        result = await createReview(productId, formData);
      }
      
      if (result) {
        onSuccess && onSuccess(result);
        onClose && onClose();
      }
    } catch (error) {
      // Erro já é tratado no contexto
      console.error('Erro ao salvar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      rating: 0,
      title: '',
      comment: ''
    });
    setErrors([]);
    onClose && onClose();
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {isEditing ? 'Editar Avaliação' : 'Avaliar Produto'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {product && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">
                R$ {product.price?.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Erros de validação */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Corrija os seguintes erros:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Classificação */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Classificação *
            </Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => handleInputChange('rating', rating)}
                size="lg"
              />
              {formData.rating > 0 && (
                <span className="text-sm text-gray-600">
                  {formData.rating} de 5 estrelas
                </span>
              )}
            </div>
          </div>
          
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Título da avaliação (opcional)
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Resuma sua experiência com o produto"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              maxLength={200}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.title.length}/200 caracteres
            </div>
          </div>
          
          {/* Comentário */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-medium">
              Comentário (opcional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Conte sobre sua experiência com o produto. O que você gostou ou não gostou?"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              maxLength={2000}
              rows={4}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.comment.length}/2000 caracteres
            </div>
          </div>
          
          {/* Informações adicionais */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Dicas para uma boa avaliação:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Seja específico sobre o que gostou ou não gostou</li>
              <li>• Mencione a qualidade, funcionalidade e custo-benefício</li>
              <li>• Seja honesto e construtivo</li>
              <li>• Evite informações pessoais ou ofensivas</li>
            </ul>
          </div>
          
          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditing ? 'Atualizando...' : 'Publicando...'}
                </>
              ) : (
                isEditing ? 'Atualizar Avaliação' : 'Publicar Avaliação'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

