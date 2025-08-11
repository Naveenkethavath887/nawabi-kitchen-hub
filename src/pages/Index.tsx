import ResponsiveRestaurantDashboard from "@/components/ResponsiveRestaurantDashboard";

interface IndexProps {
  userName: string;
  onLogout: () => void;
}

const Index = ({ userName, onLogout }: IndexProps) => {
  return <ResponsiveRestaurantDashboard userName={userName} onLogout={onLogout} />;
};

export default Index;
