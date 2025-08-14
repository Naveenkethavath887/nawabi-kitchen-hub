import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import ResponsiveMsgToKitchen from "./ResponsiveMsgToKitchen";
import ReservationsPage from "./ReservationsPage";
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
      case "reservations":
        return <ReservationsPage />;
      case "dashboard":
        return (
          <div className="p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-restaurant-green mb-6 lg:mb-8">
                Dashboard
              </h2>
              <div className="bg-card rounded-xl p-8 lg:p-10 xl:p-12 shadow-lg border">
                <p className="text-muted-foreground text-lg lg:text-xl xl:text-2xl mb-8">
                  Welcome to the restaurant management system.
                </p>
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  <div className="bg-restaurant-green-light p-6 lg:p-8 rounded-xl text-center shadow-sm">
                    <h3 className="font-semibold text-restaurant-green text-lg lg:text-xl xl:text-2xl">Today's Orders</h3>
                    <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-restaurant-green-dark mt-3">24</p>
                  </div>
                  <div className="bg-restaurant-green-light p-6 lg:p-8 rounded-xl text-center shadow-sm">
                    <h3 className="font-semibold text-restaurant-green text-lg lg:text-xl xl:text-2xl">Active Tables</h3>
                    <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-restaurant-green-dark mt-3">8</p>
                  </div>
                  <div className="bg-restaurant-green-light p-6 lg:p-8 rounded-xl text-center shadow-sm">
                    <h3 className="font-semibold text-restaurant-green text-lg lg:text-xl xl:text-2xl">Revenue</h3>
                    <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-restaurant-green-dark mt-3">₹12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-restaurant-green mb-6 lg:mb-8 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <div className="bg-card rounded-xl p-8 lg:p-10 xl:p-12 shadow-lg border">
                <p className="text-muted-foreground text-lg lg:text-xl xl:text-2xl mb-4">
                  This section is under development.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground">
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
          <header className="bg-restaurant-green border-b border-restaurant-green-dark h-20 lg:h-24 xl:h-28 flex items-center justify-between px-6 lg:px-8 xl:px-10 shadow-lg">
            {/* Left Section */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <SidebarTrigger className="text-white hover:bg-white/10 p-2 lg:p-3" />
              <h1 className="text-white font-bold text-base lg:text-lg xl:text-xl truncate">
                Nawabi Hyderabad House
              </h1>
            </div>
            
            {/* Center Section - Welcome message */}
            <div className="hidden md:block text-white font-semibold text-lg lg:text-xl xl:text-2xl">
              WELCOME {userName.toUpperCase()}
            </div>
            
            {/* Right Section */}
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-base lg:text-lg xl:text-xl font-semibold px-4 lg:px-6 py-2 lg:py-3"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 lg:mr-3" />
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