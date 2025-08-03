import { useState } from "react";
import RestaurantHeader from "./RestaurantHeader";
import RestaurantSidebar from "./RestaurantSidebar";
import MsgToKitchen from "./MsgToKitchen";

const RestaurantDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeSection) {
      case "msg-to-kitchen":
        return <MsgToKitchen />;
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-restaurant-green mb-4">Dashboard</h2>
            <p className="text-muted-foreground">Welcome to the restaurant management system.</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-restaurant-green mb-4">
              {activeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader />
      <div className="flex">
        <RestaurantSidebar 
          activeItem={activeSection} 
          onItemSelect={setActiveSection} 
        />
        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;