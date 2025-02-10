import React, { useState, useEffect } from "react";
import CalendarC from "../TournamentComponents/CalendarA";
import Pawn from "../../assets/TournamentAssets/Pawn";
import Bishop from "../../assets/TournamentAssets/Bishop";
import Knight from "../../assets/TournamentAssets/Knight";
import Queen from "../../assets/TournamentAssets/Queen";
import King from "../../assets/TournamentAssets/King";
import Rook from "../../assets/TournamentAssets/Rook";

interface Event {
  _id?: string;
  name: string;
  date: Date;
  type: "blitz" | "rapid" | "classical" | "bullet";
  round_number: number;
  place: string;
  page: string;
  icon: "pawn" | "bishop" | "knight" | "queen" | "king" | "rook";
}

const iconComponents = {
  pawn: Pawn,
  bishop: Bishop,
  knight: Knight,
  queen: Queen,
  king: King,
  rook: Rook,
};

const TournamentsPanel: React.FC = () => {
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState<string>("blitz"); // Default to "blitz"
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [place, setPlace] = useState<string>("");
  const [page, setPage] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [icon, setIcon] = useState<
    "pawn" | "bishop" | "knight" | "queen" | "king" | "rook"
  >("pawn");

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/tournaments`
      );
      if (!response.ok) throw new Error("Failed to fetch tournaments");
      const data: Event[] = await response.json();
      const convertedEvents = data.map((event) => ({
        ...event,
        date: new Date(event.date), // Ensure this is a valid date
      }));
      setTournaments(convertedEvents);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDateChange = (date: Date, events: Event[]) => {
    date.setHours(10, 0, 0, 0);
    if (events.length > 0) {
      const event = events[0]; // Use the first event directly
      setSelectedEvent(event);
      setName(event.name);
      setDate(event.date);
      setType(event.type);
      setRoundNumber(event.round_number);
      setPlace(event.place);
      setPage(event.page);
      setIcon(event.icon); // Set the icon when editing
    } else {
      setSelectedEvent(null);
      setName("");
      setDate(date);
      setType("blitz");
      setRoundNumber(0);
      setPlace("");
      setPage("");
      setIcon("pawn"); // Reset icon
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for existing tournaments on the same date
    if (date) {
      const utcDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const dateString = utcDate.toISOString().split("T")[0];

      const existingResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/tournaments?date=${dateString}`
      );
      if (!existingResponse.ok) {
        setError("Nie udało się pobrać istniejących turniejów");
        setLoading(false);
        return;
      }

      const existingTournaments: Event[] = await existingResponse.json();

      // If updating an existing tournament, exclude it from the existing check
      if (
        existingTournaments.length > 0 &&
        selectedEvent &&
        existingTournaments.some((event) => event._id !== selectedEvent._id)
      ) {
        alert("Turniej już istnieje w tym dniu. Proszę wybrać inny termin.");
        setLoading(false);
        return;
      }
    }

    const tournamentData: Event = {
      _id: selectedEvent?._id,
      name,
      date: date ? new Date(date) : new Date(),
      type: type as "blitz" | "rapid" | "classical" | "bullet",
      round_number: roundNumber,
      place,
      page,
      icon,
    };

    if (isNaN(tournamentData.date.getTime())) {
      setError("Podano nieprawidłową datę");
      setLoading(false);
      return;
    }

    try {
      if (tournamentData._id) {
        const updateResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/tournaments/${tournamentData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tournamentData),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Nie udało się zaktualizować turnieju");
        }
        alert("Turniej zaktualizowany pomyślnie!");
      } else {
        const postResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/tournaments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tournamentData),
          }
        );

        if (!postResponse.ok) {
          throw new Error("Nie udało się dodać turnieju");
        }
        alert("Turniej dodany pomyślnie!");
      }

      // Fetch updated tournaments after submission
      await fetchTournaments();
      // Reset form fields after submission
      setName("");
      setDate(null);
      setType("blitz");
      setRoundNumber(0);
      setPlace("");
      setPage("");
      setSelectedEvent(null);
      setIcon("pawn"); // Reset icon after submit
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent?._id) {
      const confirmDelete = window.confirm(
        "Czy na pewno chcesz usunąć ten turniej?"
      );
      if (!confirmDelete) return;

      try {
        const deleteResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/tournaments/${selectedEvent._id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Nie udało się usunąć turnieju");
        }
        alert("Turniej usunięty pomyślnie!");
        setSelectedEvent(null);
        setName("");
        setDate(null);
        setType("blitz");
        setRoundNumber(0);
        setPlace("");
        setPage("");
        // Fetch updated tournaments after deletion
        await fetchTournaments();
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const formatDateToLocal = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <div className="admin-panel w-3/4 mx-auto bg-gray-700 p-5 rounded-lg m-12 mt-[100px] mb-[20px]">
        <h2 className="text-2xl font-semibold text-white mb-5">
          Dodaj turniej
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-white">
              Nazwa:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1 text-white">
              Data:
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date ? formatDateToLocal(date) : ""}
              onChange={(e) => setDate(new Date(e.target.value))}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="type" className="block mb-1 text-white">
              Typ turnieju:
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as "blitz" | "rapid" | "classical" | "bullet"
                )
              }
              className="border rounded p-2 w-full"
            >
              <option value="blitz">Blitz</option>
              <option value="rapid">Rapid</option>
              <option value="classical">Classical</option>
              <option value="bullet">Bullet</option>
            </select>
          </div>
          <div>
            <label htmlFor="round_number" className="block mb-1 text-white">
              Numer rundy:
            </label>
            <input
              type="number"
              id="round_number"
              value={roundNumber}
              onChange={(e) => setRoundNumber(Number(e.target.value))}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="place" className="block mb-1 text-white">
              Miejsce:
            </label>
            <input
              type="text"
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="page" className="block mb-1 text-white">
              Strona:
            </label>
            <input
              type="text"
              id="page"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-white">Ikona turnieju:</label>
            {/* Icon buttons */}
            <div className="flex flex-wrap space-x-4 w-full">
              {Object.entries(iconComponents).map(([key, IconComponent]) => (
                <div
                  key={key}
                  className={`icon-button ${icon === key ? "selected" : ""}`}
                  onClick={() =>
                    setIcon(
                      key as
                        | "pawn"
                        | "bishop"
                        | "knight"
                        | "queen"
                        | "king"
                        | "rook"
                    )
                  }
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    border:
                      icon === key ? "2px solid blue" : "2px solid transparent",
                    backgroundColor:
                      icon === key ? "rgba(0, 255, 44, 0.1)" : "transparent",
                    transition: "background-color 0.2s",
                  }}
                >
                  <IconComponent
                    size={100}
                    className="w-full h-[50px] transform translate-x-[6px] translate-y-[10px]"
                  />
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded p-2">
            {selectedEvent ? "Zaktualizuj turniej" : "Dodaj turniej"}
          </button>
        </form>
        {selectedEvent && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white rounded p-2 mt-4 w-full"
          >
            Usuń turniej
          </button>
        )}
      </div>
      <CalendarC events={tournaments} onDateChange={handleDateChange} />
      <p className="mt-9 px-12">
        <span
          style={{ color: "#facc15" }}
          className="block mt-2 whitespace-pre"
        >
          <Rook
            size={40}
            className="absolute min-[482px]:left-[35px] left-[60vw]"
          />{" "}
          - Nasze turnieje
        </span>
        <span style={{ color: "#448efd" }} className="block whitespace-pre mt-4">
          <Queen
            size={55}
            className="absolute min-[482px]:left-[35px] left-[49vw] mt-[-3px]"
          />{" "}
          - Rozgrywki ligowe
        </span>
        <span style={{ color: "#913bfe" }} className="block whitespace-pre mt-4">
          <King
            size={55}
            className="absolute min-[482px]:left-[33px] left-[54vw] mt-[-3px]"
          />{" "}
          - Turnieje rangi mistrzowskiej
        </span>
      </p>
    </>
  );
};

export default TournamentsPanel;
