import React, { useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import OrderDetails from './OrderDetails';
import { 
  Calendar, 
  Package, 
  CreditCard, 
  Eye, 
  ChevronRight,
  MapPin
} from 'lucide-react';

const OrderCard = ({ order }) => {
  const { getStatusDisplay, getStatusColor } = useOrders();
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const finalAmount = order.total_amount - (order.discount_amount || 0);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Pedido #{order.order_number}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.created_at)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(order.status)} border-0`}>
                {getStatusDisplay(order.status)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Valor */}
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <div className="flex items-center gap-2">
                  {order.discount_amount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(order.total_amount)}
                    </span>
                  )}
                  <span className="font-semibold text-green-600">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <p className="text-xs text-green-600">
                    Desconto: {formatCurrency(order.discount_amount)}
                  </p>
                )}
              </div>
            </div>

            {/* Itens */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Itens</p>
                <p className="font-semibold">
                  {order.items_count} {order.items_count === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>

            {/* Endereço (se disponível) */}
            {order.shipping_address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Entrega</p>
                  <p className="font-semibold text-sm truncate">
                    {order.shipping_address.length > 30 
                      ? `${order.shipping_address.substring(0, 30)}...`
                      : order.shipping_address
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cupom aplicado */}
          {order.coupon_code && (
            <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-medium">Cupom aplicado:</span> {order.coupon_code}
              </p>
            </div>
          )}

          {/* Método de pagamento */}
          {order.payment_method && (
            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">Pagamento:</span> {order.payment_method}
            </div>
          )}

          {/* Notas */}
          {order.notes && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Observações:</span> {order.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Atualizado em {formatDate(order.updated_at)}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Ver Detalhes Completos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {showDetails && (
        <OrderDetails
          orderId={order.id}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default OrderCard;

