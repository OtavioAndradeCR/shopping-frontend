import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Star, CheckCircle, TrendingUp } from 'lucide-react';
import { RatingDisplay, RatingDistribution } from './StarRating';

const ReviewStats = ({ stats }) => {
  if (!stats || stats.total_reviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Estatísticas de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Nenhuma avaliação para exibir estatísticas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Estatísticas de Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Média de Avaliações */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Média de Avaliações</p>
          <RatingDisplay 
            rating={stats.average_rating} 
            totalReviews={stats.total_reviews} 
            size="xl" 
            className="justify-center"
          />
        </div>

        {/* Distribuição de Estrelas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Distribuição por Estrelas</h3>
          <RatingDistribution stats={stats} />
        </div>

        {/* Compras Verificadas */}
        <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
          <CheckCircle className="w-5 h-5" />
          <span>{stats.verified_purchases_count} Compras Verificadas</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStats;

