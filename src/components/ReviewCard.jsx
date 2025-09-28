import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Edit, Trash2 } from 'lucide-react';
import StarRating, { RatingDisplay } from './StarRating';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from './ui/alert-dialog';

const ReviewCard = ({ review, onEditReview, onReviewDeleted }) => {
  const { voteReviewHelpful, formatReviewDate } = useReview();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const handleHelpfulVote = async (isHelpful) => {
    if (!isAuthenticated()) {
      alert('Você precisa estar logado para votar.');
      return;
    }
    try {
      await voteReviewHelpful(review.id, isHelpful);
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  };

  const isAuthor = isAuthenticated() && user.id === review.user_id;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.user?.username || 'Anon'}`} />
            <AvatarFallback>{review.user?.username ? review.user.username[0] : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800">{review.user?.username || 'Usuário Anônimo'}</p>
            <RatingDisplay rating={review.rating} size="sm" showCount={false} />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {formatReviewDate(review.created_at)}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-bold mb-2 flex items-center gap-2">
          {review.title}
          {review.is_verified_purchase && (
            <span className="text-green-600 text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Compra Verificada
            </span>
          )}
        </CardTitle>
        <p className="text-gray-700 mb-4">{review.comment}</p>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Esta avaliação foi útil?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHelpfulVote(true)}
              className="flex items-center gap-1 text-green-600 hover:text-green-700"
            >
              <ThumbsUp className="w-4 h-4" /> {review.helpful_votes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHelpfulVote(false)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <ThumbsDown className="w-4 h-4" /> {review.unhelpful_votes}
            </Button>
          </div>
          {(isAuthor || isAdmin()) && (
            <div className="flex items-center space-x-2">
              {isAuthor && (
                <Button variant="ghost" size="sm" onClick={() => onEditReview(review)}>
                  <Edit className="w-4 h-4 mr-1" /> Editar
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente esta avaliação.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onReviewDeleted(review.id)} className="bg-red-500 hover:bg-red-600">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

