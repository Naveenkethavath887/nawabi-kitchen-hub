import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { TakeawayOrder, OrderItem } from "@/lib/supabase";

interface TakeawayPageProps {
  isAdmin: boolean;
}


const TakeawayPage = ({ isAdmin }: TakeawayPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [collectionTime, setCollectionTime] = useState("");

  const menuCategories = [
    {
      title: "Veg Appetisers",
      items: [
        { name: "Onion Bajji", price: "£6.95" },
        { name: "Gobi Manchurian", price: "£7.95" }, 
        { name: "Crispy Corn", price: "£6.95" },
        { name: "Paneer Tikka", price: "£8.95" },
        { name: "Chilly Paneer", price: "£8.95" },
        { name: "Paneer 65", price: "£8.95" }
      ]
    },
    {
      title: "Non-Veg Appetisers",
      items: [
        { name: "Chicken Manchurian", price: "£8.95" },
        { name: "65 Chicken", price: "£8.95" },
        { name: "Chicken Lollipop", price: "£9.95" },
        { name: "Chilly Chicken", price: "£8.95" }, 
        { name: "Chicken Tikka", price: "£9.95" },
        { name: "Cashew Chicken", price: "£10.95" },
        { name: "Prawns Tikka", price: "£11.95" },
        { name: "Prawns Majestic", price: "£12.95" },
        { name: "Lamb Chops", price: "£13.95" }
      ]
    },
    {
      title: "Veg Main Course",
      items: [
        { name: "Dal Tadka", price: "£7.95" },
        { name: "Kadai Mixed Veg", price: "£8.95" },
        { name: "Paneer Tikka Masala", price: "£9.95" },
        { name: "Paneer Butter Masala", price: "£9.95" },
        { name: "Palak Paneer", price: "£9.95" },
        { name: "Nizami Paneer", price: "£10.95" },
        { name: "Chana Masala", price: "£7.95" }
      ]
    },
    {
      title: "Non-Veg Main Course", 
      items: [
        { name: "Chicken Tikka Masala", price: "£10.95" },
        { name: "Chicken Butter Masala", price: "£10.95" },
        { name: "Andhra Chicken Curry", price: "£9.95" },
        { name: "Andhra Boneless Chicken Curry", price: "£10.95" },
        { name: "Nizami Chicken Boneless", price: "£11.95" },
        { name: "Lamb Curry", price: "£12.95" },
        { name: "Lamb Pepper Fry", price: "£12.95" },
        { name: "Prawn Curry", price: "£11.95" },
        { name: "Nizami Prawns", price: "£12.95" }
      ]
    },
    {
      title: "Biryanis",
      items: [
        { name: "Nawabi Lamb Biryani", price: "£14.95" },
        { name: "Prawns Biryani", price: "£13.95" }, 
        { name: "Hyderabadi Chicken Dum Biryani", price: "£12.95" },
        { name: "Chicken Fry Piece Biryani", price: "£12.95" },
        { name: "Paneer Biryani", price: "£10.95" },
        { name: "Veg Biryani", price: "£9.95" },
        { name: "Egg Biryani", price: "£8.95" },
        { name: "Vijayawada Biryani", price: "£11.95" },
        { name: "Ulavacharu Biryani", price: "£11.95" },
        { name: "Avakai Biryani", price: "£11.95" }
      ]
    },
    {
      title: "Tiffins",
      items: [
        { name: "Plain Dosa", price: "£4.95" },
        { name: "Karam Dosa", price: "£5.95" },
        { name: "Ghee Dosa", price: "£5.95" },
        { name: "Masala Dosa / Onion Dosa", price: "£6.95" },
        { name: "Plain Idly", price: "£3.95" },
        { name: "Karam Idly", price: "£4.95" }, 
        { name: "Ghee Idly", price: "£4.95" },
        { name: "Sambar Idly", price: "£4.95" },
        { name: "Plain Vada", price: "£3.95" },
        { name: "Perugu Vada", price: "£4.95" },
        { name: "Sambar Vada", price: "£4.95" },
        { name: "Uttapam", price: "£5.95" },
        { name: "Poori + Aloo Pitala", price: "£6.95" },
        { name: "Chole Batture", price: "£6.95" },
        { name: "Idly Vada (Combo)", price: "£5.95" }
      ]
    },
    {
      title: "Sides",
      items: [
        { name: "Plain Naan", price: "£2.95" },
        { name: "Butter Naan", price: "£3.45" },
        { name: "Garlic Naan", price: "£3.95" },
        { name: "Onion Naan", price: "£3.95" },
        { name: "Coriander Naan", price: "£3.95" },
        { name: "Peshawari Naan", price: "£4.45" },
        { name: "Roti", price: "£2.45" },
        { name: "Butter Roti", price: "£2.95" },
        { name: "Papadams", price: "£1.95" },
        { name: "Egg Fried Rice", price: "£4.95" },
        { name: "Plain Rice", price: "£3.45" },
        { name: "Special Bagara Rice", price: "£4.95" },
        { name: "Pilaf Rice", price: "£4.45" }
      ]
    },
    {
      title: "Extras",
      items: [
        { name: "Curry Sauce", price: "£2.95" },
        { name: "Chutney", price: "£1.95" },
        { name: "Sambar", price: "£2.45" },
        { name: "Glass of Milk", price: "£1.95" },
        { name: "Ghee", price: "£0.95" },
        { name: "Onion", price: "£0.50" },
        { name: "Lemon Wedges", price: "£0.50" },
        { name: "Aloo Masala", price: "£2.95" },
        { name: "Karam", price: "£0.95" },
        { name: "Poori 1pc", price: "£1.95" },
        { name: "Idly 1pc", price: "£1.45" },
        { name: "Vada 1pc", price: "£1.45" },
        { name: "Dosa", price: "£4.95" },
        { name: "Batture 1pc", price: "£1.95" },
        { name: "Chole", price: "£2.95" },
        { name: "Salan", price: "£2.95" },
        { name: "Raita", price: "£2.45" }
      ]
    },
    {
      title: "Beverages",
      items: [
        { name: "Mango Lassi", price: "£3.95" },
        { name: "Lime Soda", price: "£2.95" },
        { name: "Coke", price: "£2.45" },
        { name: "Pepsi", price: "£2.45" },
        { name: "Sprite", price: "£2.45" },
        { name: "7up", price: "£2.45" },
        { name: "Thumsup", price: "£2.45" },
        { name: "Limca", price: "£2.45" },
        { name: "Sparkling Water", price: "£2.95" },
        { name: "Plain Water", price: "£1.95" },
        { name: "Special Nawabi Chai", price: "£2.95" },
        { name: "Coffee", price: "£2.95" }
      ]
    },
    {
      title: "Desserts",
      items: [
        { name: "Double Ka Meeta", price: "£4.95" },
        { name: "Gulab Jamun", price: "£3.95" },
        { name: "Ice Cream", price: "£3.45" }
      ]
    },
    {
      title: "Kids Menu",
      items: [
        { name: "Chicken Goujons", price: "£5.95" },
        { name: "Chips", price: "£3.45" },
        { name: "Fruit Shoots", price: "£1.95" },
        { name: "Kids Meal (Chicken goujons, Chips, Drink)", price: "£8.95" }
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

  const filteredCategories = selectedCategory === "all" 
    ? menuCategories 
    : menuCategories.filter(category => 
        category.title.toLowerCase().replace(/[\s-]/g, '') === selectedCategory.toLowerCase().replace(/[\s-]/g, '')
      );

  const getItemPrice = (itemName: string) => {
    for (const category of menuCategories) {
      const item = category.items.find(item => item.name === itemName);
      if (item) {
        return parseFloat(item.price.replace('£', ''));
      }
    }
    return 0;
  };

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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (getItemPrice(item.name) * item.quantity), 0);
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
      setCollectionTime("");
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
      </div>

      {/* Category Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="mb-2"
          >
            All
          </Button>
          {menuCategories.map((category) => (
            <Button 
              key={category.title}
              variant={selectedCategory === category.title.toLowerCase().replace(/[\s-]/g, '') ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.title.toLowerCase().replace(/[\s-]/g, ''))}
              className="mb-2"
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 ${selectedCategory === "all" ? "grid-cols-1 xl:grid-cols-4" : "grid-cols-1"}`}>
        {/* Menu Categories */}
        <div className={selectedCategory === "all" ? "xl:col-span-3" : "w-full"}>
          {selectedCategory === "all" ? (
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
                          <div 
                            className={`flex justify-between items-center p-2 rounded-lg transition-all duration-200 ${
                              isAdmin ? 'hover:bg-muted/50 hover:shadow-sm cursor-pointer' : ''
                            }`}
                            onClick={() => isAdmin && addToCart(item.name, category.title)}
                          >
                            <div className="flex-1">
                              <p className="text-sm lg:text-base text-foreground font-medium">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted-foreground font-semibold">
                                {item.price}
                              </p>
                            </div>
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
          ) : (
            /* Fullscreen category view */
            <div className="space-y-6">
              {filteredCategories.map((category, index) => (
                <div key={index} className="w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-restaurant-green flex items-center gap-3">
                      {category.title}
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-3 py-1 ${getItemTypeColor(category.title)}`}
                      >
                        {category.items.length} items
                      </Badge>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <Card 
                        key={itemIndex} 
                        className={`h-fit transition-all duration-200 ${
                          isAdmin ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''
                        }`}
                        onClick={() => isAdmin && addToCart(item.name, category.title)}
                      >
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-restaurant-green">
                              {item.price}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Cart */}
        {isAdmin && selectedCategory === "all" && (
          <div className="xl:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({getTotalItems()})
                  </div>
                  <div className="text-sm font-semibold text-restaurant-green">
                    £{getTotalPrice().toFixed(2)}
                  </div>
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
                  <Input
                    type="time"
                    placeholder="Collection Time"
                    value={collectionTime}
                    onChange={(e) => setCollectionTime(e.target.value)}
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
                          <p className="text-xs text-restaurant-green font-semibold">
                            £{(getItemPrice(item.name) * item.quantity).toFixed(2)}
                          </p>
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

                {cart.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-restaurant-green">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                )}

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

        {/* Floating Cart for Category View */}
        {isAdmin && selectedCategory !== "all" && cart.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="w-80 max-h-96 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart ({getTotalItems()})
                  </div>
                  <div className="text-sm font-semibold text-restaurant-green">
                    £{getTotalPrice().toFixed(2)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-restaurant-green">£{(getItemPrice(item.name) * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.name)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-2 w-2" />
                        </Button>
                        <span className="text-xs px-2">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item.name, item.category)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => setSelectedCategory("all")}
                  className="w-full"
                  size="sm"
                >
                  View Cart
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