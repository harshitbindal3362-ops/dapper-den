import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const emptyProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  original_price: null,
  stock_quantity: 0,
  images: [],
  colors: [],
  is_featured: false,
  is_new_arrival: false,
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProducts((data as Product[]) || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      toast({ title: 'Error', description: 'Name and price are required', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const productData = {
      name: editingProduct.name,
      description: editingProduct.description || '',
      price: editingProduct.price,
      original_price: editingProduct.original_price || null,
      stock_quantity: editingProduct.stock_quantity || 0,
      images: editingProduct.images || [],
      colors: editingProduct.colors || [],
      is_featured: editingProduct.is_featured || false,
      is_new_arrival: editingProduct.is_new_arrival || false,
      is_active: editingProduct.is_active ?? true,
    };

    if (editingProduct.id) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Product updated successfully' });
        setDialogOpen(false);
        fetchProducts();
      }
    } else {
      // Create
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Product created successfully' });
        setDialogOpen(false);
        fetchProducts();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully' });
      fetchProducts();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchProducts();
    }
  };

  const openEditDialog = (product?: Product) => {
    setEditingProduct(product ? { ...product } : { ...emptyProduct });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()} className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct.id ? 'Edit Product' : 'Add Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct(p => ({ ...p, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct(p => ({ ...p, description: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct(p => ({ ...p, price: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={editingProduct.original_price || ''}
                    onChange={(e) => setEditingProduct(p => ({ ...p, original_price: Number(e.target.value) || null }))}
                    className="mt-1"
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock_quantity || 0}
                  onChange={(e) => setEditingProduct(p => ({ ...p, stock_quantity: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={editingProduct.images?.join('\n') || ''}
                  onChange={(e) => setEditingProduct(p => ({ 
                    ...p, 
                    images: e.target.value.split('\n').filter(Boolean)
                  }))}
                  className="mt-1"
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>

              <div>
                <Label htmlFor="colors">Colors (comma separated)</Label>
                <Input
                  id="colors"
                  value={editingProduct.colors?.join(', ') || ''}
                  onChange={(e) => setEditingProduct(p => ({ 
                    ...p, 
                    colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                  }))}
                  className="mt-1"
                  placeholder="Silver, Gold, Black"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={editingProduct.is_featured || false}
                    onCheckedChange={(checked) => setEditingProduct(p => ({ ...p, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="newArrival"
                    checked={editingProduct.is_new_arrival || false}
                    onCheckedChange={(checked) => setEditingProduct(p => ({ ...p, is_new_arrival: checked }))}
                  />
                  <Label htmlFor="newArrival">New Arrival</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={editingProduct.is_active ?? true}
                    onCheckedChange={(checked) => setEditingProduct(p => ({ ...p, is_active: checked }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Product'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Stock</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.is_featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5">Featured</span>
                          )}
                          {product.is_new_arrival && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">₹{product.price.toLocaleString()}</p>
                    {product.original_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{product.original_price.toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={product.stock_quantity === 0 ? 'text-destructive' : ''}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 ${
                        product.is_active 
                          ? 'bg-success/20 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {product.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {product.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
