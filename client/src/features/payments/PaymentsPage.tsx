import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePayments } from '@/hooks/useApi';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Receipt, Plus, MoreHorizontal } from 'lucide-react';

export function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePayments({ page, limit: 10 });
  const payments = data?.payments || [];
  const pagination = data?.pagination;

  return (
    <div>
      <Header title="Payments" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment History</h2>
            <Button><Plus className="h-4 w-4 mr-2" /> Record Payment</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Method</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="w-10 p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b last:border-0">
                          {[...Array(7)].map((__, j) => <td key={j} className="p-4"><Skeleton className="h-5 w-20" /></td>)}
                        </tr>
                      ))
                    ) : payments.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-muted-foreground"><Receipt className="h-12 w-12 mx-auto mb-3 opacity-40" /><p>No payments recorded</p></td></tr>
                    ) : (
                      payments.map((pmt: any) => (
                        <tr key={pmt._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4 text-sm font-medium">{pmt.invoice?.invoiceNumber || '-'}</td>
                          <td className="p-4 text-sm">{pmt.customer?.firstName} {pmt.customer?.lastName}</td>
                          <td className="p-4 text-sm font-semibold">{formatCurrency(pmt.amount, pmt.currency)}</td>
                          <td className="p-4 text-sm capitalize">{pmt.method.replace(/_/g, ' ')}</td>
                          <td className="p-4"><Badge variant="outline" className={getStatusColor(pmt.status)}>{getStatusLabel(pmt.status)}</Badge></td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(pmt.paymentDate)}</td>
                          <td className="p-4"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {page} of {pagination.pages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
