import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ShoppingBag,
  DollarSign,
  Calendar,
  Package,
  TrendingUp,
  Award
} from 'lucide-react';

const OrderStats = ({ stats }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Pedidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_orders}</div>
          <p className="text-xs text-muted-foreground">
            Todos os pedidos realizados
          </p>
        </CardContent>
      </Card>

      {/* Valor Total Gasto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.total_spent)}
          </div>
          <p className="text-xs text-muted-foreground">
            Valor total de todas as compras
          </p>
        </CardContent>
      </Card>

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Últimos 30 Dias</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.recent_orders_30_days}
          </div>
          <p className="text-xs text-muted-foreground">
            Pedidos no último mês
          </p>
        </CardContent>
      </Card>

      {/* Produto Mais Comprado */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produto Favorito</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold truncate">
            {stats.most_bought_product.name || 'Nenhum'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.most_bought_product.quantity > 0 
              ? `${stats.most_bought_product.quantity} unidades`
              : 'Nenhuma compra ainda'
            }
          </p>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      {Object.keys(stats.status_counts).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(stats.status_counts).map(([status, count]) => (
                <div key={status} className="text-center">
                  <Badge className={`${getStatusColor(status)} border-0 mb-2`}>
                    {getStatusDisplay(status)}
                  </Badge>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">
                    {count === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Rápido */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumo da Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.status_counts.delivered || 0}
              </div>
              <p className="text-sm text-green-800">Pedidos Entregues</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(stats.status_counts.pending || 0) + (stats.status_counts.confirmed || 0) + (stats.status_counts.shipped || 0)}
              </div>
              <p className="text-sm text-blue-800">Pedidos em Andamento</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.total_orders > 0 ? formatCurrency(stats.total_spent / stats.total_orders) : formatCurrency(0)}
              </div>
              <p className="text-sm text-purple-800">Ticket Médio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;

