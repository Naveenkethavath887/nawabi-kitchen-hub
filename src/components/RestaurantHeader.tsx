import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const RestaurantHeader = () => {
  return (
    <header className="bg-restaurant-green border-b border-restaurant-green-dark h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-restaurant-green-dark px-3 py-1 rounded text-white font-bold text-sm">
          POS
        </div>
        <h1 className="text-white font-semibold text-lg">
          Nawabi Hyderabad House
        </h1>
      </div>
      
      <div className="text-white font-medium">
        WELCOME Pavan Jonnala
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </header>
  );
};

export default RestaurantHeader;