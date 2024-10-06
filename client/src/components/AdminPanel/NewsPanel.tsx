import React, { useState } from "react";
import { useUser } from "../UserContext";

const NewsPanel: React.FC = () => {
  const { userFullName } = useUser();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Prepare the data to be sent as JSON
    const articleData = {
      title,
      content,
      author_id: userFullName, // Ensure this is the correct user identifier
      image_url: imageUrl,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(articleData), // Convert article data to JSON string
      });
  
      if (!response.ok) {
        throw new Error("Failed to add article");
      }

      // Reset form fields after successful submission
      setTitle("");
      setContent("");
      setImageUrl("");
      alert("Article added successfully!");
    } catch (error) {
      setError((error as Error).message); // Type assertion for error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel w-3/4 mx-auto bg-gray-700 p-5 rounded-lg m-12">
      <h2 className="text-2xl font-semibold text-white mb-5">
        Dodaj artykuł do aktualności
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-white">
            Tytuł:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1 text-white">
            Tekst:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block mb-1 text-white">
            URL do zdjęcia:
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-200"
        >
          {loading ? "Dodawanie..." : "Dodaj artykuł"}
        </button>
      </form>
    </div>
  );
};

export default NewsPanel;
