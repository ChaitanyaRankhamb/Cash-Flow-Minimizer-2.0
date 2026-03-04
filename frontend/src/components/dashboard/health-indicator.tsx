'use client'

import { Card } from '@/components/ui/card'
import { useAppDataStore } from '@/store/useAppDataStore'
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export function HealthIndicatorCard() {
  const appData = useAppDataStore((s) => s.appData)
  const loading = useAppDataStore((s) => s.loading)
  const error = useAppDataStore((s) => s.error)

  if (loading) return <Card className="p-6">Loading...</Card>
  // if (error) return <Card className="p-6 text-destructive">{error}</Card>
  if (!appData) return null

  const netPosition = appData.dashboard?.debtStatus?.netPosition ?? 0

  const getStatus = () => {
    if (netPosition > 0) {
      return {
        title: 'Healthy – You are overall creditor',
        textColor: 'text-emerald-500',
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-500/10',
        icon: TrendingUp,
      }
    } else if (netPosition < 0) {
      return {
        title: 'Attention – You are a debtor',
        textColor: 'text-destructive',
        iconColor: 'text-destructive',
        iconBg: 'bg-destructive/10',
        icon: AlertCircle,
      }
    } else {
      return {
        title: 'All Settled',
        textColor: 'text-primary',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        icon: CheckCircle2,
      }
    }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-4">

        <div className={`p-3 rounded-xl ${status.iconBg}`}>
          <StatusIcon className={`h-6 w-6 ${status.iconColor}`} />
        </div>

        <div className="flex-1">
          <h3 className={`text-base font-semibold tracking-tight ${status.textColor}`}>
            {status.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            {netPosition > 0
              ? `You are owed ₹${Math.abs(netPosition).toFixed(2)} overall`
              : netPosition < 0
              ? `You owe ₹${Math.abs(netPosition).toFixed(2)} overall`
              : 'All debts are settled'}
          </p>
        </div>

      </div>
    </Card>
  )
}