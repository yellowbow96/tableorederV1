import { Order } from './types';

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

const API_BASE_URL = 'http://localhost:3001/api';

const handleApiError = async (response: Response, operation: string): Promise<never> => {
  let errorData: ApiError;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: `${operation} failed with status ${response.status}` };
  }
  throw new Error(errorData.message || `Failed to ${operation.toLowerCase()}`);
};

export const OrderService = {
  createOrder: async (orderData: Omit<Order, '_id' | 'status' | 'createdAt'>) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      await handleApiError(response, 'Create order');
    }
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      await handleApiError(response, 'Fetch orders');
    }
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      await handleApiError(response, 'Update order status');
    }
    return response.json();
  },
};