import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { TakeawayOrder, OrderItem } from "@/lib/supabase";

interface TakeawayPageProps {
  isAdmin: boolean;
}


const TakeawayPage = ({ isAdmin }: TakeawayPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const menuCategories = [
    {
      title: "Veg Appetisers",
      items: [
        "Onion Bajji",
        "Gobi Manchurian", 
        "Crispy Corn",
        "Paneer Tikka",
        "Chilly Paneer",
        "Paneer 65"
      ]
    },
    {
      title: "Non-Veg Appetisers",
      items: [
        "Chicken Manchurian",
        "65 Chicken",
        "Chicken Lollipop",
        "Chilly Chicken", 
        "Chicken Tikka",
        "Cashew Chicken",
        "Prawns Tikka",
        "Prawns Majestic",
        "Lamb Chops"
      ]
    },
    {
      title: "Veg Main Course",
      items: [
        "Dal Tadka",
        "Kadai Mixed Veg",
        "Paneer Tikka Masala",
        "Paneer Butter Masala",
        "Palak Paneer",
        "Nizami Paneer",
        "Chana Masala"
      ]
    },
    {
      title: "Non-Veg Main Course", 
      items: [
        "Chicken Tikka Masala",
        "Chicken Butter Masala",
        "Andhra Chicken Curry",
        "Andhra Boneless Chicken Curry",
        "Nizami Chicken Boneless",
        "Lamb Curry",
        "Lamb Pepper Fry",
        "Prawn Curry",
        "Nizami Prawns"
      ]
    },
    {
      title: "Biryanis",
      items: [
        "Nawabi Lamb Biryani",
        "Prawns Biryani", 
        "Hyderabadi Chicken Dum Biryani",
        "Chicken Fry Piece Biryani",
        "Paneer Biryani",
        "Veg Biryani",
        "Egg Biryani",
        "Vijayawada Biryani",
        "Ulavacharu Biryani",
        "Avakai Biryani"
      ]
    },
    {
      title: "Tiffins",
      items: [
        "Plain Dosa",
        "Karam Dosa",
        "Ghee Dosa",
        "Masala Dosa / Onion Dosa",
        "Plain Idly",
        "Karam Idly", 
        "Ghee Idly",
        "Sambar Idly",
        "Plain Vada",
        "Perugu Vada",
        "Sambar Vada",
        "Uttapam",
        "Poori + Aloo Pitala",
        "Chole Batture",
        "Idly Vada (Combo)"
      ]
    },
    {
      title: "Sides",
      items: [
        "Plain Naan",
        "Butter Naan",
        "Garlic Naan",
        "Onion Naan",
        "Coriander Naan",
        "Peshawari Naan",
        "Roti",
        "Butter Roti",
        "Papadams",
        "Egg Fried Rice",
        "Plain Rice",
        "Special Bagara Rice",
        "Pilaf Rice"
      ]
    },
    {
      title: "Extras",
      items: [
        "Curry Sauce",
        "Chutney",
        "Sambar",
        "Glass of Milk",
        "Ghee",
        "Onion",
        "Lemon Wedges",
        "Aloo Masala",
        "Karam",
        "Poori 1pc",
        "Idly 1pc",
        "Vada 1pc",
        "Dosa",
        "Batture 1pc",
        "Chole",
        "Salan",
        "Raita"
      ]
    },
    {
      title: "Beverages",
      items: [
        "Mango Lassi",
        "Lime Soda",
        "Coke",
        "Pepsi",
        "Sprite",
        "7up",
        "Thumsup",
        "Limca",
        "Sparkling Water",
        "Plain Water",
        "Special Nawabi Chai",
        "Coffee"
      ]
    },
    {
      title: "Desserts",
      items: [
        "Double Ka Meeta",
        "Gulab Jamun",
        "Ice Cream"
      ]
    },
    {
      title: "Kids Menu",
      items: [
        "Chicken Goujons",
        "Chips",
        "Fruit Shoots",
        "Kids Meal (Chicken goujons, Chips, Drink)"
      ]
    }
  ];

  const getItemTypeColor = (categoryTitle: string) => {
    if (categoryTitle.toLowerCase().includes('veg') && !categoryTitle.toLowerCase().includes('non-veg')) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (categoryTitle.toLowerCase().includes('non-veg')) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (categoryTitle.toLowerCase().includes('biryani')) {
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else if (categoryTitle.toLowerCase().includes('tiffin')) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (categoryTitle.toLowerCase().includes('beverage')) {
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    } else if (categoryTitle.toLowerCase().includes('dessert')) {
      return "bg-pink-100 text-pink-800 border-pink-200";
    } else if (categoryTitle.toLowerCase().includes('kids')) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const addToCart = (itemName: string, categoryTitle: string) => {
    if (!isAdmin) {
      toast.error("Only admin can create orders");
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === itemName);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === itemName 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { name: itemName, category: categoryTitle, quantity: 1 }];
      }
    });
    toast.success(`Added ${itemName} to cart`);
  };

  const removeFromCart = (itemName: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === itemName);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.name === itemName 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.name !== itemName);
      }
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const orderData: Omit<TakeawayOrder, 'id' | 'created_at'> = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart,
        total_items: getTotalItems(),
        status: 'pending',
        notes: ''
      };

      const { data, error } = await supabase
        .from('takeaway_orders')
        .insert([orderData])
        .select();

      if (error) {
        console.error('Error creating order:', error);
        toast.error("Failed to create order. Please try again.");
        return;
      }

      toast.success(`Order #${data[0].id} created successfully!`);
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-restaurant-green mb-2">
          Takeaway Menu
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Authentic Hyderabadi Cuisine - Order for pickup
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Menu Categories */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filteredCategories.map((category, index) => (
              <Card key={index} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg font-semibold text-restaurant-green flex items-center gap-2">
                    {category.title}
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-1 ${getItemTypeColor(category.title)}`}
                    >
                      {category.items.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div className="flex justify-between items-center">
                          <p className="text-sm lg:text-base text-foreground font-medium">
                            {item}
                          </p>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item, category.title)}
                              className="ml-2"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {itemIndex < category.items.length - 1 && (
                          <Separator className="my-2 opacity-30" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admin Cart */}
        {isAdmin && (
          <div className="xl:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({getTotalItems()})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-3">
                  <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <Separator />

                {/* Cart Items */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Cart is empty</p>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.name)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item.name, item.category)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Button 
                  onClick={handleCreateOrder}
                  className="w-full"
                  disabled={cart.length === 0 || !customerName.trim()}
                >
                  Create Order
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="mt-8 text-center">
          <p className="text-xs lg:text-sm text-muted-foreground">
            All dishes are prepared with authentic spices and traditional cooking methods
          </p>
        </div>
      )}
    </div>
  );
};

export default TakeawayPage;