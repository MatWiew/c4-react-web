import React, { useState, useCallback } from "react";
import Calendar from "rsuite/Calendar";
import "rsuite/dist/rsuite.min.css";
import "./Calendar.css";
import Pawn from "../../assets/Pawn";
import Bishop from "../../assets/Bishop";
import Knight from "../../assets/Knight";
import Queen from "../../assets/Queen";
import King from "../../assets/King";
import Rook from "../../assets/Rook";
import CustomCalendarHeader from "./CustomCalendarHeader";
import CustomMonthHeader from "./CustomMonthHeader";

interface Event {
  name: string;
  date: Date;
  type: "blitz" | "rapid" | "classical" | "bullet";
  round_number: number;
  place: string;
  page: string;
  icon: "pawn" | "bishop" | "knight" | "queen" | "king" | "rook";
}

const CalendarC: React.FC<{
  events: Event[]; // Accept events as a prop
  onDateChange?: (date: Date, events: Event[]) => void;
}> = ({ events, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getEventsForDay = useCallback(
    (date: Date): Event[] => {
      const normalizeDate = (date: Date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          console.error("Invalid date:", date); // Log invalid dates
          throw new Error("Invalid date passed to normalizeDate");
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };

      const normalizedDate = normalizeDate(date);

      return events.filter((event) => {
        const eventDate = normalizeDate(event.date);
        return eventDate.getTime() === normalizedDate.getTime();
      });
    },
    [events]
  );

  const renderCell = (date: Date): React.ReactNode => {
    try {
      const list = getEventsForDay(date);

      if (list.length) {
        return (
          <div className="absolute w-12 h-5">
            {list.map((event, index) => {
              let IconComponent;

              // Map the icon string to the corresponding component
              switch (event.icon) {
                case "pawn":
                  IconComponent = Pawn;
                  break;
                case "bishop":
                  IconComponent = Bishop;
                  break;
                case "knight":
                  IconComponent = Knight;
                  break;
                case "queen":
                  IconComponent = Queen;
                  break;
                case "king":
                  IconComponent = King;
                  break;
                case "rook":
                  IconComponent = Rook;
                  break;
                default:
                  return null;
              }

              return (
                <IconComponent
                  key={index}
                  size={18}
                  className="absolute right-0 transform translate-x-1/2 -translate-y-1/2 z-10"
                />
              );
            })}
          </div>
        );
      }

      return null;
    } catch (error) {
      console.error("Error rendering cell for date:", date, error);
      return null;
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    const eventsForDate = getEventsForDay(date);
    if (onDateChange) {
      onDateChange(date, eventsForDate);
    }
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return (
    <div className="relative max-w-[500px] w-full top-[-40px] mx-auto">
      <CustomMonthHeader month={month} year={year} />
      <CustomCalendarHeader />
      <Calendar
        compact
        isoWeek
        renderCell={renderCell}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default CalendarC;
