import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, X } from "lucide-react";

const ResponsiveMsgToKitchen = () => {
  const [header, setHeader] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendToKitchen = () => {
    if (!header.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both header and message fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the kitchen successfully",
    });

    // Reset form
    setHeader("");
    setMessage("");
  };

  const handleCancel = () => {
    setHeader("");
    setMessage("");
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-restaurant-green text-xl lg:text-2xl text-center lg:text-left">
            Message to Kitchen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header/Table Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="header" 
              className="text-sm lg:text-base font-medium text-foreground"
            >
              Header / Table
            </Label>
            <Input
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Enter table number or header"
              className="w-full text-base lg:text-sm focus:ring-restaurant-green focus:border-restaurant-green"
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label 
              htmlFor="message" 
              className="text-sm lg:text-base font-medium text-foreground"
            >
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to the kitchen..."
              className="w-full min-h-32 lg:min-h-24 text-base lg:text-sm focus:ring-restaurant-green focus:border-restaurant-green resize-y"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 pt-4">
            <Button 
              onClick={handleSendToKitchen}
              className="flex-1 lg:flex-none bg-restaurant-green hover:bg-restaurant-green-dark text-white font-medium py-3 lg:py-2 text-base lg:text-sm"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              SEND TO KITCHEN
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 lg:flex-none border-restaurant-green text-restaurant-green hover:bg-restaurant-green-light font-medium py-3 lg:py-2 text-base lg:text-sm"
              size="lg"
            >
              <X className="w-4 h-4 mr-2" />
              CANCEL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveMsgToKitchen;