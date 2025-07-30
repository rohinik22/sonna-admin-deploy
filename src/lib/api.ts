const API_BASE = '/api/supabase';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
      'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
      ...options.headers 
    },
    ...options,
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

export const dashboardAPI = {
  getStats: () => apiRequest('/rest/v1/dashboard_stats?select=*'),
  getLiveOrders: () => apiRequest('/rest/v1/orders?select=*&status=in.(pending,preparing,cooking)&order=created_at.desc&limit=10'),
};

export const analyticsAPI = {
  getOverview: () => apiRequest('/rest/v1/analytics_overview?select=*'),
  getCharts: () => apiRequest('/rest/v1/analytics_charts?select=*'),
  getRevenueData: (dateRange: string) => apiRequest(`/rest/v1/revenue_analytics?select=*&date_range=eq.${dateRange}`),
  getCategoryData: (dateRange: string) => apiRequest(`/rest/v1/category_analytics?select=*&date_range=eq.${dateRange}`),
  getCustomerData: (dateRange: string) => apiRequest(`/rest/v1/customer_analytics?select=*&date_range=eq.${dateRange}`),
  getPerformanceData: (dateRange: string) => apiRequest(`/rest/v1/performance_analytics?select=*&date_range=eq.${dateRange}`),
  getKPIMetrics: (dateRange: string) => apiRequest(`/rest/v1/kpi_metrics?select=*&date_range=eq.${dateRange}`),
  getTopItems: (dateRange: string) => apiRequest(`/rest/v1/top_menu_items?select=*&date_range=eq.${dateRange}&order=order_count.desc&limit=10`),
  getAlerts: () => apiRequest('/rest/v1/performance_alerts?select=*&is_active=eq.true'),
};

export const ordersAPI = {
  getAll: () => apiRequest('/rest/v1/orders?select=*,customer:customers(*),items:order_items(*,menu_item:menu_items(*))&order=created_at.desc'),
  getById: (id: string) => apiRequest(`/rest/v1/orders?select=*,customer:customers(*),items:order_items(*,menu_item:menu_items(*))&id=eq.${id}`),
  update: (id: string, data: any) => apiRequest(`/rest/v1/orders?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) => apiRequest(`/rest/v1/orders?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status, updated_at: new Date().toISOString() }) }),
};

export const menuAPI = {
  getItems: () => apiRequest('/rest/v1/menu_items?select=*,category:menu_categories(*)&order=category_id,name'),
  addItem: (item: any) => apiRequest('/rest/v1/menu_items', { method: 'POST', body: JSON.stringify(item) }),
  updateItem: (id: string, item: any) => apiRequest(`/rest/v1/menu_items?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(item) }),
  deleteItem: (id: string) => apiRequest(`/rest/v1/menu_items?id=eq.${id}`, { method: 'DELETE' }),
  getCategories: () => apiRequest('/rest/v1/menu_categories?select=*&order=name'),
};

export const kitchenAPI = {
  getQueue: () => apiRequest('/rest/v1/kitchen_queue?select=*,order:orders(*,customer:customers(*),items:order_items(*,menu_item:menu_items(*)))&order=created_at.asc'),
  updateStatus: (orderId: string, status: string) => apiRequest(`/rest/v1/orders?id=eq.${orderId}`, { method: 'PATCH', body: JSON.stringify({ status, updated_at: new Date().toISOString() }) }),
  toggleItemComplete: (orderId: string, itemId: string) => apiRequest(`/rest/v1/order_items?order_id=eq.${orderId}&id=eq.${itemId}`, { method: 'PATCH', body: JSON.stringify({ is_completed: true, completed_at: new Date().toISOString() }) }),
  getStations: () => apiRequest('/rest/v1/kitchen_stations?select=*&is_active=eq.true'),
};

export const inventoryAPI = {
  getItems: () => apiRequest('/rest/v1/inventory_items?select=*,supplier:suppliers(*)&order=name'),
  updateStock: (id: string, quantity: number) => apiRequest(`/rest/v1/inventory_items?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ current_stock: quantity, last_updated: new Date().toISOString() }) }),
  addItem: (item: any) => apiRequest('/rest/v1/inventory_items', { method: 'POST', body: JSON.stringify({ ...item, created_at: new Date().toISOString() }) }),
  deleteItem: (id: string) => apiRequest(`/rest/v1/inventory_items?id=eq.${id}`, { method: 'DELETE' }),
  getLowStock: () => apiRequest('/rest/v1/inventory_items?select=*&current_stock=lt.minimum_threshold'),
  getSuppliers: () => apiRequest('/rest/v1/suppliers?select=*&is_active=eq.true&order=name'),
};

export const settingsAPI = {
  getAll: () => apiRequest('/rest/v1/restaurant_settings?select=*'),
  update: (settings: any) => apiRequest('/rest/v1/restaurant_settings', { method: 'PATCH', body: JSON.stringify({ ...settings, updated_at: new Date().toISOString() }) }),
  getBusinessHours: () => apiRequest('/rest/v1/business_hours?select=*&order=day_of_week'),
  updateBusinessHours: (hours: any) => apiRequest('/rest/v1/business_hours', { method: 'PATCH', body: JSON.stringify(hours) }),
};

export const profileAPI = {
  get: () => apiRequest('/rest/v1/admin_profiles?select=*,user:auth.users(*)'),
  update: (profile: any) => apiRequest('/rest/v1/admin_profiles', { method: 'PATCH', body: JSON.stringify({ ...profile, updated_at: new Date().toISOString() }) }),
  updatePassword: (passwordData: any) => apiRequest('/auth/v1/user', { method: 'PUT', body: JSON.stringify(passwordData) }),
};

export const authAPI = {
  login: (credentials: any) => apiRequest('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => apiRequest('/auth/v1/logout', { method: 'POST' }),
  refreshToken: () => apiRequest('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: localStorage.getItem('supabase_refresh_token') }) }),
  getUser: () => apiRequest('/auth/v1/user', { method: 'GET' }),
};