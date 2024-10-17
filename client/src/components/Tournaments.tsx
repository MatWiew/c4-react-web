import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import CalendarC from "./TournamentComponents/Calendar";
import Knight from "../assets/Knight";
import Pawn from "../assets/Pawn";
import Bishop from "../assets/Bishop";
import Queen from "../assets/Queen";
import King from "../assets/King";
import Rook from "../assets/Rook";

interface Event {
  name: string;
  date: Date;
  type: "blitz" | "rapid" | "classical" | "bullet";
  round_number: number;
  place: string;
  page: string;
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
      <motion.div
        ref={refSecond}
        initial={{
          opacity: 0,
          width: "120%",
          transform: "translateY(100px)",
        }}
        animate={{
          opacity: isVisibleSecond ? 1 : 0,
          transform: isVisibleSecond ? "translateY(0)" : "translateY(100px)",
          width: "100%",
          gap: "2vw",
        }}
        transition={{ duration: 0.8 }}
        className="flex max-lg:flex-col lg:flex-row max-lg:gap-0 gap-[2vw] max-2xl:justify-center max-2xl:w-[full] z-10"
      >
        <div className="flex max-lg:mx-auto 2xl:w-[500px] max-w-[450px] max-lg:w-full">
          <CalendarC onDateChange={handleDateChange} />
        </div>
        <div className="relative max-lg:mx-auto 2xl:w-[30vw] max-w-[450px] max-lg:w-full max-w-[1000px] h-[350px] bg-black max-2xl:bg-opacity-70 rounded-lg top-[70px] max-lg:top-0 p-4 text-white">
          <div
            className="absolute flex justify-center items-center rounded-[100%] w-[60px] h-[60px] top-[-30px] left-[20px]"
            style={{ backgroundColor: "#282D35" }}
          >
            <Pawn size={30} className="" />
          </div>
          <div className="flex py-9 px-3 h-full text-center">
            {selectedEvent ? (
              <div className="mx-auto">
                <p className="text-xl font-bold mb-5">{selectedEvent.name}</p>
                <p className="italic text-base mt-8">
                  <span className="text-white font-bold">Liczba rund:</span>{" "}
                  <span className="text-gray-200">
                    {selectedEvent.round_number}
                  </span>
                </p>
                <p className="italic text-base mt-5">
                  <span className="text-white font-bold">Typ:</span>{" "}
                  <span className="text-gray-200">{selectedEvent.type}</span>
                </p>
                <p className="italic text-base mt-5">
                  <span className="text-white font-bold">Data:</span>{" "}
                  <span className="text-gray-200">
                    {new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(selectedEvent.date)}
                  </span>
                </p>
                <p className="italic text-base mt-5">
                  <span className="text-white font-bold">Miejsce:</span>{" "}
                  <span className="text-gray-200">{selectedEvent.place}</span>
                </p>
                <motion.a
                  style={{ backgroundColor: "rgba(0,255,209,0.3)" }}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "rgba(0,255,209,0.7)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  href={selectedEvent.page}
                  target="_blank"
                  className="relative block text-white font-bold top-[20px] p-1 rounded-lg active:text-white active:no-underline focus:text-white focus:no-underline hover:text-white hover:no-underline"
                >
                  Strona turnieju
                </motion.a>
              </div>
            ) : (
              <p className="flex-grow w-full my-auto text-lg">
                <h1 className="relative text-xl top-[-40px]">
                  Przeglądaj kalendarz w poszukiwaniu turniejów.
                </h1>
                <div className="">
                  <p className="relative">Szukaj naszych figur szachowych:</p>
                  <div className="flex justify-center mt-2 w-[208px] mx-auto">
                    <Pawn size={30} className="absolute left-[200px]" />
                    <Bishop size={30} className="absolute left-[170px]" />
                    <Knight size={30} className="absolute left-[140px]" />
                    <Queen size={30} className="absolute left-[235px]" />
                    <King size={30} className="absolute left-[260px]" />
                    <Rook size={30} className="absolute left-[290px]" />
                  </div>
                  <p className="mt-9">
                    A następnie kliknij na dzień oznaczony figurą aby dowiedzieć
                    się więcej o turnieju
                  </p>
                </div>
              </p>
            )}
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute 2xl:h-[420px] h-[600px] rounded-lg 2xl:right-0 mx-auto w-full"
        initial={{ opacity: 0, right: "-50px" }}
        animate={{
          opacity: isVisibleSecond ? 1 : 0,
          right: isVisibleSecond ? "0" : "-50px",
        }}
        transition={{ duration: 0.6 }}
      >
        <Knight size={knightSize} />
      </motion.div>
    </div>
  );
});

export default Tournaments;
