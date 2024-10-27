import React, { useState, useEffect } from "react";
import LeaderboardA from "../ClubComponents/LeaderboardA";
import { LeaderboardEntry } from "../../Types";

const ClubPanel: React.FC = () => {
  const [topPlayerName, setTopPlayerName] = useState<string>("");
  const [topPlayerRating, setTopPlayerRating] = useState<number | undefined>();
  const [trainerName, setTrainerName] = useState<string>("");
  const [instructors, setInstructors] = useState<
    { _id: string; fullname: string }[]
  >([]);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const handlePlayerSelect = (player: LeaderboardEntry) => {
    setTopPlayerName(player.fullname);
    setTopPlayerRating(player.rating);
    handleEditPlayer(player._id, player.fullname, player.rating ?? 1000);
  };

  // Function to add/update player locally
  const updateLocalPlayers = (player: LeaderboardEntry) => {
    setPlayers((prevPlayers) => {
      const existingPlayerIndex = prevPlayers.findIndex(
        (p) => p._id === player._id
      );
      if (existingPlayerIndex > -1) {
        // Update existing player
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[existingPlayerIndex] = player;
        return updatedPlayers;
      } else {
        // Add new player
        return [...prevPlayers, player];
      }
    });
  };

  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topPlayerName || topPlayerRating === undefined) return;

    try {
      const method = editingPlayerId ? "PUT" : "POST";
      const url = editingPlayerId
        ? `http://localhost:5000/api/topplayers/${editingPlayerId}`
        : "http://localhost:5000/api/topplayers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: topPlayerName,
          rating: topPlayerRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać lub zaktualizować zawodnika");
      }

      // Fetch the updated leaderboard after successful addition/update
      await fetchPlayers();

      // Clear input fields
      setTopPlayerName("");
      setTopPlayerRating(0);
      setEditingPlayerId(null);

      alert(
        editingPlayerId
          ? "Pomyślnie zaktualizowano zawodnika!"
          : "Pomyślnie dodano zawodnika!"
      );
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas dodawania lub aktualizacji zawodnika.");
    }
  };

  const handleEditPlayer = (id: string, name: string, rank: number) => {
    setTopPlayerName(name);
    setTopPlayerRating(rank);
    setEditingPlayerId(id);
  };

  const handleSubmitTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerName) return;

    try {
      const method = editingTrainerId ? "PUT" : "POST";
      const url = editingTrainerId
        ? `http://localhost:5000/api/trainers/${editingTrainerId}`
        : "http://localhost:5000/api/trainers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname: trainerName }),
      });

      if (!response.ok) {
        throw new Error(
          editingTrainerId
            ? "Nie udało się zaktualizować instruktora"
            : "Nie udało się dodać instruktora"
        );
      }

      setTrainerName("");
      setEditingTrainerId(null);
      alert(
        editingTrainerId
          ? "Pomyślnie zaktualizowano instruktora!"
          : "Pomyślnie dodano instruktora!"
      );
      await fetchInstructors(); // Fetch updated instructors after submit
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas dodawania lub aktualizacji instruktora.");
    }
  };

  const handleEditTrainer = (trainer: { _id: string; fullname: string }) => {
    setTrainerName(trainer.fullname);
    setEditingTrainerId(trainer._id);
  };

  const handleDeleteTrainer = async (id: string) => {
    if (window.confirm("Jesteś pewien że chcesz usunąć tego instruktora?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trainers/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Nie udało się usunąć instruktora");
        }
        alert("Pomyślnie usunięto instruktora!");
        await fetchInstructors(); // Fetch updated instructors after deletion
      } catch (error) {
        console.error(error);
        alert("Wystąpił błąd podczas usuwania instruktora.");
      }
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/trainers");
      if (!response.ok) {
        throw new Error("Failed to fetch instructors");
      }
      const data = await response.json();
      setInstructors(
        data.map((trainer: { _id: string; fullname: string }) => ({
          _id: trainer._id,
          fullname: trainer.fullname,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/topplayers");
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      const data = await response.json();
      setPlayers(
        data.map(
          (player: { _id: string; fullname: string; rating: number }) => ({
            _id: player._id,
            fullname: player.fullname,
            rating: player.rating,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchPlayers();
  }, []);

  return (
    <>
      <div className="p-5 mt-12 bg-gray-800 text-white rounded-md w-3/4 mx-auto">
        <h2 className="text-2xl mb-4">Dodaj zawodnika</h2>
        <form onSubmit={handleSubmitPlayer} className="mb-5">
          <div className="mb-3">
            <label className="block mb-1">Imię i Nazwisko:</label>
            <input
              type="text"
              value={topPlayerName}
              onChange={(e) => setTopPlayerName(e.target.value)}
              className="p-2 rounded-md w-full text-black"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Ranking:</label>
            <input
              type="number"
              value={topPlayerRating}
              onChange={(e) => setTopPlayerRating(Number(e.target.value))}
              className="p-2 rounded-md w-full text-black"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 p-2 rounded-md">
            {editingPlayerId ? "Zaktualizuj zawodnika" : "Dodaj zawodnika"}
          </button>
        </form>

        <h2 className="text-2xl mb-4 mt-12">Dodaj lub Edytuj Instruktora</h2>
        <form onSubmit={handleSubmitTrainer}>
          <div className="mb-3">
            <label className="block mb-1">Imię i nazwisko:</label>
            <input
              type="text"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              className="p-2 rounded-md w-full text-black"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 p-2 rounded-md">
            {editingTrainerId ? "Zaktualizuj Instruktora" : "Dodaj Instruktora"}
          </button>
        </form>
      </div>

      <div className="flex max-sm:flex-col justify-center max-sm:gap-[300px] gap-[3vw] max-xl:min-gap align-items h-[500px] relative mx-auto w-[500px] mt-12 w-full">
        <div className="relative sm:left-[-1vw] mx-auto max-sm:w-3/5 min-w-[280px] my-auto mx-auto">
          <LeaderboardA
            players={players}
            onPlayerSelect={handlePlayerSelect}
            onPlayerUpdate={updateLocalPlayers}
          />
        </div>
        <div className="bg-black min-w-[300px] max-sm:w-3/5 max-sm:mx-auto  mx-auto max-xl:bg-opacity-70 h-5/7 sm:my-auto max-sm:mt-[-250px] rounded-lg p-10 max-sm:py-5 text-3xl text-center">
          <p className="text-white">Instruktorzy:</p>
          <div className="h-4/5 flex flex-col justify-between">
            {instructors.length > 0 ? (
              instructors.map((instructor, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-white">{instructor.fullname}</span>
                  <button
                    className="px-1 mx-1 bg-red-600 rounded-lg text-lg"
                    onClick={() => handleDeleteTrainer(instructor._id)}
                  >
                    Usuń
                  </button>
                  <button
                    className="px-1 mx-1 bg-blue-800 rounded-lg text-lg"
                    onClick={() => handleEditTrainer(instructor)}
                  >
                    Edytuj
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-lg">Brak instruktorów</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubPanel;
