import React, { useState, useEffect } from "react";
import SponsorSectionA from "../FooterComponents/SponsorSectionA";

interface Sponsor {
  _id: string;
  name: string;
  image_url: string;
}

const SponsorPanel: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [name, setName] = useState("");
  const [image_url, setImageUrl] = useState("");

  const fetchSponsors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sponsors");
      if (!response.ok) throw new Error("Failed to fetch sponsors");
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Ensure that name and imageUrl are not empty
    if (!name || !image_url) {
      alert("Please fill in all fields.");
      return;
    }

    const sponsorData: { name: string; image_url: string } = {
      name,
      image_url,
    };

    try {
      const response = await fetch("http://localhost:5000/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorData),
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to add sponsor");
      }

      // Reset the form fields
      setName("");
      setImageUrl("");

      // Refresh the sponsors list after adding
      await fetchSponsors();
    } catch (error) {
      console.error(
        "Error adding sponsor:",
        error instanceof Error ? error.message : "Unknown error"
      );
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        }`
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/sponsors/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete sponsor");
        fetchSponsors();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-5 mt-12 bg-gray-800 text-white rounded-md w-3/4 mx-auto">
      <h2 className="text-2xl mb-4">Dodaj sponsora</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="block mb-1">Nazwa:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-md w-full text-black"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">URL zdjęcia:</label>
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            className="p-2 rounded-md w-full text-black"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 p-2 rounded-md">
          "Dodaj sponsora"
        </button>
      </form>

      <SponsorSectionA />
    </div>
  );
};

export default SponsorPanel;
