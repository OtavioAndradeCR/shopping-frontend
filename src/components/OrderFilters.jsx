import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Filter, X, Search, Calendar } from 'lucide-react';

const OrderFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Conteúdo expandível */}
      <CardContent className={`space-y-4 ${!isExpanded ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca por número do pedido */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              Número do Pedido
            </Label>
            <Input
              id="search"
              placeholder="ORD12345..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={localFilters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data inicial */}
          <div className="space-y-2">
            <Label htmlFor="date_from" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data Inicial
            </Label>
            <Input
              id="date_from"
              type="date"
              value={localFilters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>

          {/* Data final */}
          <div className="space-y-2">
            <Label htmlFor="date_to" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data Final
            </Label>
            <Input
              id="date_to"
              type="date"
              value={localFilters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="space-y-2">
          <Label>Filtros Rápidos</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                handleFilterChange('date_from', thirtyDaysAgo.toISOString().split('T')[0]);
                handleFilterChange('date_to', today.toISOString().split('T')[0]);
              }}
            >
              Últimos 30 dias
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                handleFilterChange('date_from', ninetyDaysAgo.toISOString().split('T')[0]);
                handleFilterChange('date_to', today.toISOString().split('T')[0]);
              }}
            >
              Últimos 3 meses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                handleFilterChange('date_from', oneYearAgo.toISOString().split('T')[0]);
                handleFilterChange('date_to', today.toISOString().split('T')[0]);
              }}
            >
              Último ano
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'delivered')}
            >
              Apenas entregues
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'pending')}
            >
              Pendentes
            </Button>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Limpar Todos
          </Button>
        </div>
      </CardContent>

      {/* Resumo dos filtros ativos */}
      {hasActiveFilters && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;

              let displayValue = value;
              if (key === 'status') {
                const statusMap = {
                  pending: 'Pendente',
                  confirmed: 'Confirmado',
                  shipped: 'Enviado',
                  delivered: 'Entregue',
                  cancelled: 'Cancelado',
                };
                displayValue = statusMap[value] || value;
              } else if (key === 'date_from') {
                displayValue = `A partir de ${new Date(value).toLocaleDateString('pt-BR')}`;
              } else if (key === 'date_to') {
                displayValue = `Até ${new Date(value).toLocaleDateString('pt-BR')}`;
              } else if (key === 'search') {
                displayValue = `Busca: ${value}`;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {displayValue}
                  <button
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key];
                      onFilterChange(newFilters);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default OrderFilters;
