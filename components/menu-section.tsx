import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MenuSection as MenuSectionType } from '@/data/menu';

interface MenuSectionProps {
  section: MenuSectionType;
  onAddToOrder?: (itemId: string) => void;
}

export function MenuSection({ section, onAddToOrder }: MenuSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{section.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.items.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.image && (
              <div className="w-full h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>${item.price.toFixed(2)}</CardDescription>
                </div>
                {onAddToOrder && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-full" 
                    onClick={() => onAddToOrder(item.id)}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}