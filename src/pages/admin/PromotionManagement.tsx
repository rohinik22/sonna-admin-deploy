import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { promotionService, Promotion } from '@/lib/promotionService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  RefreshCw, 
  Gift, 
  Percent,
  DollarSign,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

export const PromotionManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    loadPromotions()
  }, [])
  
  const loadPromotions = async () => {
    try {
      setLoading(true)
      setError(null)
      const { promotions: fetchedPromotions } = await promotionService.getPromotions()
      setPromotions(fetchedPromotions || [])
    } catch (err) {
      setError('Failed to load promotions. Please try again.')
      console.error('Error loading promotions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      await promotionService.updatePromotion(promotion.id, {
        is_active: !promotion.is_active
      })
      loadPromotions()
    } catch (err) {
      console.error('Error toggling promotion status:', err)
    }
  }

  const copyPromotionCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const filteredPromotions = promotions.filter(promotion => {
    const searchLower = searchTerm.toLowerCase()
    return promotion.code.toLowerCase().includes(searchLower) ||
           promotion.name.toLowerCase().includes(searchLower)
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

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.valid_from)
    const endDate = promotion.valid_until ? new Date(promotion.valid_until) : null
    
    if (!promotion.is_active) return 'inactive'
    if (now < startDate) return 'scheduled'
    if (endDate && now > endDate) return 'expired'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'scheduled': return 'secondary'
      case 'expired': return 'destructive'
      case 'inactive': return 'outline'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Promotion Management</h1>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading promotions...</span>
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
          <h1 className="text-2xl font-bold">Promotion Management</h1>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadPromotions}>
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
            <h1 className="text-2xl font-bold">Promotion Management</h1>
            <p className="text-muted-foreground">Create and manage promotional offers</p>
          </div>
          <Button onClick={loadPromotions} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Promotions ({filteredPromotions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPromotions.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No promotions found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first promotion to get started'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map((promotion) => {
                    const status = getPromotionStatus(promotion)
                    return (
                      <TableRow key={promotion.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {promotion.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyPromotionCode(promotion.code)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{promotion.name}</div>
                            {promotion.description && (
                              <div className="text-sm text-muted-foreground">{promotion.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {promotion.discount_type === 'percentage' ? (
                              <>
                                <Percent className="w-4 h-4" />
                                <span>{promotion.discount_value}%</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(promotion.discount_value)}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(promotion.valid_from)}</div>
                            {promotion.valid_until && (
                              <div className="text-muted-foreground">to {formatDate(promotion.valid_until)}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{promotion.used_count || 0} used</div>
                            {promotion.usage_limit && promotion.usage_limit > 0 && (
                              <div className="text-muted-foreground">of {promotion.usage_limit}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(status) as any}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(promotion)}
                            >
                              {promotion.is_active ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PromotionManagement
