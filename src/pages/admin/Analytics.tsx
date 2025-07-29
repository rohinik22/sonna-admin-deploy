import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Clock, Star, Target, Calendar, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [kpiMetrics, setKpiMetrics] = useState<any>({});
  const [topItems, setTopItems] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setError(null);
      setLoading(true);
      const [revenueResponse, categoryResponse, customerResponse, performanceResponse, kpiResponse, topItemsResponse, alertsResponse] = await Promise.all([
        analyticsAPI.getRevenueData(dateRange),
        analyticsAPI.getCategoryData(dateRange),
        analyticsAPI.getCustomerData(dateRange),
        analyticsAPI.getPerformanceData(dateRange),
        analyticsAPI.getKPIMetrics(dateRange),
        analyticsAPI.getTopItems(dateRange),
        analyticsAPI.getAlerts()
      ]);

      setRevenueData(revenueResponse || []);
      setCategoryData(categoryResponse || []);
      setCustomerData(customerResponse || []);
      setPerformanceData(performanceResponse || []);
      setKpiMetrics(kpiResponse || {});
      setTopItems(topItemsResponse || []);
      setAlerts(alertsResponse || []);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-6 p-6 pb-8">
            {/* Header */}
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

            {/* Key Metrics */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Key Performance Indicators</h2>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading analytics...</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{kpiMetrics.totalRevenue?.toLocaleString() || '0'}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {(kpiMetrics.revenueGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <Badge variant="outline" className={`${(kpiMetrics.revenueGrowth || 0) >= 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                          {(kpiMetrics.revenueGrowth || 0) >= 0 ? '+' : ''}{kpiMetrics.revenueGrowth || 0}%
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
                      <div className="text-2xl font-bold">{kpiMetrics.totalOrders?.toLocaleString() || '0'}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {(kpiMetrics.ordersGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <Badge variant="outline" className={`${(kpiMetrics.ordersGrowth || 0) >= 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                          {(kpiMetrics.ordersGrowth || 0) >= 0 ? '+' : ''}{kpiMetrics.ordersGrowth || 0}%
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
                      <div className="text-2xl font-bold">₹{kpiMetrics.avgOrderValue || '0'}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {(kpiMetrics.aovGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <Badge variant="outline" className={`${(kpiMetrics.aovGrowth || 0) >= 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                          {(kpiMetrics.aovGrowth || 0) >= 0 ? '+' : ''}{kpiMetrics.aovGrowth || 0}%
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
                      <div className="text-2xl font-bold">{kpiMetrics.satisfaction || '0'}/5</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {(kpiMetrics.satisfactionGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <Badge variant="outline" className={`${(kpiMetrics.satisfactionGrowth || 0) >= 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                          {(kpiMetrics.satisfactionGrowth || 0) >= 0 ? '+' : ''}{kpiMetrics.satisfactionGrowth || 0}
                        </Badge>
                        <span className="text-xs text-muted-foreground">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Analytics Tabs */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-foreground">Detailed Analytics</h2>
              <Tabs defaultValue="revenue" className="w-full">
                <div className="mb-8">
                  <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100 rounded-lg">
                    <TabsTrigger value="revenue" className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                      Revenue
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="menu" className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                      Menu
                    </TabsTrigger>
                    <TabsTrigger value="operations" className="text-sm font-medium h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
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
                              <Tooltip content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                      <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
                                      <p className="text-blue-600">{payload[0].value}% of total revenue</p>
                                    </div>
                                  );
                                }
                                return null;
                              }} />
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
                            <Tooltip content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                    <p className="font-semibold text-gray-900">{label}</p>
                                    <p className="text-blue-600">New Customers: {payload[0].value}</p>
                                    <p className="text-green-600">Returning Customers: {payload[1].value}</p>
                                  </div>
                                );
                              }
                              return null;
                            }} />
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
                          {topItems && topItems.map((item, index) => (
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
                          {alerts && alerts.map((alert, index) => (
                            <div key={index} className={`p-4 border-l-4 rounded-lg ${
                              alert.type === 'danger' ? 'bg-red-50 border-red-400' :
                              alert.type === 'warning' ? 'bg-orange-50 border-orange-400' :
                              'bg-green-50 border-green-400'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`font-semibold ${
                                    alert.type === 'danger' ? 'text-red-800' :
                                    alert.type === 'warning' ? 'text-orange-800' :
                                    'text-green-800'
                                  }`}>{alert.title}</h4>
                                  <p className={`text-sm mt-1 ${
                                    alert.type === 'danger' ? 'text-red-700' :
                                    alert.type === 'warning' ? 'text-orange-700' :
                                    'text-green-700'
                                  }`}>{alert.description}</p>
                                  {alert.items && (
                                    <div className="mt-3 space-y-1">
                                      {alert.items.map((item, itemIndex) => (
                                        <p key={itemIndex} className={`text-xs ${
                                          alert.type === 'danger' ? 'text-red-600' :
                                          alert.type === 'warning' ? 'text-orange-600' :
                                          'text-green-600'
                                        }`}>• {item}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <Button variant="outline" size="sm" className="ml-4">
                                  {alert.action || 'Review'}
                                </Button>
                              </div>
                            </div>
                          ))}
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
                            <Tooltip content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                    <p className="font-semibold text-gray-900">{label}</p>
                                    <p className="text-blue-600 font-medium">Orders: {payload[0].value}</p>
                                    <p className="text-orange-600 font-medium">Avg Prep Time: {payload[1].value} minutes</p>
                                  </div>
                                );
                              }
                              return null;
                            }} />
                            <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} name="Orders" />
                            <Line yAxisId="right" type="monotone" dataKey="avgPrepTime" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#f59e0b' }} name="Preparation Time" />
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

