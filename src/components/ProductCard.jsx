import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ShoppingCart } from 'lucide-react'

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <CardHeader className="pb-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
            {product.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 min-h-[4.5rem]">
            {product.description}
          </CardDescription>
          <div className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <Button 
          onClick={() => onAddToCart(product)} 
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard

