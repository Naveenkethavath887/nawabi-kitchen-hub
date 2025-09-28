import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface TableOrder {
  tableNumber: number;
  items: CartItem[];
  total: number;
  status: 'empty' | 'ordered' | 'paid';
}

const menuItems: MenuItem[] = [
  // Veg Appetisers
  { name: "Onion Bajji", price: 7.95, category: "Veg Appetisers" },
  { name: "Gobi Manchurian", price: 8.95, category: "Veg Appetisers" },
  { name: "Crispy Corn", price: 7.95, category: "Veg Appetisers" },
  { name: "Paneer Tikka", price: 10.95, category: "Veg Appetisers" },
  { name: "Chilly Paneer", price: 10.95, category: "Veg Appetisers" },
  { name: "Paneer 65", price: 10.95, category: "Veg Appetisers" },

  // Non-Veg Appetisers
  { name: "Chicken Manchurian", price: 9.95, category: "Non-Veg Appetisers" },
  { name: "Chicken Lollipop", price: 10.95, category: "Non-Veg Appetisers" },
  { name: "Chicken Wings", price: 9.95, category: "Non-Veg Appetisers" },
  { name: "Chilly Chicken", price: 10.95, category: "Non-Veg Appetisers" },
  { name: "Chicken Tikka", price: 10.95, category: "Non-Veg Appetisers" },
  { name: "Cashew Chicken", price: 10.95, category: "Non-Veg Appetisers" },
  { name: "Prawns Tikka", price: 13.95, category: "Non-Veg Appetisers" },

  // Veg Main Course
  { name: "Kadai Mixed Veg", price: 13.95, category: "Veg Main Course" },
  { name: "Dal Tadka", price: 10.95, category: "Veg Main Course" },
  { name: "Nizami Veg Korma", price: 12.95, category: "Veg Main Course" },
  { name: "Paneer Butter Masala", price: 20.95, category: "Veg Main Course" },
  { name: "Paneer Tikka Masala", price: 20.95, category: "Veg Main Course" },

  // Non-Veg Main Course
  { name: "Chicken Curry", price: 17.95, category: "Non-Veg Main Course" },
  { name: "Butter Chicken", price: 18.50, category: "Non-Veg Main Course" },
  { name: "Chicken Butter Masala", price: 18.95, category: "Non-Veg Main Course" },
  { name: "Andhra Chicken Curry", price: 18.95, category: "Non-Veg Main Course" },
  { name: "Andhra Boneless Chicken Curry", price: 20.95, category: "Non-Veg Main Course" },
  { name: "Nizami Chicken Boneless", price: 19.95, category: "Non-Veg Main Course" },

  // Biryanis
  { name: "Egg Biryani", price: 17.95, category: "Biryanis" },
  { name: "Veg Biryani", price: 17.95, category: "Biryanis" },
  { name: "Chicken Biryani", price: 21.95, category: "Biryanis" },
  { name: "Mutton Biryani", price: 24.95, category: "Biryanis" },
  { name: "Prawns Biryani", price: 24.95, category: "Biryanis" },
  { name: "Nawabi Lamb Biryani", price: 24.95, category: "Biryanis" },
  { name: "Vijayawada Boneless Biryani", price: 22.95, category: "Biryanis" },
  { name: "Special Biryani", price: 25.50, category: "Biryanis" },

  // Tiffins
  { name: "Idly", price: 6.95, category: "Tiffins" },
  { name: "Medu Vada (2 pcs)", price: 7.95, category: "Tiffins" },
  { name: "Sambar Idly", price: 8.95, category: "Tiffins" },
  { name: "Sambar Vada", price: 9.95, category: "Tiffins" },
  { name: "Plain Dosa", price: 9.95, category: "Tiffins" },
  { name: "Masala Dosa", price: 10.95, category: "Tiffins" },
  { name: "Onion Dosa", price: 10.95, category: "Tiffins" },
  { name: "Paneer Dosa", price: 11.95, category: "Tiffins" },
  { name: "Rava Dosa", price: 11.95, category: "Tiffins" },
  { name: "Onion Rava Dosa", price: 12.95, category: "Tiffins" },
  { name: "Mysore Masala Dosa", price: 12.95, category: "Tiffins" },
  { name: "Ghee Roast Dosa", price: 13.95, category: "Tiffins" },
  { name: "Pesarattu Upma Dosa", price: 13.95, category: "Tiffins" },
  { name: "Family Dosa", price: 21.95, category: "Tiffins" },

  // Kids Menu
  { name: "Chicken Goujons (7)", price: 7.95, category: "Kids Menu" },
  { name: "Fish Fingers (4)", price: 7.95, category: "Kids Menu" },
  { name: "Chicken Nuggets (7)", price: 7.95, category: "Kids Menu" },
  { name: "Kids Masala Dosa", price: 6.95, category: "Kids Menu" },

  // Sides
  { name: "Plain Naan", price: 3.25, category: "Sides" },
  { name: "Butter Naan", price: 3.50, category: "Sides" },
  { name: "Garlic Naan", price: 4.00, category: "Sides" },
  { name: "Peshawari Naan", price: 4.50, category: "Sides" },
  { name: "Special Baghara Rice", price: 6.95, category: "Sides" },

  // Desserts
  { name: "Double Ka Meeta", price: 4.95, category: "Desserts" },
  { name: "Gulab Jamun (2 pcs)", price: 4.95, category: "Desserts" },

  // Beverages
  { name: "Coke", price: 3.50, category: "Beverages" },
  { name: "Fanta", price: 3.50, category: "Beverages" },
  { name: "Sprite", price: 3.50, category: "Beverages" },
  { name: "Water", price: 3.50, category: "Beverages" },
  { name: "Sweet Lassi", price: 4.95, category: "Beverages" },
  { name: "Salt Lassi", price: 4.95, category: "Beverages" },
];

const categories = [
  "Veg Appetisers",
  "Non-Veg Appetisers",
  "Veg Main Course",
  "Non-Veg Main Course",
  "Biryanis",
  "Tiffins",
  "Kids Menu",
  "Sides",
  "Desserts",
  "Beverages"
];

const DineInPage = () => {
  const [tableOrders, setTableOrders] = useState<Record<number, TableOrder>>({});
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSidesDialog, setShowSidesDialog] = useState(false);
  const [selectedMainCourse, setSelectedMainCourse] = useState<MenuItem | null>(null);

  const sidesItems = menuItems.filter(item => item.category === "Sides");

  const getTableStatus = (tableNumber: number): 'empty' | 'ordered' | 'paid' => {
    const order = tableOrders[tableNumber];
    if (!order || order.items.length === 0) return 'empty';
    return order.status;
  };

  const getTableColor = (tableNumber: number) => {
    const status = getTableStatus(tableNumber);
    switch (status) {
      case 'empty': return 'bg-green-500 hover:bg-green-600';
      case 'ordered': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'paid': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-green-500 hover:bg-green-600';
    }
  };

  const handleTableClick = (tableNumber: number) => {
    setSelectedTable(tableNumber);
    const order = tableOrders[tableNumber];
    if (order && order.items.length > 0) {
      setCart([...order.items]);
    } else {
      setCart([]);
    }
    setShowMenu(true);
  };

  const addToCart = (item: MenuItem) => {
    if ((item.category === "Veg Main Course" || item.category === "Non-Veg Main Course")) {
      setSelectedMainCourse(item);
      setShowSidesDialog(true);
    } else {
      const existingItem = cart.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        setCart(cart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    }
  };

  const handleSidesSelection = (selectedSide: MenuItem) => {
    if (selectedMainCourse) {
      const existingMainCourse = cart.find(cartItem => cartItem.name === selectedMainCourse.name);
      const existingSide = cart.find(cartItem => cartItem.name === selectedSide.name);

      let updatedCart = [...cart];

      if (existingMainCourse) {
        updatedCart = updatedCart.map(cartItem =>
          cartItem.name === selectedMainCourse.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...updatedCart, { ...selectedMainCourse, quantity: 1 }];
      }

      if (existingSide) {
        updatedCart = updatedCart.map(cartItem =>
          cartItem.name === selectedSide.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...updatedCart, { ...selectedSide, quantity: 1 }];
      }

      setCart(updatedCart);
    }
    setShowSidesDialog(false);
    setSelectedMainCourse(null);
  };

  const updateCartItemQuantity = (itemName: string, change: number) => {
    setCart(cart.map(item => {
      if (item.name === itemName) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemName: string) => {
    setCart(cart.filter(item => item.name !== itemName));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (selectedTable && cart.length > 0) {
      const newOrder: TableOrder = {
        tableNumber: selectedTable,
        items: [...cart],
        total: calculateTotal(),
        status: 'ordered'
      };

      setTableOrders(prev => ({
        ...prev,
        [selectedTable]: newOrder
      }));

      setCart([]);
      setShowMenu(false);
      setSelectedTable(null);
      setSelectedCategory(null);
    }
  };

  const processPayment = (paymentMethod: 'cash' | 'card') => {
    if (selectedTable && tableOrders[selectedTable]) {
      setTableOrders(prev => ({
        ...prev,
        [selectedTable]: {
          ...prev[selectedTable],
          status: 'paid'
        }
      }));

      // Clear table after payment
      setTimeout(() => {
        setTableOrders(prev => {
          const updated = { ...prev };
          delete updated[selectedTable];
          return updated;
        });
      }, 2000);

      setCart([]);
      setShowMenu(false);
      setSelectedTable(null);
      setSelectedCategory(null);
    }
  };

  const renderTablesGrid = () => (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-restaurant-green mb-6">Dine In Tables</h2>
      <div className="grid grid-cols-5 gap-4 lg:gap-6">
        {Array.from({ length: 25 }, (_, i) => i + 1).map(tableNumber => (
          <Card
            key={tableNumber}
            className={`${getTableColor(tableNumber)} text-white cursor-pointer transition-all duration-200 hover:scale-105 aspect-square flex items-center justify-center shadow-lg`}
            onClick={() => handleTableClick(tableNumber)}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{tableNumber}</div>
              <div className="text-sm opacity-90">
                {getTableStatus(tableNumber) === 'empty' ? 'Available' :
                 getTableStatus(tableNumber) === 'ordered' ? 'Ordered' : 'Available'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMenuDialog = () => (
    <Dialog open={showMenu} onOpenChange={setShowMenu}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-restaurant-green">
            Table {selectedTable} - Menu
          </DialogTitle>
        </DialogHeader>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card
                key={category}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-restaurant-green-light to-restaurant-green/10 border-restaurant-green/20 hover:scale-105"
                onClick={() => setSelectedCategory(category)}
              >
                <h3 className="font-semibold text-restaurant-green text-center">
                  {category}
                </h3>
              </Card>
            ))}
            
            {/* Cart Section */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="font-semibold text-primary mb-4">Cart</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-white/50 rounded p-2">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateCartItemQuantity(item.name, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateCartItemQuantity(item.name, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => removeFromCart(item.name)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center font-bold text-primary mb-3">
                    <span>Total:</span>
                    <span>€{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {getTableStatus(selectedTable!) === 'ordered' ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        onClick={() => processPayment('cash')}
                      >
                        Cash Payment
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        onClick={() => processPayment('card')}
                      >
                        Card Payment
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={placeOrder}>
                      Place Order
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                ← Back to Categories
              </Button>
              <h3 className="text-xl font-bold text-restaurant-green">{selectedCategory}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems
                .filter(item => item.category === selectedCategory)
                .map((item, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => addToCart(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-restaurant-green">{item.name}</h4>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          €{item.price.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderSidesDialog = () => (
    <Dialog open={showSidesDialog} onOpenChange={setShowSidesDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a complementary side with {selectedMainCourse?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3">
          {sidesItems.map((side, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={() => handleSidesSelection(side)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{side.name}</span>
                <Badge variant="secondary">€{side.price.toFixed(2)}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderTablesGrid()}
      {renderMenuDialog()}
      {renderSidesDialog()}
    </div>
  );
};

export default DineInPage;