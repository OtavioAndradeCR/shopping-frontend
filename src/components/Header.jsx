import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ShoppingCart, User, Search, LogOut, Settings, History, Home } from 'lucide-react'
import { Input } from '@/components/ui/input.jsx'
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount, setShowCart, searchQuery, setSearchQuery } = useCart();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const openAdminPanel = () => {
    setShowAdminPanel(true);
  };

  const closeAdminPanel = () => {
    setShowAdminPanel(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                Shopping Online
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </Link>
              
              {isAuthenticated() && (
                <Link 
                  to="/orders" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/orders' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Meus Pedidos</span>
                </Link>
              )}
            </div>
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated() ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Olá, {user.username}
                    </span>
                    {isAdmin() && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  
                  {isAdmin() && (
                    <Button variant="ghost" size="sm" onClick={openAdminPanel}>
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowLogin(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCart(prev => !prev)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {cartCount > 0 && (
                  <Badge
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modais de Login e Registro */}
      {showLogin && (
        <Login 
          onClose={closeModals}
          onSwitchToRegister={switchToRegister}
        />
      )}
      
      {showRegister && (
        <Register 
          onClose={closeModals}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {/* Painel de Admin */}
      {showAdminPanel && (
        <AdminPanel onClose={closeAdminPanel} />
      )}
    </>
  )
}

export default Header;
