import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SidebarItem {
  id: string;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "msg-to-kitchen", label: "Msg to Kitchen" },
  { id: "take-away", label: "Take Away" },
  { id: "reservations", label: "Reservations" },
  { id: "new-dine-in", label: "New Dine IN" },
  { id: "edit-dine-in", label: "Edit Dine IN" },
  { id: "delivery", label: "Delivery" },
  { id: "menu", label: "Menu" },
  { id: "stock", label: "Stock" },
  { id: "reports", label: "Reports" },
  { id: "administration", label: "Administration" },
];

interface ResponsiveSidebarProps {
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  isMobileMenuOpen: boolean;
  onCloseMobile: () => void;
}

const ResponsiveSidebar = ({ 
  activeItem, 
  onItemSelect, 
  isMobileMenuOpen, 
  onCloseMobile 
}: ResponsiveSidebarProps) => {
  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        onCloseMobile();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, onCloseMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleItemClick = (itemId: string) => {
    onItemSelect(itemId);
    onCloseMobile(); // Close mobile menu when item is selected
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-restaurant-green border-r border-restaurant-green-dark transition-transform duration-300 ease-in-out z-50",
        "lg:relative lg:translate-x-0", // Always visible on desktop
        "fixed inset-y-0 left-0 w-64", // Fixed position on mobile
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-restaurant-green-dark flex items-center justify-between">
          <h2 className="text-white font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="text-white hover:bg-white/10 p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Welcome Message - Mobile only */}
        <div className="lg:hidden p-4 border-b border-restaurant-green-dark">
          <p className="text-white/90 text-sm">Welcome Pavan Jonnala</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-full text-left px-4 py-3 text-white rounded-md transition-colors duration-200",
                "hover:bg-restaurant-green-dark focus:bg-restaurant-green-dark focus:outline-none",
                "text-sm lg:text-base",
                activeItem === item.id && "bg-restaurant-green-dark font-medium"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;