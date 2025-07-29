import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrderMetrics } from '@/components/dashboard/OrderMetrics';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { TrendingUp, ShoppingCart, DollarSign, Star, AlertCircle, Package, RefreshCw } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/auth';

interface DashboardStats {
  totalOrders: number;
  totalMenuItems: number;
  totalInventoryItems: number;
  todayRevenue: number;
  pendingOrders: number;
}

const Dashboard = () => {
  const { getUser, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const user = getUser();

  const loadDashboardData = async () => {
    try {
      setError(null);
      const dashboardStats = await dataService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      
      // If unauthorized, logout user
      if (err instanceof Error && err.message.includes('unauthorized')) {
        logout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  useEffect(() => {
    if (isAuthenticated()) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Calculate percentage changes (placeholder logic)
  const getChangePercentage = (current: number, base: number = 100) => {
    const change = ((current - base) / base) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const getTrend = (current: number, base: number = 100) => {
    return current >= base ? 'up' : 'down';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.full_name || 'Admin'}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Restaurant overview and key metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Live</span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              ADMIN
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <KPICard
              title="Today's Revenue"
              value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
              change={getChangePercentage(stats.todayRevenue)}
              icon={DollarSign}
              trend={getTrend(stats.todayRevenue)}
            />
            <KPICard
              title="Pending Orders"
              value={stats.pendingOrders.toString()}
              change={getChangePercentage(stats.pendingOrders, 5)}
              icon={ShoppingCart}
              trend={getTrend(stats.pendingOrders, 5)}
            />
            <KPICard
              title="Total Orders"
              value={stats.totalOrders.toString()}
              change={getChangePercentage(stats.totalOrders, 50)}
              icon={Star}
              trend={getTrend(stats.totalOrders, 50)}
            />
            <KPICard
              title="Menu Items"
              value={stats.totalMenuItems.toString()}
              change={getChangePercentage(stats.totalMenuItems, 20)}
              icon={Package}
              trend={getTrend(stats.totalMenuItems, 20)}
            />
          </div>
        )}

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <OrderMetrics />
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 gap-6">
          <RecentOrders />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="w-full" asChild>
                <a href="/admin/orders">View All Orders</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/menu-management">Manage Menu</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/inventory">Check Inventory</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/analytics">View Analytics</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Logged in as:</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="font-medium">Role:</p>
                <p className="text-muted-foreground">Administrator</p>
              </div>
              <div>
                <p className="font-medium">Last updated:</p>
                <p className="text-muted-foreground">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
