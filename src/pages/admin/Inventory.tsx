import React, { useState, useEffect } from 'react';
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

const initialInventoryItems: InventoryItem[] = [
  // Bakery & Breads
  { id: '1', name: 'Wheat Flour', category: 'Bakery', currentStock: 25, minimumThreshold: 10, unit: 'kg', unitCost: 48, supplier: 'Karnataka Flour Mills', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '2', name: 'Maida (Refined Flour)', category: 'Bakery', currentStock: 18, minimumThreshold: 8, unit: 'kg', unitCost: 52, supplier: 'Karnataka Flour Mills', lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '3', name: 'Baking Powder', category: 'Bakery', currentStock: 10, minimumThreshold: 3, unit: 'kg', unitCost: 120, supplier: 'Blue Bird', lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '4', name: 'Cocoa Powder', category: 'Bakery', currentStock: 7, minimumThreshold: 2, unit: 'kg', unitCost: 350, supplier: 'Weikfield', lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '5', name: 'Belgian Chocolate', category: 'Bakery', currentStock: 4, minimumThreshold: 2, unit: 'kg', unitCost: 850, supplier: 'Imported', lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '6', name: 'Vanilla Extract', category: 'Bakery', currentStock: 2, minimumThreshold: 1, unit: 'litre', unitCost: 1200, supplier: 'Sprig', lastRestocked: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Dairy
  { id: '7', name: 'Paneer', category: 'Dairy', currentStock: 10, minimumThreshold: 5, unit: 'kg', unitCost: 320, supplier: 'Amul Dairy', lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '8', name: 'Fresh Cream', category: 'Dairy', currentStock: 6, minimumThreshold: 3, unit: 'litre', unitCost: 210, supplier: 'Amul Dairy', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '9', name: 'Mozzarella Cheese', category: 'Dairy', currentStock: 5, minimumThreshold: 2, unit: 'kg', unitCost: 480, supplier: 'Go Cheese', lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '10', name: 'Butter', category: 'Dairy', currentStock: 8, minimumThreshold: 3, unit: 'kg', unitCost: 420, supplier: 'Amul Dairy', lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '11', name: 'Fresh Mawa (Khoya)', category: 'Dairy', currentStock: 3, minimumThreshold: 1, unit: 'kg', unitCost: 380, supplier: 'Local Dairy', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Vegetables
  { id: '12', name: 'Onions', category: 'Vegetables', currentStock: 20, minimumThreshold: 8, unit: 'kg', unitCost: 38, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '13', name: 'Garlic', category: 'Vegetables', currentStock: 8, minimumThreshold: 3, unit: 'kg', unitCost: 120, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '14', name: 'Ginger', category: 'Vegetables', currentStock: 6, minimumThreshold: 2, unit: 'kg', unitCost: 90, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '15', name: 'Cauliflower', category: 'Vegetables', currentStock: 10, minimumThreshold: 3, unit: 'kg', unitCost: 60, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '16', name: 'Potatoes', category: 'Vegetables', currentStock: 25, minimumThreshold: 10, unit: 'kg', unitCost: 32, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Spices
  { id: '17', name: 'Garam Masala', category: 'Spices', currentStock: 8, minimumThreshold: 3, unit: 'packets', unitCost: 65, supplier: 'MDH Spices', lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '18', name: 'Turmeric Powder', category: 'Spices', currentStock: 6, minimumThreshold: 2, unit: 'packets', unitCost: 40, supplier: 'MDH Spices', lastRestocked: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '19', name: 'Cumin Seeds', category: 'Spices', currentStock: 5, minimumThreshold: 2, unit: 'kg', unitCost: 320, supplier: 'MDH Spices', lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '20', name: 'Coriander Seeds', category: 'Spices', currentStock: 5, minimumThreshold: 2, unit: 'kg', unitCost: 220, supplier: 'MDH Spices', lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '21', name: 'Cardamom', category: 'Spices', currentStock: 2, minimumThreshold: 1, unit: 'kg', unitCost: 1200, supplier: 'Everest', lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '22', name: 'Red Chili Powder', category: 'Spices', currentStock: 4, minimumThreshold: 2, unit: 'kg', unitCost: 180, supplier: 'MDH Spices', lastRestocked: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Herbs
  { id: '23', name: 'Fresh Coriander', category: 'Herbs', currentStock: 10, minimumThreshold: 3, unit: 'bunches', unitCost: 25, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '24', name: 'Fresh Mint', category: 'Herbs', currentStock: 8, minimumThreshold: 2, unit: 'bunches', unitCost: 30, supplier: 'Local Vegetable Market', lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Beverages
  { id: '25', name: 'Tea Leaves (Assam)', category: 'Beverages', currentStock: 5, minimumThreshold: 2, unit: 'kg', unitCost: 420, supplier: 'Tata Tea', lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '26', name: 'Coffee Beans', category: 'Beverages', currentStock: 3, minimumThreshold: 1, unit: 'kg', unitCost: 850, supplier: 'Blue Tokai', lastRestocked: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), status: 'in_stock' },

  // Pantry & Others
  { id: '27', name: 'Basmati Rice', category: 'Pantry', currentStock: 15, minimumThreshold: 5, unit: 'kg', unitCost: 180, supplier: 'India Gate', lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '28', name: 'Tomato Puree', category: 'Pantry', currentStock: 20, minimumThreshold: 8, unit: 'bottles', unitCost: 85, supplier: 'Kissan Foods', lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '29', name: 'Almonds', category: 'Pantry', currentStock: 4, minimumThreshold: 2, unit: 'kg', unitCost: 950, supplier: 'California Almonds', lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'in_stock' },
  { id: '30', name: 'Pistachios', category: 'Pantry', currentStock: 3, minimumThreshold: 1, unit: 'kg', unitCost: 1200, supplier: 'Iran Pistachios', lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: 'in_stock' },
];

const categories = ['All', 'Bakery', 'Dairy', 'Pantry', 'Herbs', 'Spices', 'Meat', 'Vegetables', 'Beverages'];

const getStatusColor = (status: InventoryItem['status']) => {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'low_stock':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    case 'out_of_stock':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    case 'expired':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

const getStatusText = (status: InventoryItem['status']) => {
  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
    case 'expired':
      return 'Expired';
    default:
      return status;
  }
};

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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);

  // Filtering
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const getInventoryStats = () => {
    return {
      total: inventoryItems.length,
      inStock: inventoryItems.filter(item => item.status === 'in_stock').length,
      lowStock: inventoryItems.filter(item => item.status === 'low_stock').length,
      outOfStock: inventoryItems.filter(item => item.status === 'out_of_stock').length,
      totalValue: inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
    };
  };
  const stats = getInventoryStats();

  // Add Item
  const handleAddItem = (item: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: (Date.now() + Math.random()).toString(),
      lastRestocked: new Date(),
      status: getStatus(item.currentStock, item.minimumThreshold, item.expiryDate)
    };
    setInventoryItems(prev => [...prev, newItem]);
  };

  // Edit Item
  const handleEditItem = (updated: InventoryItem) => {
    setInventoryItems(prev => prev.map(item => item.id === updated.id ? { ...updated, status: getStatus(updated.currentStock, updated.minimumThreshold, updated.expiryDate) } : item));
    setEditItem(null);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  // Restock Item
  const handleRestock = (id: string, qty: number, expiryDate?: Date) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = item.currentStock + qty;
        return {
          ...item,
          currentStock: newStock,
          expiryDate: expiryDate || item.expiryDate,
          lastRestocked: new Date(),
          status: getStatus(newStock, item.minimumThreshold, expiryDate || item.expiryDate)
        };
      }
      return item;
    }));
    setRestockItem(null);
  };

  // Status Calculation
  function getStatus(currentStock: number, minimumThreshold: number, expiryDate?: Date): InventoryItem['status'] {
    if (expiryDate && expiryDate.getTime() < Date.now()) return 'expired';
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minimumThreshold) return 'low_stock';
    return 'in_stock';
  }

  // Export Inventory (CSV)
  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Current Stock', 'Min Threshold', 'Unit', 'Unit Cost', 'Supplier', 'Last Restocked', 'Expiry Date', 'Status'],
      ...inventoryItems.map(item => [
        item.name, item.category, item.currentStock, item.minimumThreshold, item.unit, item.unitCost, item.supplier, item.lastRestocked.toLocaleDateString(), item.expiryDate ? item.expiryDate.toLocaleDateString() : '', item.status
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Inventory (CSV)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1); // skip header
      const items: InventoryItem[] = lines.map((line, idx) => {
        const [name, category, currentStock, minimumThreshold, unit, unitCost, supplier, lastRestocked, expiryDate, status] = line.split(',');
        return {
          id: 'import-' + idx + '-' + Date.now(),
          name,
          category,
          currentStock: Number(currentStock),
          minimumThreshold: Number(minimumThreshold),
          unit,
          unitCost: Number(unitCost),
          supplier,
          lastRestocked: new Date(lastRestocked),
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          status: status as InventoryItem['status']
        };
      }).filter(item => item.name);
      setInventoryItems(prev => [...prev, ...items]);
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Track and manage your restaurant inventory</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex space-x-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-none cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Import</span>
                  <span className="sm:hidden">Import</span>
                </Button>
              </label>
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
            <AddInventoryDialog onAdd={handleAddItem} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(stats.lowStock > 0 || stats.outOfStock > 0) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.lowStock > 0 && (
                  <p className="text-sm text-orange-600">
                    <strong>{stats.lowStock}</strong> item{stats.lowStock === 1 ? '' : 's'} running low on stock
                  </p>
                )}
                {stats.outOfStock > 0 && (
                  <p className="text-sm text-red-600">
                    <strong>{stats.outOfStock}</strong> item{stats.outOfStock === 1 ? ' is' : 's are'} out of stock
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="bg-background hover:bg-muted">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg">
                <SelectItem value="all" className="bg-background hover:bg-muted">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock" className="bg-background hover:bg-muted">Low Stock</SelectItem>
                <SelectItem value="out_of_stock" className="bg-background hover:bg-muted">Out of Stock</SelectItem>
                <SelectItem value="expired" className="bg-background hover:bg-muted">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inventory Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <InventoryCard 
              key={item.id} 
              item={item} 
              onEdit={() => setEditItem(item)}
              onDelete={() => handleDeleteItem(item.id)}
              onRestock={() => setRestockItem(item)}
            />
          ))}
        </div>

        {/* Edit Dialog */}
        {editItem && (
          <EditInventoryDialog 
            item={editItem} 
            onSave={handleEditItem} 
            onCancel={() => setEditItem(null)}
          />
        )}
        {/* Restock Dialog */}
        {restockItem && (
          <RestockDialog 
            item={restockItem} 
            onRestock={handleRestock} 
            onCancel={() => setRestockItem(null)}
          />
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No inventory items found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
