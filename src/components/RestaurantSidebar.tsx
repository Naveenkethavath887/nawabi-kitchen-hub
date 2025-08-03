import { cn } from "@/lib/utils";

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

interface RestaurantSidebarProps {
  activeItem: string;
  onItemSelect: (itemId: string) => void;
}

const RestaurantSidebar = ({ activeItem, onItemSelect }: RestaurantSidebarProps) => {
  return (
    <aside className="bg-restaurant-green w-64 min-h-screen border-r border-restaurant-green-dark">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemSelect(item.id)}
            className={cn(
              "w-full text-left px-4 py-3 text-white rounded-md transition-colors duration-200",
              "hover:bg-restaurant-green-dark",
              activeItem === item.id && "bg-restaurant-green-dark font-medium"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default RestaurantSidebar;