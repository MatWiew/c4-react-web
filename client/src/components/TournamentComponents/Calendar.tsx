import React, { useEffect, useState, useCallback } from 'react';
import Calendar from 'rsuite/Calendar';
import 'rsuite/dist/rsuite.min.css';
import './Calendar.css';
import Pawn from '../../assets/Pawn';
import CustomCalendarHeader from './CustomCalendarHeader';
import CustomMonthHeader from './CustomMonthHeader';

interface Event {
  date: Date;
  name: string;
  description: string;
  type: "blitz" | "rapid" | "classical" | "bullet";
}

const CalendarC: React.FC<{ onDateChange?: (date: Date, events: Event[]) => void }> = ({ onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tournaments");
        const data: Event[] = await response.json();

        const convertedEvents = data.map(event => ({
          ...event,
          date: new Date(event.date)
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
      const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const normalizedDate = normalizeDate(date);

      return events.filter(event => {
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
          <Pawn size={18} className="absolute right-0 transform translate-x-1/2 -translate-y-1/2 z-10" />
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
    <div className="relative lg:w-[35vw] max-w-[500px] w-[80vw] top-[-40px]">
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
