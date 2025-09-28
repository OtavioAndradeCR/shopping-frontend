import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ReviewProvider } from './contexts/ReviewContext'
import { OrderProvider } from './contexts/OrderContext'
import Header from './components/Header'
import HomePage from './components/HomePage'
import OrderHistory from './components/OrderHistory'
import ProductDetailPage from './components/ProductDetailPage'

function App() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </OrderProvider>
        </CartProvider>
      </ReviewProvider>
    </AuthProvider>
  )
}

export default App

