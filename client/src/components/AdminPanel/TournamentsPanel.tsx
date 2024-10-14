import React, { useState } from "react";
import CalendarC from "../TournamentComponents/Calendar";

interface Event {
  _id?: string;
  name: string;
  date: Date;
  type: "blitz" | "rapid" | "classical" | "bullet";
  round_number: number;
  place: string;
  page: string;
}

const TournamentsPanel: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState<string>("blitz"); // Default to "blitz"
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [place, setPlace] = useState<string>("");
  const [page, setPage] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDateChange = (date: Date, events: Event[]) => {
    if (events.length > 0) {
      const event = events[0]; // Use the first event directly
      setSelectedEvent(event);
      setName(event.name);
      setDate(event.date);
      setType(event.type);
      setRoundNumber(event.round_number);
      setPlace(event.place);
      setPage(event.page);
    } else {
      setSelectedEvent(null);
      setName("");
      setDate(null);
      setType("blitz");
      setRoundNumber(0);
      setPlace("");
      setPage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for existing tournaments on the same date
    if (date) {
      // Convert CET date to UTC for comparison and storage
      const utcDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const dateString = utcDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format

      const existingResponse = await fetch(
        `http://localhost:5000/api/tournaments?date=${dateString}`
      );

      if (!existingResponse.ok) {
        setError("Nie udało się pobrać istniejących turniejów");
        setLoading(false);
        return;
      }

      const existingTournaments = await existingResponse.json();

      if (existingTournaments.length > 0) {
        alert("Turniej już istnieje w tym dniu. Proszę wybrać inny termin.");
        setLoading(false);
        return;
      }
    }

    const tournamentData: Event = {
      _id: selectedEvent?._id, // Include _id for updates
      name,
      date: date ? new Date(date) : new Date(),
      type: type as "blitz" | "rapid" | "classical" | "bullet",
      round_number: roundNumber,
      place,
      page,
    };

    if (isNaN(tournamentData.date.getTime())) {
      setError("Podano nieprawidłową datę");
      setLoading(false);
      return;
    }

    try {
      if (tournamentData._id) {
        // Update existing tournament
        const updateResponse = await fetch(
          `http://localhost:5000/api/tournaments/${tournamentData._id}`,
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
        // Create new tournament
        const postResponse = await fetch(
          "http://localhost:5000/api/tournaments",
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

      // Clear form
      setName("");
      setDate(null);
      setType("blitz");
      setRoundNumber(0);
      setPlace("");
      setPage("");
      setSelectedEvent(null); // Reset selected event after submit

      // Reload the page to fetch updated data
      window.location.reload();
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
          `http://localhost:5000/api/tournaments/${selectedEvent._id}`,
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
        window.location.reload();
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
              required
              className="border rounded p-2 w-full"
            >
              <option value="blitz">Blitz</option>
              <option value="rapid">Rapid</option>
              <option value="classical">Classical</option>
              <option value="bullet">Bullet</option>
            </select>
          </div>
          <div>
            <label htmlFor="roundNumber" className="block mb-1 text-white">
              Liczba rund:
            </label>
            <input
              type="number"
              id="roundNumber"
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
              Strona turnieju:
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
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-200"
          >
            {loading
              ? "Przetwarzanie..."
              : selectedEvent
              ? "Zaktualizuj turniej"
              : "Dodaj turniej"}
          </button>
        </form>
        {selectedEvent && (
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-700 w-full"
          >
            Usuń turniej
          </button>
        )}
      </div>
      <CalendarC onDateChange={handleDateChange} />
    </>
  );
};

export default TournamentsPanel;
