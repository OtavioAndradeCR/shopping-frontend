import { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ApiService from '../services/api';
import { useAuth } from './AuthContext';


const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.title} foi adicionado ao carrinho.`,
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Produto removido",
      description: "Produto removido do carrinho.",
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!isAuthenticated()) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const item of cartItems) {
        await ApiService.createPurchase({
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity
        });
      }

      toast({
        title: "Compra realizada!",
        description: "Sua compra foi processada com sucesso.",
      });

      setCartItems([]);
      setShowCart(false);

    } catch (error) {
      toast({
        title: "Erro na compra",
        description: "Não foi possível processar sua compra. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    cartCount,
    showCart,
    searchQuery,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    handleCheckout,
    setShowCart,
    setSearchQuery,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
