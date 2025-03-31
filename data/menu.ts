export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  type: 'food' | 'drinks';
  items: MenuItem[];
}

export const menuData: MenuSection[] = [
  {
    id: 'burgers',
    title: 'Burgers',
    type: 'food',
    items: [
      {
        id: 'burger-1',
        name: 'Signature Burger',
        description: 'House-made beef patty with special sauce, lettuce, cheese, pickles, and onions',
        price: 12.99,
        image: '/burger.jpg'
      },
      {
        id: 'burger-2',
        name: 'Cheeseburger',
        description: 'Classic beef patty with American cheese, lettuce, tomato, and mayo',
        price: 10.99
      },
      {
        id: 'burger-3',
        name: 'Veggie Burger',
        description: 'Plant-based patty with avocado, sprouts, tomato, and vegan aioli',
        price: 11.99
      }
    ]
  },
  {
    id: 'sides',
    title: 'Sides',
    type: 'food',
    items: [
      {
        id: 'sides-1',
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        price: 4.99
      },
      {
        id: 'sides-2',
        name: 'Onion Rings',
        description: 'Beer-battered onion rings with dipping sauce',
        price: 5.99
      },
      {
        id: 'sides-3',
        name: 'Side Salad',
        description: 'Mixed greens with cherry tomatoes and house dressing',
        price: 4.99
      }
    ]
  },
  {
    id: 'drinks',
    title: 'Beverages',
    type: 'drinks',
    items: [
      {
        id: 'drink-1',
        name: 'Soft Drink',
        description: 'Cola, lemon-lime, or root beer',
        price: 2.99
      },
      {
        id: 'drink-2',
        name: 'Iced Tea',
        description: 'Freshly brewed and sweetened or unsweetened',
        price: 2.99
      },
      {
        id: 'drink-3',
        name: 'Craft Beer',
        description: 'Rotating selection of local craft beers',
        price: 6.99
      }
    ]
  }
];