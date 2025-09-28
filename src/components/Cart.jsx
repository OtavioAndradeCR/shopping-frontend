import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Trash2, Plus, Minus, Lock } from 'lucide-react'
import CouponInput from './CouponInput'

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, isAuthenticated }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0
  const total = subtotal - discountAmount

  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData)
  }

  const handleCouponRemoved = () => {
    setAppliedCoupon(null)
  }

  const handleCheckout = () => {
    onCheckout({
      items: cartItems,
      subtotal,
      discount: discountAmount,
      total,
      coupon: appliedCoupon
    })
  }

  if (cartItems.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Carrinho de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Seu carrinho está vazio
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Carrinho de Compras
          <Badge variant="secondary">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                R$ {item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <Separator />
        
        {/* Cupom de desconto */}
        {isAuthenticated && (
          <div className="space-y-3">
            <CouponInput
              orderValue={subtotal}
              appliedCoupon={appliedCoupon}
              onCouponApplied={handleCouponApplied}
              onCouponRemoved={handleCouponRemoved}
            />
          </div>
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto ({appliedCoupon.code}):</span>
              <span>-R$ {discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-600">R$ {total.toFixed(2)}</span>
          </div>
          
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Faça login para finalizar a compra
                </p>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleCheckout} 
            className="w-full"
            size="lg"
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? 'Finalizar Compra' : 'Login Necessário'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Cart

