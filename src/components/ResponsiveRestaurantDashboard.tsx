import { useState } from "react";
import ResponsiveHeader from "./ResponsiveHeader";
import ResponsiveSidebar from "./ResponsiveSidebar";
import ResponsiveMsgToKitchen from "./ResponsiveMsgToKitchen";

const ResponsiveRestaurantDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
    <div className="min-h-screen bg-background">
      <ResponsiveHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />
      
      <div className="flex relative">
        <ResponsiveSidebar 
          activeItem={activeSection} 
          onItemSelect={setActiveSection}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobile={handleCloseMobileMenu}
        />
        
        <main className="flex-1 lg:ml-0">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default ResponsiveRestaurantDashboard;