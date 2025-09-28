import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Plus, Edit, Trash2, X, Package, Tag } from 'lucide-react';
import CouponManager from './CouponManager';

const AdminPanel = ({ onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso",
        });
        resetForm();
        loadProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar produto');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso",
        });
        resetForm();
        loadProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar produto');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso",
        });
        loadProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir produto');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      image: product.image
    });
    setShowAddForm(false);
  };

  const startAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-center">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Painel de Administração</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Cupons
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-6">
              {/* Botão Adicionar Produto */}
              <div className="mb-6">
                <Button onClick={startAdd} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Produto
                </Button>
              </div>

              {/* Formulário de Adicionar/Editar */}
              {(showAddForm || editingProduct) && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                  </h3>
                  
                  <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Título</label>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço</label>
                        <Input
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <Input
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                        <Input
                          name="image"
                          type="url"
                          value={formData.image}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingProduct ? 'Atualizar' : 'Adicionar'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de Produtos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Produtos ({products.length})</h3>
                
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.title}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="coupons">
              <CouponManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

