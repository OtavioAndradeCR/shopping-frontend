import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  size = 'md', 
  readonly = false,
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const isInteractive = !readonly && onRatingChange;
  
  // Tamanhos das estrelas
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  
  const starSize = sizeClasses[size] || sizeClasses.md;
  
  // Determinar qual rating usar para exibição
  const displayRating = isInteractive && hoverRating > 0 ? hoverRating : rating;
  
  const handleStarClick = (starValue) => {
    if (isInteractive) {
      onRatingChange(starValue);
    }
  };
  
  const handleStarHover = (starValue) => {
    if (isInteractive) {
      setHoverRating(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };
  
  const getStarColor = (starIndex) => {
    const starValue = starIndex + 1;
    
    if (displayRating >= starValue) {
      return 'text-yellow-400 fill-yellow-400';
    } else if (displayRating >= starValue - 0.5) {
      return 'text-yellow-400 fill-yellow-400/50';
    } else {
      return 'text-gray-300';
    }
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className={`flex items-center ${isInteractive ? 'cursor-pointer' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => (
          <Star
            key={starIndex}
            className={`${starSize} ${getStarColor(starIndex)} transition-colors duration-150 ${
              isInteractive ? 'hover:scale-110' : ''
            }`}
            onClick={() => handleStarClick(starIndex + 1)}
            onMouseEnter={() => handleStarHover(starIndex + 1)}
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {displayRating > 0 ? displayRating.toFixed(1) : '0.0'}
        </span>
      )}
      
      {isInteractive && hoverRating > 0 && (
        <span className="text-sm text-gray-500 ml-2">
          {hoverRating} estrela{hoverRating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

// Componente para exibir rating com estatísticas
export const RatingDisplay = ({ 
  rating, 
  totalReviews, 
  size = 'md',
  showCount = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <StarRating 
        rating={rating} 
        size={size} 
        readonly={true}
      />
      <span className="text-sm font-medium">
        {rating > 0 ? rating.toFixed(1) : '0.0'}
      </span>
      {showCount && totalReviews > 0 && (
        <span className="text-sm text-gray-500">
          ({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
};

// Componente para distribuição de ratings
export const RatingDistribution = ({ stats, className = '' }) => {
  if (!stats || stats.total_reviews === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-gray-500">Nenhuma avaliação ainda</p>
      </div>
    );
  }

  const { rating_distribution, total_reviews } = stats;

  return (
    <div className={`space-y-2 ${className}`}>
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = rating_distribution[stars] || 0;
        const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0;
        
        return (
          <div key={stars} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-right">{stars}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-gray-600">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;

