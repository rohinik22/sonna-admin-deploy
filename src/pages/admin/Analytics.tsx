import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Clock,
  Star,
  Target,
  Calendar,
  Download,
  AlertTriangle
} from 'lucide-react';

// Mock data for analytics
const revenueData = [
  { name: 'Mon', revenue: 2400, orders: 24 },
  { name: 'Tue', revenue: 1398, orders: 18 },
  { name: 'Wed', revenue: 9800, orders: 42 },
  { name: 'Thu', revenue: 3908, orders: 31 },
  { name: 'Fri', revenue: 4800, orders: 38 },
  { name: 'Sat', revenue: 3800, orders: 35 },
  { name: 'Sun', revenue: 4300, orders: 41 },
];

const categoryData = [
  { name: 'Pizza', value: 40, color: '#ff6b6b' },
  { name: 'Salads', value: 25, color: '#4ecdc4' },
  { name: 'Desserts', value: 15, color: '#45b7d1' },
  { name: 'Beverages', value: 12, color: '#96ceb4' },
  { name: 'Other', value: 8, color: '#ffeaa7' },
];

const customerData = [
  { month: 'Jan', newCustomers: 45, returningCustomers: 120 },
  { month: 'Feb', newCustomers: 52, returningCustomers: 135 },
  { month: 'Mar', newCustomers: 48, returningCustomers: 142 },
  { month: 'Apr', newCustomers: 61, returningCustomers: 158 },
  { month: 'May', newCustomers: 55, returningCustomers: 165 },
  { month: 'Jun', newCustomers: 67, returningCustomers: 178 },
];

const performanceData = [
  { time: '09:00', orders: 12, avgPrepTime: 15 },
  { time: '10:00', orders: 8, avgPrepTime: 12 },
  { time: '11:00', orders: 15, avgPrepTime: 18 },
  { time: '12:00', orders: 42, avgPrepTime: 22 },
  { time: '13:00', orders: 38, avgPrepTime: 25 },
  { time: '14:00', orders: 28, avgPrepTime: 20 },
  { time: '15:00', orders: 18, avgPrepTime: 16 },
  { time: '16:00', orders: 22, avgPrepTime: 14 },
  { time: '17:00', orders: 35, avgPrepTime: 19 },
  { time: '18:00', orders: 45, avgPrepTime: 23 },
  { time: '19:00', orders: 52, avgPrepTime: 26 },
  { time: '20:00', orders: 38, avgPrepTime: 21 },
  { time: '21:00', orders: 25, avgPrepTime: 18 },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <DashboardLayout>
      <div className="flex-1 h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-6 p-6 pb-8">
            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b pb-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Comprehensive business insights and performance metrics</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg">
                      <SelectItem value="7days" className="bg-background hover:bg-muted">Last 7 days</SelectItem>
                      <SelectItem value="30days" className="bg-background hover:bg-muted">Last 30 days</SelectItem>
                      <SelectItem value="90days" className="bg-background hover:bg-muted">Last 90 days</SelectItem>
                      <SelectItem value="1year" className="bg-background hover:bg-muted">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export Report</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Metrics - Mobile Responsive Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Key Performance Indicators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹4,52,318</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        +20.1%
                      </Badge>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,350</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        +12.5%
                      </Badge>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹385</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        -2.3%
                      </Badge>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8/5</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        +0.2
                      </Badge>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Analytics Tabs - Clean & Elegant Design */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-foreground">Detailed Analytics</h2>
              <Tabs defaultValue="revenue" className="w-full">
                {/* Clean Tab Navigation */}
                <div className="mb-8">
                  <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100 rounded-lg">
                    <TabsTrigger 
                      value="revenue" 
                      className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Revenue
                    </TabsTrigger>
                    <TabsTrigger 
                      value="customers" 
                      className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Customers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="menu" 
                      className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Menu
                    </TabsTrigger>
                    <TabsTrigger 
                      value="operations" 
                      className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Operations
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Revenue Tab Content */}
                <TabsContent value="revenue" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Daily Revenue
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Revenue and order count for the past week
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="name" className="text-muted-foreground" />
                              <YAxis className="text-muted-foreground" />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                        <p className="font-semibold text-gray-900">{label}</p>
                                        <p className="text-green-600">
                                          Revenue: ₹{payload[0].value?.toLocaleString()}
                                        </p>
                                        <p className="text-blue-600">
                                          Orders: {payload[1]?.value}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#16a34a" 
                                fill="#16a34a" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Revenue by Category
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Distribution of revenue across menu categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[280px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="45%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                        <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
                                        <p className="text-blue-600">{payload[0].value}% of total revenue</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                          {categoryData.map((category) => (
                            <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-700">{category.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Customers Tab Content */}
                <TabsContent value="customers" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        Customer Growth Analysis
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Track new vs returning customers over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={customerData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="month" className="text-muted-foreground" />
                            <YAxis className="text-muted-foreground" />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                      <p className="font-semibold text-gray-900">{label}</p>
                                      <p className="text-blue-600">
                                        New Customers: {payload[0].value}
                                      </p>
                                      <p className="text-green-600">
                                        Returning Customers: {payload[1].value}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="newCustomers" fill="#3b82f6" name="New Customers" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="returningCustomers" fill="#22c55e" name="Returning Customers" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Menu Tab Content */}
                <TabsContent value="menu" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-600" />
                          Top Performing Items
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Most popular menu items ranked by orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[450px] overflow-y-auto">
                          {[
                            { name: 'Margherita Pizza', orders: 234, revenue: 4329, trend: '+15%' },
                            { name: 'Caesar Salad', orders: 189, revenue: 2268, trend: '+8%' },
                            { name: 'Pepperoni Pizza', orders: 167, revenue: 3340, trend: '+12%' },
                            { name: 'Grilled Salmon', orders: 98, revenue: 2352, trend: '-3%' },
                            { name: 'Chocolate Cake', orders: 87, revenue: 783, trend: '+22%' },
                            { name: 'Chicken Alfredo', orders: 76, revenue: 1824, trend: '+7%' },
                            { name: 'Greek Salad', orders: 65, revenue: 975, trend: '+18%' },
                            { name: 'BBQ Ribs', orders: 54, revenue: 1620, trend: '-5%' },
                          ].map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.orders} orders • ₹{item.revenue.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <Badge 
                                variant={item.trend.startsWith('+') ? 'default' : 'destructive'}
                                className="font-semibold"
                              >
                                {item.trend}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          Performance Alerts
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Items requiring immediate attention
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[450px] overflow-y-auto">
                          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-red-800">Underperforming Items</h4>
                                <p className="text-sm text-red-700 mt-1">3 items showing declining trends</p>
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs text-red-600">• Mushroom Risotto (-15%)</p>
                                  <p className="text-xs text-red-600">• Fish Tacos (-8%)</p>
                                  <p className="text-xs text-red-600">• Quinoa Bowl (-12%)</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                Review
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-orange-800">Low Stock Alert</h4>
                                <p className="text-sm text-orange-700 mt-1">5 items need immediate restocking</p>
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs text-orange-600">• Truffle Oil (2 bottles remaining)</p>
                                  <p className="text-xs text-orange-600">• Fresh Salmon (5kg remaining)</p>
                                  <p className="text-xs text-orange-600">• Mozzarella (3kg remaining)</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                Reorder
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-green-800">Top Rated Items</h4>
                                <p className="text-sm text-green-700 mt-1">7 items with exceptional ratings</p>
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs text-green-600">• Chocolate Lava Cake (4.9★)</p>
                                  <p className="text-xs text-green-600">• Beef Wellington (4.8★)</p>
                                  <p className="text-xs text-green-600">• Caesar Salad (4.8★)</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                Promote
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Operations Tab Content */}
                <TabsContent value="operations" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        Hourly Performance Dashboard
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Real-time analysis of order volume and kitchen performance throughout the day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="time" className="text-muted-foreground" />
                            <YAxis yAxisId="left" className="text-muted-foreground" />
                            <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                      <p className="font-semibold text-gray-900">{label}</p>
                                      <p className="text-blue-600 font-medium">
                                        Orders: {payload[0].value}
                                      </p>
                                      <p className="text-orange-600 font-medium">
                                        Avg Prep Time: {payload[1].value} minutes
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="orders" 
                              stroke="#3b82f6" 
                              strokeWidth={3}
                              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, fill: '#3b82f6' }}
                              name="Orders"
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="avgPrepTime" 
                              stroke="#f59e0b" 
                              strokeWidth={3}
                              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, fill: '#f59e0b' }}
                              name="Preparation Time"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
