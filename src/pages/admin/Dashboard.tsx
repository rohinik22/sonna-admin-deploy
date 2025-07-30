import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrderMetrics } from '@/components/dashboard/OrderMetrics';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { orderService } from '@/lib/orderService';
import { userService } from '@/lib/userService';
import { promotionService } from '@/lib/promotionService';
import { TrendingUp, ShoppingCart, DollarSign, Star } from 'lucide-react';
import { Activity, Zap, Target, ArrowRight, RefreshCw } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date()), [isLive, setIsLive] = useState(true), [orders, setOrders] = useState([]), [stats, setStats] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [statsData, ordersData] = await Promise.all([
        dashboardAPI.getStats(), dashboardAPI.getLiveOrders()
      ]);
      setStats(statsData.stats || []);
      setOrders(ordersData.orders || []);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = () => (setLoading(true), loadData());
  const getStatusColor = (status) => ({
    preparing: 'bg-yellow-100 text-yellow-700',
    cooking: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-blue-100 text-blue-700'
  }[status] || 'bg-gray-100 text-gray-700');

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Operations Dashboard</h1>
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs font-medium">{isLive ? 'Live' : 'Offline'}</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Real-time restaurant operations • {currentTime.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
              <Activity className="w-4 h-4 mr-2" />{isLive ? 'Pause Live' : 'Resume Live'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
          </div>
        </div>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {stat.prefix}{typeof stat.value === 'number' && stat.value > 1000 ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Target className="w-4 h-4 mr-1" />
                    {stat.prefix}{typeof stat.target === 'number' && stat.target > 1000 ? stat.target.toLocaleString() : stat.target}{stat.suffix}
                  </div>
                </div>
                <Progress value={(stat.value / stat.target) * 100} className="h-2" />
                <div className="mt-2 text-xs text-muted-foreground">{Math.round((stat.value / stat.target) * 100)}% of target</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Live Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />Live Orders
            </CardTitle>
            <CardDescription>Real-time order status and kitchen workflow</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && orders.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span>Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No active orders</div>
            ) : (
              <>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.customer}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <div className="text-right">
                          <div className="font-medium">{order.total}</div>
                          <div className="text-xs text-muted-foreground">{order.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <ArrowRight className="w-4 h-4 mr-2" />View All Orders
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
