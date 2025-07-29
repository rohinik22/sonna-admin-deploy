import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { settingsAPI } from '@/lib/api';
import { Settings, Store, Globe, Clock, Mail, Phone, MapPin, Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurant Settings
  const [restaurant, setRestaurant] = useState({
    name: '', description: '', address: '', phone: '', email: '', website: '', timezone: 'Asia/Kolkata', currency: 'INR',
    operatingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '22:00', closed: false }
    }
  });

  // System Settings
  const [system, setSystem] = useState({
    maintenanceMode: false, onlineOrdering: true, loyaltyProgram: true, autoBackup: true, backupFrequency: 'daily', maxOrdersPerDay: 500, orderTimeout: 30, defaultTax: 18, deliveryRadius: 10
  });

  // Load settings from database
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [allSettings, businessHours] = await Promise.all([
          settingsAPI.getAll(),
          settingsAPI.getBusinessHours()
        ]);
        setRestaurant({
          name: allSettings.restaurant_name || '',
          description: allSettings.restaurant_description || '',
          address: allSettings.restaurant_address || '',
          phone: allSettings.restaurant_phone || '',
          email: allSettings.restaurant_email || '',
          website: allSettings.restaurant_website || '',
          timezone: allSettings.timezone || 'Asia/Kolkata',
          currency: allSettings.currency || 'INR',
          operatingHours: businessHours
        });
        setSystem({
          maintenanceMode: allSettings.maintenance_mode || false,
          onlineOrdering: allSettings.online_ordering || true,
          loyaltyProgram: allSettings.loyalty_program || true,
          autoBackup: allSettings.auto_backup || true,
          backupFrequency: allSettings.backup_frequency || 'daily',
          maxOrdersPerDay: allSettings.max_orders_per_day || 500,
          orderTimeout: allSettings.order_timeout || 30,
          defaultTax: allSettings.default_tax || 18,
          deliveryRadius: allSettings.delivery_radius || 10
        });
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSaveSettings = async (section: string) => {
    try {
      if (section === 'restaurant') {
        await settingsAPI.update({
          restaurant_name: restaurant.name,
          restaurant_description: restaurant.description,
          restaurant_address: restaurant.address,
          restaurant_phone: restaurant.phone,
          restaurant_email: restaurant.email,
          restaurant_website: restaurant.website,
          timezone: restaurant.timezone,
          currency: restaurant.currency
        });
        await settingsAPI.updateBusinessHours(restaurant.operatingHours);
      } else if (section === 'system') {
        await settingsAPI.update({
          maintenance_mode: system.maintenanceMode,
          online_ordering: system.onlineOrdering,
          loyalty_program: system.loyaltyProgram,
          auto_backup: system.autoBackup,
          backup_frequency: system.backupFrequency,
          max_orders_per_day: system.maxOrdersPerDay,
          order_timeout: system.orderTimeout,
          default_tax: system.defaultTax,
          delivery_radius: system.deliveryRadius
        });
      }
      toast({
        title: "Settings Saved",
        description: `${section} settings have been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Export Complete",
        description: "Your data has been exported and download will start shortly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataImport = () => {
    toast({
      title: "Import Started",
      description: "Please select a file to import your data.",
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      ) : (
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Configure your restaurant settings, system preferences, and operational parameters.
          </p>
        </div>

        <Tabs defaultValue="restaurant" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="restaurant" className="text-sm">Restaurant</TabsTrigger>
            <TabsTrigger value="system" className="text-sm">System</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant" className="mt-0">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Store className="w-5 h-5" />
                    Restaurant Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your restaurant that appears on orders and receipts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input
                        id="restaurant-name"
                        value={restaurant.name}
                        onChange={(e) => setRestaurant(prev => ({ ...prev, name: e.target.value }))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restaurant-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="restaurant-phone"
                          value={restaurant.phone}
                          onChange={(e) => setRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restaurant-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="restaurant-email"
                          type="email"
                          value={restaurant.email}
                          onChange={(e) => setRestaurant(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restaurant-website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="restaurant-website"
                          value={restaurant.website}
                          onChange={(e) => setRestaurant(prev => ({ ...prev, website: e.target.value }))}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="restaurant-address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="restaurant-address"
                          value={restaurant.address}
                          onChange={(e) => setRestaurant(prev => ({ ...prev, address: e.target.value }))}
                          className="pl-10 min-h-[80px]"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="restaurant-description">Description</Label>
                      <Textarea
                        id="restaurant-description"
                        value={restaurant.description}
                        onChange={(e) => setRestaurant(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[100px]"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 pt-4 border-t">
                    <Button onClick={() => handleSaveSettings('Restaurant')} disabled={isLoading} className="min-w-[140px]">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Restaurant Info'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="w-5 h-5" />
                    Operating Hours
                  </CardTitle>
                  <CardDescription>
                    Set your restaurant's operating hours for each day of the week.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {days.map((day) => (
                      <div key={day} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium capitalize">{day}</div>
                          <Switch
                            checked={!restaurant.operatingHours[day as keyof typeof restaurant.operatingHours].closed}
                            onCheckedChange={(checked) => {
                              setRestaurant(prev => ({
                                ...prev,
                                operatingHours: {
                                  ...prev.operatingHours,
                                  [day]: { ...prev.operatingHours[day as keyof typeof prev.operatingHours], closed: !checked }
                                }
                              }));
                            }}
                          />
                        </div>
                        
                        {!restaurant.operatingHours[day as keyof typeof restaurant.operatingHours].closed ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Input
                              type="time"
                              value={restaurant.operatingHours[day as keyof typeof restaurant.operatingHours].open}
                              onChange={(e) => {
                                setRestaurant(prev => ({
                                  ...prev,
                                  operatingHours: {
                                    ...prev.operatingHours,
                                    [day]: { ...prev.operatingHours[day as keyof typeof prev.operatingHours], open: e.target.value }
                                  }
                                }));
                              }}
                              className="w-24 h-8 text-xs"
                            />
                            <span className="text-muted-foreground text-xs">to</span>
                            <Input
                              type="time"
                              value={restaurant.operatingHours[day as keyof typeof restaurant.operatingHours].close}
                              onChange={(e) => {
                                setRestaurant(prev => ({
                                  ...prev,
                                  operatingHours: {
                                    ...prev.operatingHours,
                                    [day]: { ...prev.operatingHours[day as keyof typeof prev.operatingHours], close: e.target.value }
                                  }
                                }));
                              }}
                              className="w-24 h-8 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Closed</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6 pt-4 border-t">
                    <Button onClick={() => handleSaveSettings('Operating Hours')} disabled={isLoading} className="min-w-[140px]">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Hours'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and operational parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {/* Toggle Settings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Maintenance Mode</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable to temporarily disable customer access
                        </p>
                      </div>
                      <Switch
                        checked={system.maintenanceMode}
                        onCheckedChange={(checked) => setSystem(prev => ({ ...prev, maintenanceMode: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Online Ordering</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow customers to place orders online
                        </p>
                      </div>
                      <Switch
                        checked={system.onlineOrdering}
                        onCheckedChange={(checked) => setSystem(prev => ({ ...prev, onlineOrdering: checked }))}
                      />
                    </div>

                    

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Loyalty Program</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable customer loyalty rewards
                        </p>
                      </div>
                      <Switch
                        checked={system.loyaltyProgram}
                        onCheckedChange={(checked) => setSystem(prev => ({ ...prev, loyaltyProgram: checked }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Numeric Settings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="max-orders">Max Orders Per Day</Label>
                      <Input
                        id="max-orders"
                        type="number"
                        value={system.maxOrdersPerDay}
                        onChange={(e) => setSystem(prev => ({ ...prev, maxOrdersPerDay: parseInt(e.target.value) }))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-timeout">Order Timeout (minutes)</Label>
                      <Input
                        id="order-timeout"
                        type="number"
                        value={system.orderTimeout}
                        onChange={(e) => setSystem(prev => ({ ...prev, orderTimeout: parseInt(e.target.value) }))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
                      <Input
                        id="default-tax"
                        type="number"
                        value={system.defaultTax}
                        onChange={(e) => setSystem(prev => ({ ...prev, defaultTax: parseFloat(e.target.value) }))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                      <Input
                        id="delivery-radius"
                        type="number"
                        value={system.deliveryRadius}
                        onChange={(e) => setSystem(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => handleSaveSettings('System')} disabled={isLoading} className="min-w-[140px]">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save System Settings'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSettings;
