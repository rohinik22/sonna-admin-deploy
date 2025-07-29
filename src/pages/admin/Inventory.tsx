import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp, Edit3, Trash2, Download, Upload, Clock, RefreshCw } from 'lucide-react';
import { inventoryAPI } from '@/lib/api';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumThreshold: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

const initialInventoryItems: InventoryItem[] = [];

const categories = ['All', 'Bakery', 'Dairy', 'Pantry', 'Herbs', 'Spices', 'Meat', 'Vegetables', 'Beverages'];

const getStatusColor = (status) => ({
  in_stock: 'bg-green-100 text-green-700 hover:bg-green-100',
  low_stock: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  out_of_stock: 'bg-red-100 text-red-700 hover:bg-red-100',
  expired: 'bg-purple-100 text-purple-700 hover:bg-purple-100'
}[status] || 'bg-gray-100 text-gray-700 hover:bg-gray-100');

const getStatusText = (status) => ({
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  expired: 'Expired'
}[status] || status);

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: () => void;
  onDelete: () => void;
  onRestock: () => void;
}
const InventoryCard: React.FC<InventoryCardProps> = ({ item, onEdit, onDelete, onRestock }) => {
  const getDaysUntilExpiry = () => {
    if (!item.expiryDate) return null;
    const days = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };
  const daysUntilExpiry = getDaysUntilExpiry();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription>{item.category} • {item.supplier}</CardDescription>
          </div>
          <Badge className={getStatusColor(item.status)}>
            {getStatusText(item.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-2xl font-bold">
              {item.currentStock} <span className="text-sm font-normal">{item.unit}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Minimum Threshold</p>
            <p className="text-lg font-semibold">
              {item.minimumThreshold} <span className="text-sm font-normal">{item.unit}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Unit Cost</p>
            <p className="font-semibold">₹{item.unitCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="font-semibold">₹{(item.currentStock * item.unitCost).toFixed(2)}</p>
          </div>


        </div>
        <div className="space-y-2">
          {item.currentStock <= item.minimumThreshold && (
            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700">Stock below minimum threshold</span>
            </div>
          )}
          {daysUntilExpiry !== null && daysUntilExpiry <= 3 && (
            <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{daysUntilExpiry <= 0 ? 'Expired' : `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`}</span>
            </div>
          )}
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Last restocked: {item.lastRestocked.toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Button size="sm" className="flex-1" onClick={onRestock}>Restock</Button>
          <Button variant="outline" size="sm" onClick={onEdit}><Edit3 className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
};


interface AddInventoryDialogProps {
  onAdd: (item: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => void;
}
const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    currentStock: '',
    minimumThreshold: '',
    unit: '',
    unitCost: '',
    supplier: '',
    expiryDate: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCategory = (val: string) => setForm(f => ({ ...f, category: val }));
  const handleSubmit = () => {
    if (!form.name || !form.category || !form.currentStock || !form.minimumThreshold || !form.unit || !form.unitCost || !form.supplier) return;
    onAdd({
      name: form.name,
      category: form.category,
      currentStock: Number(form.currentStock),
      minimumThreshold: Number(form.minimumThreshold),
      unit: form.unit,
      unitCost: Number(form.unitCost),
      supplier: form.supplier,
      expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined
    });
    setIsOpen(false);
    setForm({ name: '', category: '', currentStock: '', minimumThreshold: '', unit: '', unitCost: '', supplier: '', expiryDate: '' });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>Add a new item to your inventory</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" name="name" value={form.name} onChange={handleChange} placeholder="Enter item name" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={handleCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg">
                  {categories.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input id="current-stock" name="currentStock" type="number" value={form.currentStock} onChange={handleChange} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="min-threshold">Min Threshold</Label>
              <Input id="min-threshold" name="minimumThreshold" type="number" value={form.minimumThreshold} onChange={handleChange} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, bottles, etc." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit-cost">Unit Cost (₹)</Label>
              <Input id="unit-cost" name="unitCost" type="number" step="0.01" value={form.unitCost} onChange={handleChange} placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier name" />
            </div>
          </div>
          <div>
            <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
            <Input id="expiry-date" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Item</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Dialog
interface EditInventoryDialogProps {
  item: InventoryItem;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}
const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({ item, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...item, expiryDate: item.expiryDate ? item.expiryDate.toISOString().slice(0, 10) : '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCategory = (val: string) => setForm(f => ({ ...f, category: val }));
  const handleSubmit = () => {
    onSave({
      ...item,
      ...form,
      currentStock: Number(form.currentStock),
      minimumThreshold: Number(form.minimumThreshold),
      unitCost: Number(form.unitCost),
      expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined
    });
  };
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-name-edit">Item Name</Label>
              <Input id="item-name-edit" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="category-edit">Category</Label>
              <Select value={form.category} onValueChange={handleCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg">
                  {categories.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-stock-edit">Current Stock</Label>
              <Input id="current-stock-edit" name="currentStock" type="number" value={form.currentStock} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="min-threshold-edit">Min Threshold</Label>
              <Input id="min-threshold-edit" name="minimumThreshold" type="number" value={form.minimumThreshold} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="unit-edit">Unit</Label>
              <Input id="unit-edit" name="unit" value={form.unit} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit-cost-edit">Unit Cost (₹)</Label>
              <Input id="unit-cost-edit" name="unitCost" type="number" step="0.01" value={form.unitCost} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="supplier-edit">Supplier</Label>
              <Input id="supplier-edit" name="supplier" value={form.supplier} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="expiry-date-edit">Expiry Date (Optional)</Label>
            <Input id="expiry-date-edit" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Restock Dialog
interface RestockDialogProps {
  item: InventoryItem;
  onRestock: (id: string, qty: number, expiryDate?: Date) => void;
  onCancel: () => void;
}
const RestockDialog: React.FC<RestockDialogProps> = ({ item, onRestock, onCancel }) => {
  const [qty, setQty] = useState('');
  const [expiry, setExpiry] = useState(item.expiryDate ? item.expiryDate.toISOString().slice(0, 10) : '');
  const handleSubmit = () => {
    if (!qty) return;
    onRestock(item.id, Number(qty), expiry ? new Date(expiry) : undefined);
  };
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restock {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="restock-qty">Quantity to Add</Label>
            <Input id="restock-qty" type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label htmlFor="restock-expiry">Expiry Date (Optional)</Label>
            <Input id="restock-expiry" type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Restock</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]), [searchTerm, setSearchTerm] = useState(''), [categoryFilter, setCategoryFilter] = useState('All'), [statusFilter, setStatusFilter] = useState('all'), [editItem, setEditItem] = useState(null), [restockItem, setRestockItem] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await inventoryAPI.getItems();
        setInventoryItems(data.items || []);
      } catch {
        setError('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredItems = inventoryItems.filter(item => {
    const s = searchTerm.toLowerCase();
    return (item.name.toLowerCase().includes(s) || item.supplier.toLowerCase().includes(s)) && (categoryFilter === 'All' || item.category === categoryFilter) && (statusFilter === 'all' || item.status === statusFilter);
  });
  const stats = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter(i => i.status === 'in_stock').length,
    lowStock: inventoryItems.filter(i => i.status === 'low_stock').length,
    outOfStock: inventoryItems.filter(i => i.status === 'out_of_stock').length,
    totalValue: inventoryItems.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0)
  };
  // ...existing code for add/edit/delete/restock/export/import...
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        {/* ...existing code... */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading inventory...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            {/* Stats Cards, Alerts, Filters, Inventory Grid, Dialogs, Empty State */}
            {/* ...existing code... */}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
