'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuSection } from '@/components/menu-section';
import { OrderDialog } from '@/components/order-dialog';
import { toast } from 'sonner';
import { menuData } from '@/data/menu';
import { MenuItem } from '@/data/menu';

// Define the OrderItem type if not already defined elsewhere
interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export default function Home() {
  const [tableNumber, setTableNumber] = useState('');
  const [isTableSet, setIsTableSet] = useState(false);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  
  // Best selling item data
  const bestSellingItem = {
    id: 'burger-1',
    name: "Signature Burger",
    description: "Our most popular item! House-made beef patty with special sauce",
    price: 12.99,
    image: "/burger.jpg"
  };

  const handleRequest = (type: string) => {
    if (!tableNumber) {
      toast.error("Please set your table number first");
      return;
    }
    
    toast.success(`${type} request sent for Table ${tableNumber}`, {
      description: "A staff member will assist you shortly."
    });
  };

  const handleAddToOrder = (itemId: string) => {
    const item = findMenuItem(itemId);
    if (!item) {
      toast.error("Menu item not found");
      return;
    }
    
    setOrderItems((prev: Record<string, OrderItem>) => {
      const existingItem = prev[itemId];
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      if (newQuantity > 10) {
        toast.error("Maximum quantity per item is 10");
        return prev;
      }
      return {
        ...prev,
        [itemId]: {
          menuItem: item,
          quantity: newQuantity,
          specialInstructions: existingItem?.specialInstructions
        }
      };
    });
    
    toast.success(`Added ${item.name} to your order`);
  };

  const findMenuItem = (itemId: string): MenuItem | undefined => {
    for (const section of menuData) {
      const item = section.items.find(item => item.id === itemId);
      if (item) return item;
    }
    return undefined;
  };

  const handleOrderSubmit = (items: OrderItem[]) => {
    if (!tableNumber) {
      toast.error("Please set your table number first");
      return;
    }
    
    const total = items.reduce((sum, item) => 
      sum + (item.menuItem.price * item.quantity), 0
    );

    toast.success("Order submitted successfully!", {
      description: (
        <div className="space-y-2">
          <p>Table {tableNumber}</p>
          <ul className="text-sm">
            {items.map(item => (
              <li key={item.menuItem.id}>
                {item.quantity}x {item.menuItem.name}
                {item.specialInstructions && (
                  <span className="text-xs block ml-4 text-muted-foreground">
                    Note: {item.specialInstructions}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="font-semibold">Total: ${total.toFixed(2)}</p>
        </div>
      ),
      duration: 5000,
    });
    
    // Clear order items after submission
    setOrderItems({});
  };

  const handleTableSubmit = () => {
    const trimmedTableNumber = tableNumber.trim();
    if (!trimmedTableNumber) {
      toast.error("Please enter a table number");
      return;
    }
    
    const tableNum = parseInt(trimmedTableNumber);
    if (isNaN(tableNum) || tableNum <= 0 || tableNum > 100) {
      toast.error("Please enter a valid table number between 1 and 100");
      return;
    }
    
    setTableNumber(trimmedTableNumber); // Normalize the table number
    setIsTableSet(true);
    toast.success(`Table ${trimmedTableNumber} selected`, {
      description: "You can now browse the menu and place orders."
    });
  };

  const handleAddBestSellerToOrder = () => {
    handleAddToOrder(bestSellingItem.id);
  };

  if (!isTableSet) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Our Restaurant</CardTitle>
            <CardDescription>Please enter your table number to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input 
                  id="tableNumber" 
                  placeholder="Enter table number" 
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleTableSubmit} className="w-full" variant="default">Continue</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8 pb-32">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Restaurant Menu</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Table {tableNumber}</span>
          <OrderDialog 
            menuData={menuData} 
            onOrderSubmit={handleOrderSubmit}
            initialItems={Object.values(orderItems)}
          />
        </div>
      </div>

      <Tabs defaultValue="food">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
        </TabsList>
        <TabsContent value="food" className="space-y-6">
          {menuData.filter(section => section.type === 'food').map(section => (
            <MenuSection 
              key={section.id} 
              section={section} 
              onAddToOrder={handleAddToOrder}
            />
          ))}
        </TabsContent>
        <TabsContent value="drinks" className="space-y-6">
          {menuData.filter(section => section.type === 'drinks').map(section => (
            <MenuSection 
              key={section.id} 
              section={section}
              onAddToOrder={handleAddToOrder}
            />
          ))}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" onClick={() => handleRequest('Water')}>
          Request Water
        </Button>
        <Button variant="outline" onClick={() => handleRequest('Service')}>
          Request Service
        </Button>
        <Button variant="outline" onClick={() => handleRequest('Bill')}>
          Request Bill
        </Button>
      </div>

      {/* Best Selling Item Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h3 className="font-bold">Today's Best Seller</h3>
            <p>{bestSellingItem.name} - ${bestSellingItem.price.toFixed(2)}</p>
            <p className="text-sm opacity-90">{bestSellingItem.description}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleAddBestSellerToOrder}>Add to Order</Button>
        </div>
      </div>
    </div>
  );
}