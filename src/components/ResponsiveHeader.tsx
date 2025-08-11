import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

interface ResponsiveHeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  userName: string;
  onLogout: () => void;
}

const ResponsiveHeader = ({ isMobileMenuOpen, onToggleMobileMenu, userName, onLogout }: ResponsiveHeaderProps) => {
  return (
    <header className="bg-restaurant-green border-b border-restaurant-green-dark h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm relative z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMobileMenu}
          className="lg:hidden text-white hover:bg-white/10 p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
        
        <div className="bg-restaurant-green-dark px-2 py-1 rounded text-white font-bold text-xs lg:text-sm">
          POS
        </div>
        <h1 className="text-white font-semibold text-sm lg:text-lg truncate">
          Nawabi Hyderabad House
        </h1>
      </div>
      
      {/* Center Section - Hidden on mobile, visible on tablet+ */}
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
  );
};

export default ResponsiveHeader;