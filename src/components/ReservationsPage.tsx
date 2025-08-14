import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]}`;
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Generate week days with auto-updated dates
  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      week.push(`${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`);
    }
    return week;
  };

  // Generate time slots from 12:00 PM to 9:45 PM
  const timeSlots = [];
  for (let hour = 12; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 45) break;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const timeStr = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      timeSlots.push(timeStr);
    }
  }

  // Generate table numbers 1 to 25
  const tables = Array.from({ length: 25 }, (_, i) => `Table ${i + 1}`);

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
        <CardHeader className="bg-restaurant-green text-white p-3">
          <CardTitle className="text-lg font-bold text-center">
            Table Reservations
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3">
          {/* Date and Customer Info Section - Fixed at top */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
            {/* Date Selection */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Date
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                  <ChevronDown className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent>
                  {getWeekDates().map((date) => (
                    <SelectItem key={date} value={date} className="text-sm">{date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* First Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                First Name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="h-8 text-sm"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Last Name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="h-8 text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Phone Number
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="h-8 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1 justify-end">
              <Button 
                className="h-8 text-sm font-semibold bg-restaurant-green hover:bg-restaurant-green-dark"
                disabled={!selectedSlot || !firstName || !lastName || !phoneNumber}
              >
                CONFIRM
              </Button>
              <Button 
                variant="outline" 
                className="h-8 text-sm font-semibold"
                onClick={() => {
                  setSelectedSlot(null);
                  setFirstName("");
                  setLastName("");
                  setPhoneNumber("");
                }}
              >
                CANCEL
              </Button>
            </div>
          </div>

          {/* Reservation Grid - Only this section scrolls */}
          <div className="border rounded-lg overflow-auto max-h-[500px]">
            <div className="min-w-[2000px]">
              {/* Time Header - Sticky */}
              <div className="grid grid-cols-[80px_repeat(40,minmax(60px,1fr))] bg-muted border-b sticky top-0 z-10">
                <div className="p-1 font-semibold text-xs border-r bg-background sticky left-0 z-20">
                  Table/Time
                </div>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="p-1 text-center font-medium text-xs border-r last:border-r-0 bg-muted"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {tables.map((table) => (
                <div
                  key={table}
                  className="grid grid-cols-[80px_repeat(40,minmax(60px,1fr))] border-b last:border-b-0 hover:bg-muted/30"
                >
                  <div className="p-1 font-medium text-xs bg-background border-r sticky left-0 z-10">
                    {table}
                  </div>
                  {timeSlots.map((time) => (
                    <button
                      key={`${table}-${time}`}
                      onClick={() => handleSlotClick(table, time)}
                      className={`p-0.5 border-r last:border-r-0 transition-colors hover:bg-restaurant-green-light min-h-[30px] ${
                        isSlotSelected(table, time)
                          ? "bg-restaurant-green text-white"
                          : "bg-background hover:bg-restaurant-green/10"
                      }`}
                    >
                      <div className="w-full h-4"></div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Slot Info */}
          {selectedSlot && (
            <div className="mt-3 p-2 bg-restaurant-green-light rounded-lg">
              <p className="text-sm font-medium text-restaurant-green-dark">
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