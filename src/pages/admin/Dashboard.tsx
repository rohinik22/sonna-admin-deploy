import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrderMetrics } from '@/components/dashboard/OrderMetrics';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { TrendingUp, ShoppingCart, DollarSign, Star } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Restaurant overview and key metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Live</span>
            </Badge>
          </div>
        </div>

        {/* Dashboard Cards / Data Views - As specified in guide.md */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <KPICard
            title="Today's Revenue"
            value="₹2,48,600"
            change="+12%"
            icon={DollarSign}
            trend="up"
          />
          <KPICard
            title="Orders Today"
            value="47"
            change="+8%"
            icon={ShoppingCart}
            trend="up"
          />
          <KPICard
            title="Avg Order Value"
            value="₹325"
            change="+5%"
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Customer Satisfaction"
            value="4.8/5"
            change="+0.2"
            icon={Star}
            trend="up"
          />
        </div>

        {/* Charts, Tables, Forms - As specified in guide.md */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <Card className="w-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Revenue Overview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Daily revenue for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <RevenueChart />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Order Metrics</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Order distribution and performance</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <OrderMetrics />
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent className="pb-4 sm:pb-6">
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
