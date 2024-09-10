import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import CalendarC from "./TournamentComponents/Calendar";
import Knight from "../assets/Knight";
import Pawn from "../assets/Pawn";

interface Event {
  name: string;
  date: Date;
  type: 'blitz' | 'rapid' | 'classical' | 'bullet';
  round_number: number;
  place: string;
}

const Tournaments = forwardRef<HTMLDivElement>((props, ref) => {
  const [knightSize, setKnightSize] = useState(
    window.innerWidth > 1535 ? 420 : 550
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // States for visibility
  const [isVisibleFirst, setIsVisibleFirst] = useState(false);
  const [isVisibleSecond, setIsVisibleSecond] = useState(false);

  // Refs for the elements to be animated
  const refFirst = useRef(null);
  const refSecond = useRef(null);

  useEffect(() => {
    const currentRefFirst = refFirst.current;
    const currentRefSecond = refSecond.current;

    const observerFirst = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleFirst(true);
          observerFirst.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 }
    );

    const observerSecond = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleSecond(true);
          observerSecond.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 }
    );

    if (currentRefFirst) {
      observerFirst.observe(currentRefFirst);
    }

    if (currentRefSecond) {
      observerSecond.observe(currentRefSecond);
    }

    return () => {
      if (currentRefFirst) {
        observerFirst.unobserve(currentRefFirst);
      }
      if (currentRefSecond) {
        observerSecond.unobserve(currentRefSecond);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setKnightSize(window.innerWidth > 1535 ? 420 : 550);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDateChange = (date: Date, events: Event[]) => {
    if (events.length > 0) {
      setSelectedEvent(events[0]);
    } else {
      setSelectedEvent(null);
    }
  };

  return (
    <div
      id="tournaments"
      className="relative flex items-center justify-between w-90 mx-[7rem] max-lg:mx-[1rem] lg:top-[1850px] md:top-[1140px] top-[1300px]"
      ref={ref}
    >
      <motion.span
          ref={refFirst}
          className="absolute w-full text-outline font-extrabold lg:text-[9vw] text-[10vw] text-center lg:top-[-300px] top-[-150px]"
          initial={{ opacity: 0, bottom: -50 }}
          animate={{
            opacity: isVisibleFirst ? 1 : 0,
            bottom: isVisibleFirst ? 0 : -100,
          }}
          transition={{ duration: 0.5 }}
        >
          TURNIEJE
        </motion.span>
      <div className="flex max-lg:flex-col lg:flex-row max-lg:gap-0 gap-[2vw] max-2xl:justify-center max-2xl:w-full z-10">
        <div className="flex max-lg:mx-auto 2xl:w-[500px] max-w-[450px] max-lg:w-full">
          <CalendarC onDateChange={handleDateChange} />
        </div>
        <div className="relative max-lg:mx-auto 2xl:w-[30vw] max-w-[450px] max-lg:w-full max-w-[1000px] h-[400px] bg-black max-2xl:bg-opacity-70 rounded-lg top-[45px] max-lg:top-0 p-4 text-white">
          <div
            className="absolute flex justify-center items-center rounded-[100%] w-[60px] h-[60px] top-[-30px] left-[20px]"
            style={{ backgroundColor: "#282D35" }}
          >
            <Pawn size={30} className="" />
          </div>
          <div className="flex py-9 px-3 h-full">
            {selectedEvent ? (
              <div>
                <p className="text-xl font-bold mb-5">
                  {selectedEvent.name}
                </p>
                <p className="italic mt-3 text-gray-200">
                  Liczba rund: {selectedEvent.round_number}
                </p>
                <p className="italic mt-3 text-gray-200">
                  Typ: {selectedEvent.type}
                </p>
                <p className="italic mt-3 text-gray-200">
                  Data:{" "}
                  {new Intl.DateTimeFormat("pl-PL", {
                    dateStyle: "short", // or 'medium', 'long' depending on the level of detail you want
                    timeStyle: "short", // or 'medium', 'long' for more detail
                  }).format(selectedEvent.date)}
                </p>
                <p className="italic mt-3 text-gray-400">
                  Miejsce: {selectedEvent.place}
                </p>
              </div>
            ) : (
              <p className="flex-grow w-full text-center my-auto text-lg">
                Kliknij na dzień, obok którego znajduje się
                <Pawn size={30} className="w-full mt-2" />
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute 2xl:h-[420px] h-[600px] rounded-lg 2xl:right-0 mx-auto w-full">
        <Knight size={knightSize} />
      </div>
    </div>
  );
});

export default Tournaments;
