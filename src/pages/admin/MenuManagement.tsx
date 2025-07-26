import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FaRupeeSign } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { menuData, type MenuItem as MenuDataItem, type MenuCategory } from '@/data/menuData';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock,
  Star,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  Save,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  halfKgPrice?: number;
  fullKgPrice?: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: string;
  calories: number;
  allergens: string[];
  ingredients: string[];
  customizations: string[];
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isPopular?: boolean;
  isSignature?: boolean;
  isBestSeller?: boolean;
  spiceLevel: 0 | 1 | 2;
  dietaryInfo?: string[];
  popularity: number;
  lastOrdered?: Date;
}

// Convert menu data to the management format
const convertMenuData = (): MenuItem[] => {
  const allItems: MenuItem[] = [];
  
  menuData.forEach(category => {
    category.items.forEach(item => {
      allItems.push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        halfKgPrice: item.halfKgPrice,
        fullKgPrice: item.fullKgPrice,
        category: category.name,
        image: item.image,
        isAvailable: true, // Default to available
        preparationTime: item.prepTime,
        calories: item.calories,
        allergens: item.allergens,
        ingredients: item.ingredients,
        customizations: item.customizations,
        isVegan: item.dietaryInfo?.includes('Vegan') || false,
        isVegetarian: true, // All items are vegetarian as per the menu
        isGlutenFree: !item.allergens.includes('gluten'),
        isPopular: item.isPopular,
        isSignature: item.isSignature,
        isBestSeller: item.isBestSeller,
        spiceLevel: item.spiceLevel,
        dietaryInfo: item.dietaryInfo,
        popularity: 75 + Math.floor(Math.random() * 25), // Random popularity between 75-100
        lastOrdered: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)) // Random last order within last hour
      });
    });
  });
  
  return allItems;
};

// Get categories from menu data
const categories = ['All', ...menuData.map(cat => cat.name)];

const MenuItemCard: React.FC<{ 
  item: MenuItem;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, isSelected: boolean) => void;
}> = ({ item, onToggleAvailability, onEdit, onDelete, isSelected = false, onSelect }) => {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      onDelete(item.id);
    }
  };

  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          {/* Selection Checkbox */}
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(item.id, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 flex-1">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
              <CardTitle className="text-base sm:text-lg truncate">{item.name}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {!item.isAvailable && (
                  <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <EyeOff className="w-3 h-3" />
                    <span className="text-xs">Unavailable</span>
                  </Badge>
                )}
                {item.isSignature && (
                  <Badge variant="default" className="text-xs bg-purple-600">Signature</Badge>
                )}
                {item.isBestSeller && (
                  <Badge variant="default" className="text-xs bg-orange-600">Best Seller</Badge>
                )}
                {item.isPopular && (
                  <Badge variant="default" className="text-xs bg-blue-600">Popular</Badge>
                )}
              </div>
            </div>
            <CardDescription className="text-sm line-clamp-2">{item.description}</CardDescription>
          </div>
          {item.image && (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-32 sm:w-16 sm:h-16 rounded-lg object-cover sm:ml-4 flex-shrink-0"
            />
          )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price and Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">₹</span>
            <span className="font-semibold text-lg">{item.price.toFixed(2)}</span>
            {item.halfKgPrice && (
              <span className="text-sm text-muted-foreground">/ Half Kg: ₹{item.halfKgPrice}</span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">{item.category}</Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{item.preparationTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Cal:</span>
            <span>{item.calories}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="truncate">{item.popularity}% popular</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground text-xs">Spice:</span>
            <span className="text-xs truncate">
              {item.spiceLevel === 0 ? 'None' : item.spiceLevel === 1 ? 'Mild' : 'Hot'}
            </span>
          </div>
        </div>

        {/* Dietary Info */}
        <div className="flex flex-wrap gap-1">
          {item.isVegan && <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Vegan</Badge>}
          {item.isVegetarian && <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Vegetarian</Badge>}
          {item.isGlutenFree && <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">Gluten-Free</Badge>}
        </div>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-sm font-medium">Allergens:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline" className="text-orange-600 border-orange-600 text-xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Preview */}
        {item.ingredients.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Key Ingredients:</span>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.ingredients.slice(0, 3).join(', ')}{item.ingredients.length > 3 ? '...' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={item.isAvailable} 
              onCheckedChange={(checked) => onToggleAvailability(item.id, checked)}
            />
            <Label className="text-sm">Available</Label>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 sm:flex-none text-xs sm:text-sm"
              onClick={() => onEdit(item)}
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 sm:flex-none text-red-600 hover:text-red-700 text-xs sm:text-sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddMenuItemDialog: React.FC<{ 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<MenuItem, 'id' | 'popularity' | 'lastOrdered'>) => void;
  editItem?: MenuItem;
}> = ({ isOpen, onClose, onSubmit, editItem }) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'popularity' | 'lastOrdered'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    isAvailable: true,
    preparationTime: '15 min',
    calories: 0,
    allergens: [],
    ingredients: [],
    customizations: [],
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isPopular: false,
    isSignature: false,
    isBestSeller: false,
    spiceLevel: 0,
    dietaryInfo: []
  });

  React.useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        originalPrice: editItem.originalPrice,
        halfKgPrice: editItem.halfKgPrice,
        fullKgPrice: editItem.fullKgPrice,
        category: editItem.category,
        image: editItem.image || '',
        isAvailable: editItem.isAvailable,
        preparationTime: editItem.preparationTime,
        calories: editItem.calories,
        allergens: editItem.allergens,
        ingredients: editItem.ingredients,
        customizations: editItem.customizations,
        isVegan: editItem.isVegan,
        isVegetarian: editItem.isVegetarian,
        isGlutenFree: editItem.isGlutenFree,
        isPopular: editItem.isPopular,
        isSignature: editItem.isSignature,
        isBestSeller: editItem.isBestSeller,
        spiceLevel: editItem.spiceLevel,
        dietaryInfo: editItem.dietaryInfo
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        isAvailable: true,
        preparationTime: '15 min',
        calories: 0,
        allergens: [],
        ingredients: [],
        customizations: [],
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        isPopular: false,
        isSignature: false,
        isBestSeller: false,
        spiceLevel: 0,
        dietaryInfo: [],
        image: ''
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen) 
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleIngredientChange = (value: string) => {
    const ingredients = value.split(',').map(i => i.trim()).filter(i => i.length > 0);
    setFormData(prev => ({ ...prev, ingredients }));
  };

  const handleCustomizationChange = (value: string) => {
    const customizations = value.split(',').map(c => c.trim()).filter(c => c.length > 0);
    setFormData(prev => ({ ...prev, customizations }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {editItem ? 'Update the menu item details' : 'Create a new menu item with all the necessary details'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Menu item name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg">
                    {categories.filter(c => c !== 'All').map((category) => (
                      <SelectItem key={category} value={category} className="bg-background hover:bg-muted">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the menu item..."
                className="resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="image">Item Image</Label>
              <div className="flex items-center space-x-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {formData.image ? (
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Menu item preview" 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Create object URL for preview
                      const imageUrl = URL.createObjectURL(file);
                      setFormData(prev => ({ ...prev, image: imageUrl }));
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Timing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing & Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="prep-time">Prep Time</Label>
                <Input 
                  id="prep-time" 
                  placeholder="15 min"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  placeholder="280"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            {/* Special Pricing for Cakes */}
            {formData.category === 'Artisan Cakes' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="half-kg-price">Half Kg Price (₹)</Label>
                  <Input 
                    id="half-kg-price" 
                    type="number" 
                    step="0.01"
                    value={formData.halfKgPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, halfKgPrice: parseFloat(e.target.value) || undefined }))}
                  />
                </div>
                <div>
                  <Label htmlFor="full-kg-price">Full Kg Price (₹)</Label>
                  <Input 
                    id="full-kg-price" 
                    type="number" 
                    step="0.01"
                    value={formData.fullKgPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullKgPrice: parseFloat(e.target.value) || undefined }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dietary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dietary Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vegan" 
                    checked={formData.isVegan}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegan: checked }))}
                  />
                  <Label htmlFor="vegan">Vegan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vegetarian" 
                    checked={formData.isVegetarian}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegetarian: checked }))}
                  />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="gluten-free" 
                    checked={formData.isGlutenFree}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isGlutenFree: checked }))}
                  />
                  <Label htmlFor="gluten-free">Gluten-Free</Label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="popular" 
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                  />
                  <Label htmlFor="popular">Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="signature" 
                    checked={formData.isSignature}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSignature: checked }))}
                  />
                  <Label htmlFor="signature">Signature Dish</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="bestseller" 
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestSeller: checked }))}
                  />
                  <Label htmlFor="bestseller">Best Seller</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="spice-level">Spice Level</Label>
              <Select 
                value={formData.spiceLevel.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, spiceLevel: parseInt(value) as 0 | 1 | 2 }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg">
                  <SelectItem value="0" className="bg-background hover:bg-muted">No Spice</SelectItem>
                  <SelectItem value="1" className="bg-background hover:bg-muted">Mild</SelectItem>
                  <SelectItem value="2" className="bg-background hover:bg-muted">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Allergens</h3>
            <div className="grid grid-cols-4 gap-2">
              {['gluten', 'dairy', 'nuts', 'garlic', 'onions', 'mushrooms'].map((allergen) => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Switch 
                    id={allergen}
                    checked={formData.allergens.includes(allergen)}
                    onCheckedChange={() => handleAllergenToggle(allergen)}
                  />
                  <Label htmlFor={allergen} className="text-sm capitalize">{allergen}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients and Customizations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Textarea 
                  id="ingredients" 
                  placeholder="Premium cocoa, Fresh cream, Belgian chocolate..."
                  value={formData.ingredients.join(', ')}
                  onChange={(e) => handleIngredientChange(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="customizations">Customizations (comma-separated)</Label>
                <Textarea 
                  id="customizations" 
                  placeholder="Extra cheese +₹30, Less spice, Extra portion +₹50..."
                  value={formData.customizations.join(', ')}
                  onChange={(e) => handleCustomizationChange(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {editItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MenuManagement = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(convertMenuData());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Check if we should open the add menu dialog from navigation state
  useEffect(() => {
    if (location.state?.openAddMenuDialog) {
      setShowAddDialog(true);
      // Clear the state to prevent reopening on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleToggleAvailability = (id: string, isAvailable: boolean) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable } : item
    ));
    const item = menuItems.find(i => i.id === id);
    if (item) {
      alert(`${item.name} is now ${isAvailable ? 'available' : 'unavailable'}`);
    }
  };

  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allFilteredIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(allFilteredIds);
    setShowBulkActions(true);
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const handleBulkToggleAvailability = (isAvailable: boolean) => {
    setMenuItems(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, isAvailable } : item
    ));
    alert(`${selectedItems.size} items updated to ${isAvailable ? 'available' : 'unavailable'}`);
    handleClearSelection();
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.size} items? This action cannot be undone.`)) {
      setMenuItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      alert(`${selectedItems.size} items deleted successfully`);
      handleClearSelection();
    }
  };

  const handleBulkCategoryChange = (newCategory: string) => {
    setMenuItems(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, category: newCategory } : item
    ));
    alert(`${selectedItems.size} items moved to ${newCategory} category`);
    handleClearSelection();
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    alert('Menu item deleted successfully');
  };

  const handleAddItem = (itemData: Omit<MenuItem, 'id' | 'popularity' | 'lastOrdered'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: Date.now().toString(),
      popularity: 0,
      lastOrdered: undefined
    };
    setMenuItems(prev => [newItem, ...prev]);
    alert(`${newItem.name} added successfully!`);
  };

  const handleUpdateItem = (itemData: Omit<MenuItem, 'id' | 'popularity' | 'lastOrdered'>) => {
    if (!editingItem) return;
    
    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...itemData }
        : item
    ));
    alert(`${itemData.name} updated successfully!`);
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setEditingItem(undefined);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && item.isAvailable) ||
                               (availabilityFilter === 'unavailable' && !item.isAvailable);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(item => item.isAvailable).length,
    unavailable: menuItems.filter(item => !item.isAvailable).length,
    avgPrice: menuItems.length > 0 ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length : 0
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Menu Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage your restaurant menu items and categories</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-600">
                {stats.available}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
              <EyeOff className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-red-600">
                {stats.unavailable}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
<FaRupeeSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                ₹{stats.avgPrice.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
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

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg">
                <SelectItem value="all" className="bg-background hover:bg-muted">All Items</SelectItem>
                <SelectItem value="available" className="bg-background hover:bg-muted">Available</SelectItem>
                <SelectItem value="unavailable" className="bg-background hover:bg-muted">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {showBulkActions && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedItems.size} item(s) selected
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkToggleAvailability(true)}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  Mark Available
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkToggleAvailability(false)}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  Mark Unavailable
                </Button>
                
                <Select onValueChange={(value) => value && handleBulkCategoryChange(value)}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Move to..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg">
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <SelectItem key={category} value={category} className="bg-background hover:bg-muted">{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Selection Controls */}
        {filteredItems.length > 0 && (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              Select All ({filteredItems.length})
            </Button>
            {selectedItems.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedItems.size} of {filteredItems.length} selected
              </span>
            )}
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onToggleAvailability={handleToggleAvailability}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              isSelected={selectedItems.has(item.id)}
              onSelect={handleSelectItem}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No menu items found matching your criteria.</p>
          </div>
        )}
        
        {/* Add/Edit Dialog */}
        <AddMenuItemDialog
          isOpen={showAddDialog}
          onClose={handleDialogClose}
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          editItem={editingItem}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuManagement;
