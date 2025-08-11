import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import ResponsiveMsgToKitchen from "./ResponsiveMsgToKitchen";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ResponsiveRestaurantDashboardProps {
  userName: string;
  onLogout: () => void;
}

const ResponsiveRestaurantDashboard = ({ userName, onLogout }: ResponsiveRestaurantDashboardProps) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeSection) {
      case "msg-to-kitchen":
        return <ResponsiveMsgToKitchen />;
      case "dashboard":
        return (
          <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-restaurant-green mb-4">
                Dashboard
              </h2>
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <p className="text-muted-foreground text-base lg:text-lg">
                  Welcome to the restaurant management system.
                </p>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-restaurant-green-light p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-restaurant-green">Today's Orders</h3>
                    <p className="text-2xl font-bold text-restaurant-green-dark mt-2">24</p>
                  </div>
                  <div className="bg-restaurant-green-light p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-restaurant-green">Active Tables</h3>
                    <p className="text-2xl font-bold text-restaurant-green-dark mt-2">8</p>
                  </div>
                  <div className="bg-restaurant-green-light p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-restaurant-green">Revenue</h3>
                    <p className="text-2xl font-bold text-restaurant-green-dark mt-2">₹12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-restaurant-green mb-4 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <p className="text-muted-foreground text-base lg:text-lg">
                  This section is under development.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Feature coming soon to enhance your restaurant management experience.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeItem={activeSection} 
          onItemSelect={setActiveSection}
          userName={userName}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-restaurant-green border-b border-restaurant-green-dark h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
            {/* Left Section */}
            <div className="flex items-center space-x-3">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <h1 className="text-white font-semibold text-sm lg:text-lg truncate">
                Nawabi Hyderabad House
              </h1>
            </div>
            
            {/* Center Section - Welcome message */}
            <div className="hidden md:block text-white font-medium text-sm lg:text-base">
              WELCOME {userName}
            </div>
            
            {/* Right Section */}
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs lg:text-sm"
              onClick={onLogout}
            >
              <LogOut className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResponsiveRestaurantDashboard;