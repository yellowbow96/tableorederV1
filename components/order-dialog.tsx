import { useState, useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MenuSection, MenuItem } from '@/data/menu';
import { OrderItem } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Minus, Search, X, MessageSquare } from 'lucide-react';

interface OrderDialogProps {
  menuData: MenuSection[];
  onOrderSubmit: (items: OrderItem[]) => void;
  initialItems?: OrderItem[];
}

export function OrderDialog({ menuData, onOrderSubmit, initialItems = [] }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // Update orderItems when initialItems changes
  useEffect(() => {
    const newOrderItems: Record<string, OrderItem> = {};
    initialItems.forEach(item => {
      newOrderItems[item.menuItem.id] = item;
    });
    setOrderItems(newOrderItems);
  }, [initialItems]);

  const handleAddItem = (item: MenuItem) => {
    setOrderItems((prev: Record<string, OrderItem>) => {
      const existingItem = prev[item.id];
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      if (newQuantity > 10) {
        toast.error("Maximum quantity per item is 10");
        return prev;
      }
      return {
        ...prev,
        [item.id]: {
          menuItem: item,
          quantity: newQuantity,
          specialInstructions: existingItem?.specialInstructions || ''
        }
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems((prev: Record<string, OrderItem>) => {
      const existingItem = prev[itemId];
      if (!existingItem || existingItem.quantity <= 1) {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      }
      return {
        ...prev,
        [itemId]: {
          ...existingItem,
          quantity: existingItem.quantity - 1
        }
      };
    });
  };

  const handleSpecialInstructions = (itemId: string, instructions: string) => {
    setOrderItems((prev: Record<string, OrderItem>) => {
      const existingItem = prev[itemId];
      if (!existingItem) return prev;
      
      return {
        ...prev,
        [itemId]: {
          ...existingItem,
          specialInstructions: instructions
        }
      };
    });
  };

  const handleClearOrder = () => {
    setOrderItems({});
    setOrderNotes('');
  };

  const handleSubmit = () => {
    const items = Object.values(orderItems);
    if (items.length > 0) {
      // Add order notes to the submission
      onOrderSubmit(items as OrderItem[]);
      setOrderItems({});
      setOrderNotes('');
      setOpen(false);
    }
  };

  const totalItems = Object.values(orderItems).reduce(
    (sum: number, item: OrderItem) => sum + item.quantity, 
    0
  );

  const totalPrice = Object.values(orderItems).reduce(
    (sum: number, item: OrderItem) => sum + (item.menuItem.price * item.quantity), 
    0
  );

  // Filter menu items based on search and category
  const filteredMenuData = menuData
    .filter(section => !selectedCategory || section.id === selectedCategory)
    .map(section => ({
      ...section,
      items: section.items.filter(item => 
        !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Order
          {totalItems > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {totalItems}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Order</DialogTitle>
          <DialogDescription>
            Review your items before submitting your order.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Search and filter */}
          <div className="mb-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1.5 h-7 w-7 p-0" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {menuData.map(section => (
                <Button 
                  key={section.id}
                  variant={selectedCategory === section.id ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setSelectedCategory(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </div>

          <h3 className="mb-4 font-medium">Add Items to Your Order</h3>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {filteredMenuData.length > 0 ? (
              filteredMenuData.map(section => (
                <div key={section.id} className="mb-4">
                  <h4 className="font-medium mb-2">{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddItem(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No items found. Try a different search term or category.
              </p>
            )}
          </ScrollArea>

          {totalItems > 0 ? (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Current Order</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearOrder}
                >
                  Clear All
                </Button>
              </div>
              {Object.values(orderItems).map((item: OrderItem) => (
                <div key={item.menuItem.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>{item.menuItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.menuItem.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleRemoveItem(item.menuItem.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleAddItem(item.menuItem)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    placeholder="Special instructions..."
                    value={item.specialInstructions || ''}
                    onChange={(e) => handleSpecialInstructions(item.menuItem.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowNotes(!showNotes)}
              >
                <MessageSquare className="h-4 w-4" />
                {showNotes ? "Hide Order Notes" : "Add Order Notes"}
              </Button>
              
              {showNotes && (
                <Textarea
                  placeholder="Any notes for your order? (allergies, delivery instructions, etc.)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              )}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Your order is empty. Add items from the menu.
            </p>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            className="sm:flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={totalItems === 0}
            className="sm:flex-1"
          >
            Submit Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}