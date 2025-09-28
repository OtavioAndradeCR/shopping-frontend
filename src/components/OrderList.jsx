import React from 'react';
import OrderCard from './OrderCard';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

const OrderList = ({ orders, loading }) => {
  if (loading && orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando pedidos...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
        />
      ))}
      
      {loading && orders.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Carregando mais pedidos...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderList;

