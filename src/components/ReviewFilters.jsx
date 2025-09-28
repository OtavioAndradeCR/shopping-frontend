import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

const ReviewFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
      <div className="flex-1">
        <Label htmlFor="sort_by" className="sr-only">Ordenar por</Label>
        <Select value={filters.sort_by} onValueChange={(value) => onFilterChange('sort_by', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="oldest">Mais Antigas</SelectItem>
            <SelectItem value="highest_rating">Melhor Avaliadas</SelectItem>
            <SelectItem value="lowest_rating">Pior Avaliadas</SelectItem>
            <SelectItem value="most_helpful">Mais Úteis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="rating" className="sr-only">Filtrar por Estrelas</Label>
        <Select value={filters.rating ? String(filters.rating) : ''} onValueChange={(value) => onFilterChange('rating', value === '' ? null : Number(value))}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por Estrelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as Estrelas</SelectItem>
            <SelectItem value="5">5 Estrelas</SelectItem>
            <SelectItem value="4">4 Estrelas</SelectItem>
            <SelectItem value="3">3 Estrelas</SelectItem>
            <SelectItem value="2">2 Estrelas</SelectItem>
            <SelectItem value="1">1 Estrela</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified_only"
          checked={filters.verified_only}
          onCheckedChange={(checked) => onFilterChange('verified_only', checked)}
        />
        <Label htmlFor="verified_only">Apenas Compras Verificadas</Label>
      </div>
    </div>
  );
};

export default ReviewFilters;

