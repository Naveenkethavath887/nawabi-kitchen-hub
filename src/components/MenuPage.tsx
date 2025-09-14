import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MenuPage = () => {
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
        "Perugu Vada (Yogurt)",
        "Sambar Vada",
        "Uttapam",
        "Poori + Aloo Pitala",
        "Chole Batture",
        "Idly Vada Combo"
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
        "Coke / Pepsi / Sprite / 7up",
        "Thumsup / Limca",
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

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-restaurant-green mb-2">
          Nawabi Menu
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Authentic Hyderabadi Cuisine - Royal Taste of Hyderabad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {menuCategories.map((category, index) => (
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
                    <p className="text-sm lg:text-base text-foreground font-medium">
                      {item}
                    </p>
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

      <div className="mt-8 text-center">
        <p className="text-xs lg:text-sm text-muted-foreground">
          All dishes are prepared with authentic spices and traditional cooking methods
        </p>
      </div>
    </div>
  );
};

export default MenuPage;