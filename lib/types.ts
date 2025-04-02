type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "drinks" | "food" | "snacks" | "meals" | "desserts";
  description: string;
};

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

export type { MenuItem, OrderItem, Order };
