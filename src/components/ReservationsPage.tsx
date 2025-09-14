import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Reservation } from "@/lib/supabase";


const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]}`;
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Load reservations from Supabase on component mount
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed');

        if (error) {
          console.error('Error loading reservations:', error);
          // Fallback to localStorage
          const savedReservations = localStorage.getItem('restaurantReservations');
          if (savedReservations) {
            setReservations(JSON.parse(savedReservations));
          }
        } else {
          setReservations(data || []);
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
        // Fallback to localStorage
        const savedReservations = localStorage.getItem('restaurantReservations');
        if (savedReservations) {
          setReservations(JSON.parse(savedReservations));
        }
      }
    };

    loadReservations();
  }, []);

  // Save reservations to localStorage as backup
  useEffect(() => {
    localStorage.setItem('restaurantReservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleSlotClick = (table: string, time: string) => {
    if (isSlotBooked(table, time)) {
      toast.error("This slot is already booked!");
      return;
    }
    const slotId = `${table}-${time}`;
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const isSlotSelected = (table: string, time: string) => {
    return selectedSlot === `${table}-${time}`;
  };

  const isSlotBooked = (table: string, time: string) => {
    return reservations.some(reservation => 
      reservation.date === selectedDate && 
      reservation.time === time && 
      reservation.table === table &&
      reservation.status === 'confirmed'
    );
  };

  const handleConfirmReservation = async () => {
    if (!selectedSlot || !firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      toast.error("Please fill in all required fields and select a time slot");
      return;
    }

    setIsLoading(true);
    
    try {
      const [table, time] = selectedSlot.split('-');
      
      // Double-check if slot is still available
      if (isSlotBooked(table, time)) {
        toast.error("This slot was just booked by another customer!");
        setSelectedSlot(null);
        return;
      }

      const reservationData: Omit<Reservation, 'id' | 'created_at'> = {
        date: selectedDate,
        time: time,
        table: table,
        customer_name: `${firstName} ${lastName}`,
        customer_email: customerEmail,
        customer_phone: phoneNumber,
        party_size: partySize,
        notes: notes,
        status: 'confirmed'
      };

      // Try to save to Supabase first
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select();

      if (error) {
        console.error('Error creating reservation:', error);
        toast.error("Failed to create reservation. Please try again.");
        return;
      }

      // Update local state with the new reservation
      const newReservation = data[0];
      setReservations(prev => [...prev, newReservation]);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setCustomerEmail("");
      setPhoneNumber("");
      setPartySize(2);
      setNotes("");
      setSelectedSlot(null);
      
      toast.success(`Reservation confirmed for ${table} at ${time} on ${selectedDate}`);
    } catch (error) {
      toast.error("Failed to create reservation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setSelectedSlot(null);
    setFirstName("");
    setLastName("");
    setCustomerEmail("");
    setPhoneNumber("");
    setPartySize(2);
    setNotes("");
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
          {/* Customer Info Section - Fixed at top */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 mb-4">
            {/* Date Selection */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Date *
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
                First Name *
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
                Last Name *
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="h-8 text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email address"
                className="h-8 text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Phone *
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="h-8 text-sm"
              />
            </div>

            {/* Party Size */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Party Size
              </label>
              <Select value={partySize.toString()} onValueChange={(value) => setPartySize(parseInt(value))}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes and Action Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <div className="lg:col-span-2 space-y-1">
              <label className="text-xs font-medium text-foreground">
                Special Requests / Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                className="h-16 text-sm resize-none"
              />
            </div>
            
            <div className="flex flex-col gap-2 justify-end">
              <Button 
                className="h-8 text-sm font-semibold bg-restaurant-green hover:bg-restaurant-green-dark"
                disabled={!selectedSlot || !firstName || !lastName || !phoneNumber || isLoading}
                onClick={handleConfirmReservation}
              >
                {isLoading ? "CONFIRMING..." : "CONFIRM RESERVATION"}
              </Button>
              <Button 
                variant="outline" 
                className="h-8 text-sm font-semibold"
                onClick={handleCancelForm}
                disabled={isLoading}
              >
                CLEAR FORM
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
                      disabled={isSlotBooked(table, time)}
                      className={`p-0.5 border-r last:border-r-0 transition-colors min-h-[30px] text-xs font-medium ${
                        isSlotBooked(table, time)
                          ? "bg-red-100 text-red-800 cursor-not-allowed"
                          : isSlotSelected(table, time)
                          ? "bg-restaurant-green text-white"
                          : "bg-background hover:bg-restaurant-green/10 hover:bg-restaurant-green-light"
                      }`}
                    >
                      <div className="w-full h-4 flex items-center justify-center">
                        {isSlotBooked(table, time) ? "BOOKED" : ""}
                      </div>
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