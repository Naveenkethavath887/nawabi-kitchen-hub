import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState("Sunday 27 July");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Generate time slots from 12:00 to 19:45
  const timeSlots = [];
  for (let hour = 12; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 19 && minute > 45) break;
      const timeStr = `${hour}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeStr);
    }
  }

  // Generate table numbers
  const tables = Array.from({ length: 20 }, (_, i) => `TAB ${(i + 1).toString().padStart(2, '0')}`);

  const handleSlotClick = (table: string, time: string) => {
    const slotId = `${table}-${time}`;
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const isSlotSelected = (table: string, time: string) => {
    return selectedSlot === `${table}-${time}`;
  };

  return (
    <div className="p-4 lg:p-8 max-w-full mx-auto">
      <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-restaurant-green text-white p-6 lg:p-8">
          <CardTitle className="text-2xl lg:text-3xl xl:text-4xl font-bold text-center">
            Table Reservations
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 lg:p-8">
          {/* Date and Customer Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm lg:text-base xl:text-lg font-medium text-foreground">
                Date
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-12 lg:h-14 text-base lg:text-lg">
                  <SelectValue />
                  <ChevronDown className="h-5 w-5 lg:h-6 lg:w-6" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunday 27 July">Sunday 27 July</SelectItem>
                  <SelectItem value="Monday 28 July">Monday 28 July</SelectItem>
                  <SelectItem value="Tuesday 29 July">Tuesday 29 July</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm lg:text-base xl:text-lg font-medium text-foreground">
                First & SurName
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter name"
                className="h-12 lg:h-14 text-base lg:text-lg"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm lg:text-base xl:text-lg font-medium text-foreground">
                Phone Number
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone"
                className="h-12 lg:h-14 text-base lg:text-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 justify-end">
              <Button 
                className="h-12 lg:h-14 text-base lg:text-lg font-semibold bg-restaurant-green hover:bg-restaurant-green-dark"
                disabled={!selectedSlot || !firstName || !phoneNumber}
              >
                CONFIRM
              </Button>
              <Button 
                variant="outline" 
                className="h-12 lg:h-14 text-base lg:text-lg font-semibold border-2"
                onClick={() => {
                  setSelectedSlot(null);
                  setFirstName("");
                  setPhoneNumber("");
                }}
              >
                CANCEL
              </Button>
            </div>
          </div>

          {/* Reservation Grid */}
          <div className="border rounded-lg overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Time Header */}
              <div className="grid grid-cols-[100px_repeat(32,1fr)] bg-muted border-b">
                <div className="p-2 lg:p-3 font-semibold text-sm lg:text-base xl:text-lg border-r bg-background">
                  Table/Time
                </div>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="p-2 lg:p-3 text-center font-medium text-xs lg:text-sm xl:text-base border-r last:border-r-0"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {tables.map((table) => (
                <div
                  key={table}
                  className="grid grid-cols-[100px_repeat(32,1fr)] border-b last:border-b-0 hover:bg-muted/30"
                >
                  <div className="p-2 lg:p-3 font-medium text-sm lg:text-base xl:text-lg bg-background border-r">
                    {table}
                  </div>
                  {timeSlots.map((time) => (
                    <button
                      key={`${table}-${time}`}
                      onClick={() => handleSlotClick(table, time)}
                      className={`p-2 lg:p-3 border-r last:border-r-0 transition-colors hover:bg-restaurant-green-light ${
                        isSlotSelected(table, time)
                          ? "bg-restaurant-green text-white"
                          : "bg-background hover:bg-restaurant-green/10"
                      }`}
                    >
                      <div className="w-full h-6 lg:h-8 xl:h-10"></div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Slot Info */}
          {selectedSlot && (
            <div className="mt-6 p-4 lg:p-6 bg-restaurant-green-light rounded-lg">
              <p className="text-base lg:text-lg xl:text-xl font-medium text-restaurant-green-dark">
                Selected: {selectedSlot.replace('-', ' at ')}
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default ReservationsPage;