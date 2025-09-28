import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Loader2, Tag, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CouponService from '../services/couponService';

const CouponInput = ({ 
  orderValue, 
  appliedCoupon, 
  onCouponApplied, 
  onCouponRemoved,
  disabled = false 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código de cupom",
        variant: "destructive",
      });
      return;
    }

    try {
      setValidating(true);
      const result = await CouponService.validateCoupon(couponCode.trim(), orderValue);
      
      toast({
        title: "Cupom válido!",
        description: `Desconto de R$ ${result.discount_amount.toFixed(2)}`,
      });

      // Aplicar cupom automaticamente após validação
      handleApplyCoupon();
      
    } catch (error) {
      toast({
        title: "Cupom inválido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setLoading(true);
      const result = await CouponService.applyCoupon(couponCode.trim(), orderValue);
      
      onCouponApplied({
        code: result.coupon_code,
        discount_amount: result.discount_amount,
        final_value: result.final_value
      });

      setCouponCode('');
      
      toast({
        title: "Cupom aplicado!",
        description: result.message,
      });
      
    } catch (error) {
      toast({
        title: "Erro ao aplicar cupom",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do seu pedido",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleValidateCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Cupom aplicado: {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-600">
                  Desconto: R$ {appliedCoupon.discount_amount.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              disabled={disabled}
              className="text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <Label htmlFor="coupon-code" className="text-sm font-medium">
              Cupom de desconto
            </Label>
          </div>
          
          <div className="flex gap-2">
            <Input
              id="coupon-code"
              placeholder="Digite o código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={disabled || loading || validating}
              className="flex-1"
            />
            <Button
              onClick={handleValidateCoupon}
              disabled={disabled || loading || validating || !couponCode.trim()}
              size="sm"
            >
              {validating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Aplicar'
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Digite o código e clique em "Aplicar" para validar</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponInput;

