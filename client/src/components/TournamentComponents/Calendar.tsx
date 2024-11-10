import React, { useEffect, useState, useCallback } from "react";
import Calendar from "rsuite/Calendar";
import "rsuite/dist/rsuite.min.css";
import "./Calendar.css";
import Pawn from "../../assets/TournamentAssets/Pawn";
import Bishop from "../../assets/TournamentAssets/Bishop";
import Knight from "../../assets/TournamentAssets/Knight";
import Queen from "../../assets/TournamentAssets/Queen";
import King from "../../assets/TournamentAssets/King";
import Rook from "../../assets/TournamentAssets/Rook";
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
  onDateChange?: (date: Date, events: Event[]) => void;
}> = ({ onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/tournaments`
        );
        const data: Event[] = await response.json();

        const convertedEvents = data.map((event) => ({
          ...event,
          date: new Date(event.date),
        }));

        setEvents(convertedEvents);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      }
    };

    fetchEvents();
  }, []);

  const getEventsForDay = useCallback(
    (date: Date): Event[] => {
      const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const normalizedDate = normalizeDate(date);

      return events.filter((event) => {
        const eventDate = normalizeDate(event.date);

        return (
          eventDate.getDate() === normalizedDate.getDate() &&
          eventDate.getMonth() === normalizedDate.getMonth() &&
          eventDate.getFullYear() === normalizedDate.getFullYear()
        );
      });
    },
    [events]
  );

  const renderCell = (date: Date): React.ReactNode => {
    const list = getEventsForDay(date);

    if (list.length) {
      return (
        <div className="absolute w-12 h-5">
          {list.map((event, index) => {
            let IconComponent;
            let iconSize;
            let colorClass;

            // Map the icon string to the corresponding component and color
            switch (event.icon) {
              case "pawn":
                IconComponent = Pawn;
                iconSize = 38;
                colorClass = "bg-orange-500";
                break;
              case "bishop":
                IconComponent = Bishop;
                iconSize = 57;
                colorClass = "bg-lime-500";
                break;
              case "knight":
                IconComponent = Knight;
                iconSize = 57;
                colorClass = "bg-teal-500";
                break;
              case "queen":
                IconComponent = Queen;
                iconSize = 65;
                colorClass = "bg-blue-500";
                break;
              case "king":
                IconComponent = King;
                iconSize = 65;
                colorClass = "bg-violet-500";
                break;
              case "rook":
                IconComponent = Rook;
                iconSize = 58;
                colorClass = "bg-yellow-400";
                break;
              default:
                return null;
            }

            return (
              <div
                className={`rounded-[100%] p-1 absolute right-0 transform translate-x-[25px] ${
                  event.icon === "pawn"
                    ? "-translate-y-[22px]"
                    : event.icon === "queen" || event.icon === "king"
                    ? "-translate-y-[31px]"
                    : "-translate-y-[27px]"
                }`}
                key={index}
              >
                <IconComponent
                  size={iconSize}
                  className={`z-50 absolute ${
                    event.icon === "bishop"
                      ? "ml-1.5"
                      : event.icon === "knight"
                      ? "ml-2"
                      : "ml-3"
                  }`}
                />
                <div
                  className={`${colorClass} rounded-full h-10 w-10 right-0 transform -translate-x-[25px] z-10 relative ${
                    event.icon === "pawn"
                      ? "translate-y-[10px]"
                      : event.icon === "queen" || event.icon === "king"
                      ? "translate-y-[19px]"
                      : "translate-y-[15px]"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
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
