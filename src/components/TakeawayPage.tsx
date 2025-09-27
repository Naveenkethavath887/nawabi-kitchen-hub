import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [showSidesDialog, setShowSidesDialog] = useState(false);
  const [selectedMainCourse, setSelectedMainCourse] = useState<{name: string, category: string} | null>(null);

  const menuCategories = [
    {
      title: "Veg Appetisers",
      items: [
        { name: "Onion Bajji", price: "€7.95" },
        { name: "Gobi Manchurian", price: "€8.95" },
        { name: "Crispy Corn", price: "€7.95" },
        { name: "Paneer Tikka", price: "€10.95" },
        { name: "Chilly Paneer", price: "€10.95" },
        { name: "Paneer 65", price: "€10.95" }
      ]
    },
    {
      title: "Non-Veg Appetisers",
      items: [
        { name: "Chicken Manchurian", price: "€9.95" },
        { name: "Chicken Lollipop", price: "€10.95" },
        { name: "Chicken Wings", price: "€9.95" },
        { name: "Chilly Chicken", price: "€10.95" },
        { name: "Chicken Tikka", price: "€10.95" },
        { name: "Cashew Chicken", price: "€10.95" },
        { name: "Prawns Tikka", price: "€13.95" }
      ]
    },
    {
      title: "Veg Main Course",
      items: [
        { name: "Kadai Mixed Veg", price: "€13.95" },
        { name: "Dal Tadka", price: "€10.95" },
        { name: "Nizami Veg Korma", price: "€12.95" },
        { name: "Paneer Butter Masala", price: "€20.95" },
        { name: "Paneer Tikka Masala", price: "€20.95" }
      ]
    },
    {
      title: "Non-Veg Main Course",
      items: [
        { name: "Chicken Curry", price: "€17.95" },
        { name: "Butter Chicken", price: "€18.50" },
        { name: "Chicken Butter Masala", price: "€18.95" },
        { name: "Andhra Chicken Curry", price: "€18.95" },
        { name: "Andhra Boneless Chicken Curry", price: "€20.95" },
        { name: "Nizami Chicken Boneless", price: "€19.95" }
      ]
    },
    {
      title: "Biryanis",
      items: [
        { name: "Egg Biryani", price: "€17.95" },
        { name: "Veg Biryani", price: "€17.95" },
        { name: "Chicken Biryani", price: "€21.95" },
        { name: "Mutton Biryani", price: "€24.95" },
        { name: "Prawns Biryani", price: "€24.95" },
        { name: "Nawabi Lamb Biryani", price: "€24.95" },
        { name: "Vijayawada Boneless Biryani", price: "€22.95" },
        { name: "Special Biryani (Chicken)", price: "€25.50" },
        { name: "Special Biryani (Mutton)", price: "€25.50" },
        { name: "Special Biryani (Prawn)", price: "€25.50" },
        { name: "Special Biryani (Lamb)", price: "€25.50" }
      ]
    },
    {
      title: "Tiffins",
      items: [
        { name: "Idly", price: "€6.95" },
        { name: "Medu Vada (2 pcs)", price: "€7.95" },
        { name: "Sambar Idly", price: "€8.95" },
        { name: "Sambar Vada", price: "€9.95" },
        { name: "Plain Dosa", price: "€9.95" },
        { name: "Masala Dosa", price: "€10.95" },
        { name: "Onion Dosa", price: "€10.95" },
        { name: "Paneer Dosa", price: "€11.95" },
        { name: "Rava Dosa", price: "€11.95" },
        { name: "Onion Rava Dosa", price: "€12.95" },
        { name: "Mysore Masala Dosa", price: "€12.95" },
        { name: "Ghee Roast Dosa", price: "€13.95" },
        { name: "Pesarattu Upma Dosa", price: "€13.95" },
        { name: "Family Dosa", price: "€21.95" }
      ]
    },
    {
      title: "Kids Menu",
      items: [
        { name: "Chicken Goujons (7)", price: "€7.95" },
        { name: "Fish Fingers (4)", price: "€7.95" },
        { name: "Chicken Nuggets (7)", price: "€7.95" },
        { name: "Kids Masala Dosa", price: "€6.95" }
      ]
    },
    {
      title: "Sides",
      items: [
        { name: "Plain Naan", price: "€3.25" },
        { name: "Butter Naan", price: "€3.50" },
        { name: "Garlic Naan", price: "€4.00" },
        { name: "Peshawari Naan", price: "€4.50" },
        { name: "Special Baghara Rice", price: "€6.95" }
      ]
    },
    {
      title: "Desserts",
      items: [
        { name: "Double Ka Meeta", price: "€4.95" },
        { name: "Gulab Jamun (2 pcs)", price: "€4.95" }
      ]
    },
    {
      title: "Beverages",
      items: [
        { name: "Coke", price: "€3.50" },
        { name: "Fanta", price: "€3.50" },
        { name: "Sprite", price: "€3.50" },
        { name: "Water", price: "€3.50" },
        { name: "Sweet Lassi", price: "€4.95" },
        { name: "Salt Lassi", price: "€4.95" }
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
        return parseFloat(item.price.replace('€', ''));
      }
    }
    return 0;
  };

  const addToCart = (itemName: string, categoryTitle: string) => {
    if (!isAdmin) {
      toast.error("Only admin can create orders");
      return;
    }

    // Check if this is a main course item
    if (categoryTitle === "Veg Main Course" || categoryTitle === "Non-Veg Main Course") {
      setSelectedMainCourse({ name: itemName, category: categoryTitle });
      setShowSidesDialog(true);
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

  const addMainCourseWithSide = (sideItemName: string) => {
    if (!selectedMainCourse) return;

    setCart(prevCart => {
      const existingMainCourse = prevCart.find(item => item.name === selectedMainCourse.name);
      const existingSide = prevCart.find(item => item.name === `${sideItemName} (Complimentary)`);
      
      let newCart = [...prevCart];
      
      if (existingMainCourse) {
        newCart = newCart.map(item =>
          item.name === selectedMainCourse.name 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...newCart, { name: selectedMainCourse.name, category: selectedMainCourse.category, quantity: 1 }];
      }
      
      if (existingSide) {
        newCart = newCart.map(item =>
          item.name === `${sideItemName} (Complimentary)` 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...newCart, { name: `${sideItemName} (Complimentary)`, category: "Sides", quantity: 1 }];
      }
      
      return newCart;
    });
    
    setShowSidesDialog(false);
    setSelectedMainCourse(null);
    toast.success(`Added ${selectedMainCourse.name} with complimentary ${sideItemName} to cart`);
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
    return cart.reduce((total, item) => {
      if (item.name.includes('(Complimentary)')) {
        return total; // Complimentary items are free
      }
      return total + (getItemPrice(item.name) * item.quantity);
    }, 0);
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
    <div className="min-h-screen bg-gradient-to-br from-restaurant-green-light via-background to-muted">
      <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-restaurant-green to-restaurant-green-dark bg-clip-text text-transparent mb-4">
            Takeaway Menu
          </h1>
          
          {/* Customer Info Section - Only show for admin */}
          {isAdmin && (
            <Card className="mb-6 border-restaurant-green/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-restaurant-green">Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border-restaurant-green/30 focus:border-restaurant-green"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="border-restaurant-green/30 focus:border-restaurant-green"
                  />
                  <Input
                    placeholder="Collection Time"
                    value={collectionTime}
                    onChange={(e) => setCollectionTime(e.target.value)}
                    className="border-restaurant-green/30 focus:border-restaurant-green"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`mb-2 transition-all duration-300 ${
                selectedCategory === "all" 
                  ? "bg-restaurant-green hover:bg-restaurant-green-dark shadow-lg" 
                  : "border-restaurant-green/30 text-restaurant-green hover:bg-restaurant-green-light"
              }`}
            >
              All
            </Button>
            {menuCategories.map((category) => (
              <Button 
                key={category.title}
                variant={selectedCategory === category.title.toLowerCase().replace(/[\s-]/g, '') ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.title.toLowerCase().replace(/[\s-]/g, ''))}
                className={`mb-2 transition-all duration-300 ${
                  selectedCategory === category.title.toLowerCase().replace(/[\s-]/g, '') 
                    ? "bg-restaurant-green hover:bg-restaurant-green-dark shadow-lg" 
                    : "border-restaurant-green/30 text-restaurant-green hover:bg-restaurant-green-light"
                }`}
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
                  <Card key={index} className="h-fit border-restaurant-green/20 bg-gradient-to-br from-card to-restaurant-green-light/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base lg:text-lg font-semibold text-restaurant-green flex items-center gap-2">
                        {category.title}
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 ${getItemTypeColor(category.title)} border-2`}
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
                              className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                                isAdmin ? 'hover:bg-restaurant-green-light/20 hover:shadow-sm cursor-pointer border border-transparent hover:border-restaurant-green/30' : ''
                              }`}
                              onClick={() => isAdmin && addToCart(item.name, category.title)}
                            >
                              <div className="flex-1">
                                <p className="text-sm lg:text-base text-foreground font-medium">
                                  {item.name}
                                </p>
                                <p className="text-sm text-restaurant-green font-semibold">
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
              /* Fullscreen category view with 3 columns + cart */
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Items grid - 3 columns */}
                <div className="xl:col-span-3">
                  <div className="space-y-6">
                    {filteredCategories.map((category, index) => (
                      <div key={index} className="w-full">
                        <div className="mb-6">
                          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-restaurant-green to-restaurant-green-dark bg-clip-text text-transparent flex items-center gap-3">
                            {category.title}
                            <Badge 
                              variant="outline" 
                              className={`text-sm px-3 py-1 ${getItemTypeColor(category.title)} border-2`}
                            >
                              {category.items.length} items
                            </Badge>
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.items.map((item, itemIndex) => (
                            <Card 
                              key={itemIndex} 
                              className={`h-fit transition-all duration-300 border-restaurant-green/20 hover:border-restaurant-green/50 ${
                                isAdmin ? 'hover:shadow-xl hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-restaurant-green-light/30' : 'bg-card'
                              }`}
                              onClick={() => isAdmin && addToCart(item.name, category.title)}
                            >
                              <CardContent className="p-6">
                                <div className="text-center">
                                  <h3 className="text-base lg:text-lg font-semibold text-foreground mb-3 line-clamp-2">
                                    {item.name}
                                  </h3>
                                  <p className="text-xl font-bold text-restaurant-green">
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
                </div>
                
                {/* Cart Section - 4th column */}
                {isAdmin && (
                  <div className="xl:col-span-1">
                    <Card className="sticky top-4 border-restaurant-green/30 bg-gradient-to-br from-card to-restaurant-green-light/20 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-restaurant-green">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Cart ({getTotalItems()})
                          </div>
                          <div className="text-sm font-semibold">
                            €{getTotalPrice().toFixed(2)}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Cart Items */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {cart.length === 0 ? (
                            <div className="text-center py-8">
                              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-muted-foreground text-sm">Cart is empty</p>
                            </div>
                          ) : (
                            cart.map((item, index) => (
                              <div key={index} className="flex justify-between items-center p-3 border border-restaurant-green/20 rounded-lg bg-restaurant-green-light/30">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.category}</p>
                                   <p className="text-xs text-restaurant-green font-semibold">
                                     {item.name.includes('(Complimentary)') ? 'Free' : `€${(getItemPrice(item.name.replace(' (Complimentary)', '')) * item.quantity).toFixed(2)}`}
                                   </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromCart(item.name)}
                                    className="h-7 w-7 p-0 border-restaurant-green/30"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium px-2">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addToCart(item.name, item.category)}
                                    className="h-7 w-7 p-0 border-restaurant-green/30"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div className="border-t border-restaurant-green/20 pt-4">
                             <div className="flex justify-between items-center text-lg font-semibold mb-4">
                               <span>Total:</span>
                               <span className="text-restaurant-green">€{getTotalPrice().toFixed(2)}</span>
                             </div>
                            <Button 
                              onClick={handleCreateOrder}
                              className="w-full bg-restaurant-green hover:bg-restaurant-green-dark text-white"
                              disabled={cart.length === 0 || !customerName.trim()}
                            >
                              Create Order
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Cart - Only shown in 'All' view */}
          {isAdmin && selectedCategory === "all" && (
            <div className="xl:col-span-1">
              <Card className="sticky top-4 border-restaurant-green/30 bg-gradient-to-br from-card to-restaurant-green-light/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-restaurant-green">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart ({getTotalItems()})
                    </div>
                     <div className="text-sm font-semibold">
                       €{getTotalPrice().toFixed(2)}
                     </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-sm">Cart is empty</p>
                      </div>
                    ) : (
                      cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-restaurant-green/20 rounded-lg bg-restaurant-green-light/30">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                           <p className="text-xs text-restaurant-green font-semibold">
                             {item.name.includes('(Complimentary)') ? 'Free' : `€${(getItemPrice(item.name.replace(' (Complimentary)', '')) * item.quantity).toFixed(2)}`}
                           </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.name)}
                              className="h-7 w-7 p-0 border-restaurant-green/30"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium px-2">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item.name, item.category)}
                              className="h-7 w-7 p-0 border-restaurant-green/30"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-restaurant-green/20 pt-4">
                       <div className="flex justify-between items-center text-lg font-semibold mb-4">
                         <span>Total:</span>
                         <span className="text-restaurant-green">€{getTotalPrice().toFixed(2)}</span>
                       </div>
                      <Button 
                        onClick={handleCreateOrder}
                        className="w-full bg-restaurant-green hover:bg-restaurant-green-dark text-white"
                        disabled={cart.length === 0 || !customerName.trim()}
                      >
                        Create Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sides Selection Dialog */}
        <Dialog open={showSidesDialog} onOpenChange={setShowSidesDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-restaurant-green">
                Choose Your Complimentary Side
              </DialogTitle>
              <p className="text-muted-foreground">
                Select one complimentary side dish with your {selectedMainCourse?.name}
              </p>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {menuCategories.find(cat => cat.title === "Sides")?.items.map((sideItem, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-restaurant-green/20 hover:border-restaurant-green/50"
                  onClick={() => addMainCourseWithSide(sideItem.name)}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-foreground mb-2">{sideItem.name}</h3>
                    <p className="text-sm text-restaurant-green font-semibold">Complimentary</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
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
