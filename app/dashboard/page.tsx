'use client';

import { useEffect, useState } from 'react';
import { OrderService } from '@/lib/api-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdating(orderId);
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders after update
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Order['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const colors = {
      pending: 'default',
      preparing: 'secondary',
      ready: 'outline',
      completed: 'destructive'
    } as const;
    return colors[status];
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null
    };
    return statusFlow[currentStatus] as Order['status'] | null;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Dashboard</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 bg-card shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order ID: {order._id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge variant={getStatusColor(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {getNextStatus(order.status) && (
              <div className="mt-4">
                <Button
                  onClick={() =>
                    updateStatus(order._id, getNextStatus(order.status)!)
                  }
                  variant="outline"
                  className="w-full"
                  disabled={isUpdating === order._id}
                >
                  {isUpdating === order._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Mark as ${getNextStatus(order.status)?.toUpperCase()}`
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}