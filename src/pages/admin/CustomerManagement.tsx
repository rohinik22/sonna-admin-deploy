import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { userService, User } from '@/lib/userService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, UserPlus, Phone, Mail, Calendar, Star, RefreshCw, Users, DollarSign, Award } from 'lucide-react'

export const CustomerManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  useEffect(() => {
    loadUsers()
  }, [])
  
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await userService.getUsers()
      setUsers(result.users || [])
      setAnalytics(result.analytics || null)
    } catch (err) {
      setError('Failed to load customers. Please try again.')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return user.full_name?.toLowerCase().includes(searchLower) ||
           user.email?.toLowerCase().includes(searchLower) ||
           user.phone?.toLowerCase().includes(searchLower)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading customers...</span>
            </div>
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadUsers}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">Manage customer accounts and view analytics</p>
          </div>
          <Button onClick={loadUsers} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.total_customers || users.length}</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.total_revenue || 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.avg_order_value ? formatCurrency(analytics.avg_order_value) : 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">{analytics.total_loyalty_points || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Loyalty Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customers ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No customers found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Customers will appear here when they register'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {user.total_orders || 0} orders
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(user.total_spent || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{user.loyalty_points || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-16 h-16">
                                    <AvatarFallback className="text-lg">
                                      {selectedUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">{selectedUser.full_name || 'Unknown User'}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <Badge className="mt-1">active</Badge>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-sm text-muted-foreground">Total Orders</div>
                                      <div className="text-2xl font-bold">{selectedUser.total_orders || 0}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-sm text-muted-foreground">Total Spent</div>
                                      <div className="text-2xl font-bold">{formatCurrency(selectedUser.total_spent || 0)}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-sm text-muted-foreground">Loyalty Points</div>
                                      <div className="text-2xl font-bold text-yellow-600">{selectedUser.loyalty_points || 0}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="text-sm text-muted-foreground">Member Since</div>
                                      <div className="text-2xl font-bold">{formatDate(selectedUser.created_at)}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default CustomerManagement
