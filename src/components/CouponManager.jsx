import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Loader2, Plus, Edit, Trash2, Tag, Calendar, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CouponService from '../services/couponService';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    max_discount_amount: '',
    usage_limit: '',
    usage_limit_per_user: '1',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCoupons();
  }, [pagination.page]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await CouponService.getCoupons({
        page: pagination.page,
        per_page: pagination.per_page
      });
      setCoupons(data.coupons);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_value: '',
      max_discount_amount: '',
      usage_limit: '',
      usage_limit_per_user: '1',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setEditingCoupon(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar dados
    const errors = CouponService.validateCouponData(formData);
    if (errors.length > 0) {
      toast({
        title: "Dados inválidos",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Preparar dados para envio
      const submitData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : 0,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_limit_per_user: parseInt(formData.usage_limit_per_user)
      };

      if (editingCoupon) {
        await CouponService.updateCoupon(editingCoupon.id, submitData);
        toast({
          title: "Sucesso",
          description: "Cupom atualizado com sucesso!",
        });
      } else {
        await CouponService.createCoupon(submitData);
        toast({
          title: "Sucesso",
          description: "Cupom criado com sucesso!",
        });
      }

      setShowCreateDialog(false);
      resetForm();
      loadCoupons();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_value: coupon.min_order_value ? coupon.min_order_value.toString() : '',
      max_discount_amount: coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '',
      usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
      usage_limit_per_user: coupon.usage_limit_per_user.toString(),
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      is_active: coupon.is_active
    });
    setEditingCoupon(coupon);
    setShowCreateDialog(true);
  };

  const handleDelete = async (couponId) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;

    try {
      await CouponService.deleteCoupon(couponId);
      toast({
        title: "Sucesso",
        description: "Cupom excluído com sucesso!",
      });
      loadCoupons();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCouponStatusBadge = (coupon) => {
    const status = CouponService.getCouponStatus(coupon);
    const colorMap = {
      green: 'default',
      yellow: 'secondary',
      red: 'destructive',
      gray: 'outline'
    };
    
    return (
      <Badge variant={colorMap[status.color]}>
        {status.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Cupons</h2>
          <p className="text-gray-600">Crie e gerencie cupons de desconto</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                    placeholder="Ex: DESCONTO10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Desconto de 10%"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição do cupom..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo de Desconto *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value) => handleInputChange('discount_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Valor do Desconto * {formData.discount_type === 'percentage' ? '(%)' : '(R$)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.discount_type === 'percentage' ? '100' : undefined}
                    value={formData.discount_value}
                    onChange={(e) => handleInputChange('discount_value', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_value">Valor Mínimo do Pedido (R$)</Label>
                  <Input
                    id="min_order_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_order_value}
                    onChange={(e) => handleInputChange('min_order_value', e.target.value)}
                  />
                </div>
                
                {formData.discount_type === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="max_discount_amount">Desconto Máximo (R$)</Label>
                    <Input
                      id="max_discount_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_discount_amount}
                      onChange={(e) => handleInputChange('max_discount_amount', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Limite Total de Usos</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => handleInputChange('usage_limit', e.target.value)}
                    placeholder="Deixe vazio para ilimitado"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="usage_limit_per_user">Limite por Usuário</Label>
                  <Input
                    id="usage_limit_per_user"
                    type="number"
                    min="1"
                    value={formData.usage_limit_per_user}
                    onChange={(e) => handleInputChange('usage_limit_per_user', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Fim</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Cupom ativo</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingCoupon ? 'Atualizar' : 'Criar'} Cupom
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && !showCreateDialog ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span className="font-mono font-bold text-lg">{coupon.code}</span>
                      {getCouponStatusBadge(coupon)}
                    </div>
                    
                    <h3 className="font-semibold">{coupon.name}</h3>
                    
                    {coupon.description && (
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{CouponService.formatDiscount(coupon.discount_type, coupon.discount_value)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{coupon.used_count} usos</span>
                      </div>
                      
                      {coupon.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Até {CouponService.formatDate(coupon.end_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={coupon.used_count > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {coupons.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Tag className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">Nenhum cupom encontrado. Crie seu primeiro cupom!</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            disabled={!pagination.has_prev}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Anterior
          </Button>
          
          <span>Página {pagination.page} de {pagination.pages}</span>
          
          <Button
            variant="outline"
            disabled={!pagination.has_next}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}

export default CouponManager;
