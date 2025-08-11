import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import biryaniImage1 from "@/assets/biryani-bg-1.jpg";
import biryaniImage2 from "@/assets/biryani-bg-2.jpg";

interface LoginPageProps {
  onLogin: (userName: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [biryaniImage1, biryaniImage2];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }
    
    // Simple password validation (any random number)
    if (!/^\d+$/.test(password)) {
      toast.error("Password must be a number");
      return;
    }
    
    toast.success(`Welcome ${name}!`);
    onLogin(name.trim());
  };

  const switchBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Background Switch Button */}
      <Button
        onClick={switchBackground}
        className="absolute top-4 right-4 z-10 bg-restaurant-green hover:bg-restaurant-green-dark"
        size="sm"
      >
        Switch Background
      </Button>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-restaurant-green/20 shadow-2xl z-10">
        <CardHeader className="text-center space-y-4">
          <div className="bg-restaurant-green text-white px-4 py-2 rounded-lg font-bold text-lg mx-auto w-fit">
            POS
          </div>
          <CardTitle className="text-2xl lg:text-3xl font-bold text-restaurant-green">
            Nawabi Hyderabad House
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Please login to access the restaurant management system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-restaurant-green font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-restaurant-green/20 focus:border-restaurant-green"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-restaurant-green font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter any number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-restaurant-green/20 focus:border-restaurant-green"
                autoComplete="current-password"
              />
              <p className="text-xs text-muted-foreground">
                For demo purposes, enter any number as password
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-restaurant-green hover:bg-restaurant-green-dark text-white font-medium py-2"
            >
              Login to POS System
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Restaurant Info */}
      <div className="absolute bottom-4 left-4 text-white z-10">
        <h3 className="text-lg font-semibold">Authentic Hyderabadi Cuisine</h3>
        <p className="text-sm opacity-90">Experience the royal taste of Hyderabad</p>
      </div>
    </div>
  );
};

export default LoginPage;