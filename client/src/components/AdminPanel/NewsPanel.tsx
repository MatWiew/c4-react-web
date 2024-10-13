import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Article } from "../../Types";

interface NewsPanelProps {
  selectedArticle: Article | null; // Accept selected article as prop
}

const NewsPanel: React.FC<NewsPanelProps> = ({ selectedArticle }) => {
  const { userFullName } = useUser();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title);
      setContent(selectedArticle.content);
      setImageUrl(selectedArticle.image_url);
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
    }
  }, [selectedArticle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const articleData = {
      title,
      content,
      author_id: userFullName,
      image_url: imageUrl,
    };

    try {
      const response = selectedArticle
        ? await fetch(
            `http://localhost:5000/api/articles/${selectedArticle._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(articleData),
            }
          )
        : await fetch("http://localhost:5000/api/articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(articleData),
          });

      if (!response.ok) {
        throw new Error("Nie udało się zapisać artykułu");
      }

      // Clear form fields
      setTitle("");
      setContent("");
      setImageUrl("");

      alert(
        selectedArticle
          ? "Artykuł zaktualizowany pomyślnie!"
          : "Artykuł dodany pomyślnie!"
      );

      // Reload the page to fetch updated data
      window.location.reload();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel w-3/4 mx-auto bg-gray-700 p-5 rounded-lg m-12">
      <h2 className="text-2xl font-semibold text-white mb-5">
        {selectedArticle ? "Edytuj artykuł" : "Dodaj artykuł do aktualności"}
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
          {loading ? "Dodawanie..." : "Zapisz artykuł"}
        </button>
      </form>
    </div>
  );
};

export default NewsPanel;
