import React, { useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Loader2,
  X,
  ShoppingCart
} from 'lucide-react';

const OrderDetails = ({ orderId, isOpen, onClose }) => {
  const {
    currentOrder,
    loading,
    error,
    fetchOrderDetails,
    clearCurrentOrder,
    getStatusDisplay,
    getStatusColor
  } = useOrders();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails(orderId);
    }
    
    return () => {
      if (!isOpen) {
        clearCurrentOrder();
      }
    };
  }, [isOpen, orderId, fetchOrderDetails, clearCurrentOrder]);

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

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Carregando detalhes do pedido...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !currentOrder) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Erro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              {error || 'Não foi possível carregar os detalhes do pedido.'}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const order = currentOrder;
  const finalAmount = order.total_amount - (order.discount_amount || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              Pedido #{order.order_number}
            </DialogTitle>
            <Badge className={`${getStatusColor(order.status)} border-0`}>
              {getStatusDisplay(order.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Data do Pedido</p>
                    <p className="font-semibold">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Última Atualização</p>
                    <p className="font-semibold">{formatDate(order.updated_at)}</p>
                  </div>
                </div>

                {order.payment_method && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Método de Pagamento</p>
                      <p className="font-semibold">{order.payment_method}</p>
                    </div>
                  </div>
                )}

                {order.shipping_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Endereço de Entrega</p>
                      <p className="font-semibold">{order.shipping_address}</p>
                    </div>
                  </div>
                )}
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Observações:</p>
                  <p className="text-gray-800">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Itens do Pedido ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Preço unitário: {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>

                {order.discount_amount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span className="font-semibold">
                        -{formatCurrency(order.discount_amount)}
                      </span>
                    </div>
                    
                    {order.coupon_code && (
                      <div className="text-sm text-gray-600">
                        Cupom aplicado: <span className="font-medium">{order.coupon_code}</span>
                      </div>
                    )}
                  </>
                )}

                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;

