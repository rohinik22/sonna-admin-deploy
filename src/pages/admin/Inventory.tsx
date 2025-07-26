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
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  TrendingUp,
  Edit3,
  Trash2,
  Download,
  Upload,
  Clock
} from 'lucide-react';

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

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Wheat Flour',
    category: 'Bakery',
    currentStock: 15,
    minimumThreshold: 20,
    unit: 'kg',
    unitCost: 45.50,
    supplier: 'Karnataka Flour Mills',
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    status: 'low_stock'
  },
  {
    id: '2',
    name: 'Paneer',
    category: 'Dairy',
    currentStock: 8,
    minimumThreshold: 10,
    unit: 'kg',
    unitCost: 320.00,
    supplier: 'Amul Dairy',
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'Tomato Puree',
    category: 'Pantry',
    currentStock: 25,
    minimumThreshold: 15,
    unit: 'bottles',
    unitCost: 85.75,
    supplier: 'Kissan Foods',
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'in_stock'
  },
  {
    id: '4',
    name: 'Fresh Coriander',
    category: 'Herbs',
    currentStock: 0,
    minimumThreshold: 5,
    unit: 'bunches',
    unitCost: 25.00,
    supplier: 'Local Vegetable Market',
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'out_of_stock'
  },
  {
    id: '5',
    name: 'Basmati Rice',
    category: 'Pantry',
    currentStock: 12,
    minimumThreshold: 8,
    unit: 'kg',
    unitCost: 180.50,
    supplier: 'India Gate',
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'in_stock'
  },
  {
    id: '6',
    name: 'Garam Masala',
    category: 'Spices',
    currentStock: 3,
    minimumThreshold: 5,
    unit: 'packets',
    unitCost: 65.00,
    supplier: 'MDH Spices',
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'low_stock'
  }
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

const InventoryCard: React.FC<{ item: InventoryItem }> = ({ item }) => {
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
        {/* Stock Information */}
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

        {/* Financial Information */}
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

        {/* Alerts */}
        <div className="space-y-2">
          {item.currentStock <= item.minimumThreshold && (
            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700">
                Stock below minimum threshold
              </span>
            </div>
          )}
          
          {daysUntilExpiry !== null && daysUntilExpiry <= 3 && (
            <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">
                {daysUntilExpiry <= 0 ? 'Expired' : `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`}
              </span>
            </div>
          )}
        </div>

        {/* Last Restocked */}
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Last restocked: {item.lastRestocked.toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            Restock
          </Button>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddInventoryDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="Enter item name" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg">
                  {categories.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()} className="bg-background hover:bg-muted">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input id="current-stock" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="min-threshold">Min Threshold</Label>
              <Input id="min-threshold" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" placeholder="kg, bottles, etc." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit-cost">Unit Cost ($)</Label>
              <Input id="unit-cost" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="Supplier name" />
            </div>
          </div>

          <div>
            <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
            <Input id="expiry-date" type="date" />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes..." rows={3} />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Add Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getInventoryStats = () => {
    return {
      total: mockInventoryItems.length,
      inStock: mockInventoryItems.filter(item => item.status === 'in_stock').length,
      lowStock: mockInventoryItems.filter(item => item.status === 'low_stock').length,
      outOfStock: mockInventoryItems.filter(item => item.status === 'out_of_stock').length,
      totalValue: mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
    };
  };

  const stats = getInventoryStats();

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
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Import</span>
                <span className="sm:hidden">Import</span>
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
            <AddInventoryDialog />
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
              <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
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
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>

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
