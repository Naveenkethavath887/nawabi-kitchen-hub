import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MsgToKitchen = () => {
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
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-restaurant-green">Message to Kitchen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="header">Header / Table</Label>
            <Input
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Enter table number or header"
              className="focus:ring-restaurant-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to the kitchen..."
              className="min-h-32 focus:ring-restaurant-green"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={handleSendToKitchen}
              className="bg-restaurant-green hover:bg-restaurant-green-dark text-white"
            >
              SEND TO KITCHEN
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-restaurant-green text-restaurant-green hover:bg-restaurant-green-light"
            >
              CANCEL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MsgToKitchen;