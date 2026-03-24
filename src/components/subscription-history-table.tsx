import { History, WalletCards } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatDisplayDate } from "@/lib/date";
import type { SubscriptionRow } from "@/lib/types";
import { formatCurrencyDh } from "@/lib/utils";

export function SubscriptionHistoryTable({
  subscriptions,
}: {
  subscriptions: SubscriptionRow[];
}) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/85">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <History className="size-5" />
        </div>
        <div>
          <CardTitle className="text-2xl">Subscription history</CardTitle>
          <CardDescription>
            Every renewal is saved as its own payment record.
          </CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {subscriptions.length ? (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader className="sticky top-[5.5rem] z-10 bg-card/95 backdrop-blur">
                  <TableRow>
                    <TableHead>Payment date</TableHead>
                    <TableHead>Expiry date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Saved at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        {formatDisplayDate(subscription.payment_date)}
                      </TableCell>
                      <TableCell>
                        {formatDisplayDate(subscription.expiry_date)}
                      </TableCell>
                      <TableCell>{formatCurrencyDh(subscription.amount)}</TableCell>
                      <TableCell>{formatDateTime(subscription.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 md:hidden">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4"
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <WalletCards className="size-4" />
                    Payment record
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment date</p>
                      <p className="font-semibold">
                        {formatDisplayDate(subscription.payment_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expiry date</p>
                      <p className="font-semibold">
                        {formatDisplayDate(subscription.expiry_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">
                        {formatCurrencyDh(subscription.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saved at</p>
                      <p className="font-semibold">
                        {formatDateTime(subscription.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No subscription history yet"
            description="The member's payment records will appear here as soon as they are saved."
            icon={History}
          />
        )}
      </CardContent>
    </Card>
  );
}
