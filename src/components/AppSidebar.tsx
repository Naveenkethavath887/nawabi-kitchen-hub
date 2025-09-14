import { 
  Home, 
  MessageSquare, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  Edit, 
  Truck, 
  UtensilsCrossed, 
  Package, 
  FileText, 
  Settings 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", id: "dashboard", icon: Home },
  { title: "Msg to Kitchen", id: "msg-to-kitchen", icon: MessageSquare },
  { title: "Take Away", id: "take-away", icon: ShoppingBag },
  { title: "Reservations", id: "reservations", icon: Calendar },
  { title: "New Dine IN", id: "new-dine-in", icon: Plus },
  { title: "Edit Dine IN", id: "edit-dine-in", icon: Edit },
  { title: "Delivery", id: "delivery", icon: Truck },
  { title: "Menu", id: "menu", icon: UtensilsCrossed },
  { title: "Stock", id: "stock", icon: Package },
  { title: "Reports", id: "reports", icon: FileText },
  { title: "Administration", id: "administration", icon: Settings },
];

interface AppSidebarProps {
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  userName: string;
}

export function AppSidebar({ activeItem, onItemSelect, userName }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (itemId: string) => activeItem === itemId;

  return (
    <Sidebar 
      className="border-r border-restaurant-green-dark bg-restaurant-green"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Welcome Message */}
        {!collapsed && (
          <div className="p-3 border-b border-restaurant-green-dark">
            <p className="text-white/90 text-sm font-medium">Welcome {userName}</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-sm font-semibold px-3 py-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onItemSelect(item.id)}
                    className={`text-white hover:bg-restaurant-green-dark py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.id) 
                        ? "bg-restaurant-green-dark font-semibold shadow-md" 
                        : "hover:shadow-sm"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}