import React, { useState, useEffect } from "react";
import { Article } from "../../Types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill's CSS
import NewsSliderA from "../NewsComponents/NewsSliderA";

const NewsPanel = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>(""); // This will store HTML formatted content
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [isLatest, setIsLatest] = useState<boolean>(false); // New state for the checkbox
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Set article data when selected
  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title);
      setContent(selectedArticle.content); // Populate formatted content
      setImageUrl(selectedArticle.image_url);
      setIsSecond(selectedArticle.isSecond || false);
      setIsLatest(false); // Reset the latest checkbox
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsSecond(false);
      setIsLatest(false);
    }
  }, [selectedArticle]);

  // Custom toolbar for ReactQuill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Headers (h1, h2, h3)
      ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough
      [{ list: "ordered" }, { list: "bullet" }], // Lists (ordered, bullet)
      ["blockquote", "code-block"], // Blockquote, code block
      [{ script: "sub" }, { script: "super" }], // Subscript, superscript
      ["link"], // Links, images
      [{ align: [] }], // Alignment
      ["clean"], // Remove formatting
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "script",
    "sub",
    "super",
    "link",
    "align",
  ];

  // Handle article submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const articleData = {
      title,
      content,
      image_url: imageUrl,
      isSecond,
    };

    try {
      console.log("Submitting article data:", articleData); // Log article data

      // If "Ustaw artykuł jako najnowszy" is checked
      if (isLatest && selectedArticle) {
        // Delete the existing article
        const deleteResponse = await fetch(
          `http://localhost:5000/api/articles/${selectedArticle._id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Nie udało się usunąć istniejącego artykułu");
        }

        // Create a new article
        const response = await fetch("http://localhost:5000/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("Error response:", errorResponse); // Log error response
          throw new Error("Nie udało się zapisać nowego artykułu");
        }
      } else {
        // Update the article normally
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
          const errorResponse = await response.json();
          console.error("Error response:", errorResponse); // Log error response
          throw new Error("Nie udało się zapisać artykułu");
        }
      }

      // Clear the input fields
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsSecond(false);
      setIsLatest(false); // Reset the checkbox after submission

      alert(
        selectedArticle
          ? "Artykuł zaktualizowany pomyślnie!"
          : "Artykuł dodany pomyślnie!"
      );

      window.location.reload();
    } catch (error) {
      console.error("Error occurred during submission:", error); // Log full error
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć artykuł?");
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/articles/${selectedArticle._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się usunąć artykułu");
      }

      alert("Artykuł usunięty pomyślnie!");

      setTitle("");
      setContent("");
      setImageUrl("");
      setIsSecond(false);
      setIsLatest(false); // Reset the checkbox after deletion

      window.location.reload();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <ReactQuill
              value={content} // Set the value to the formatted content
              onChange={setContent} // Update state on change
              theme="snow"
              modules={modules} // Pass the custom toolbar modules
              formats={formats} // Define the formats allowed
              className="bg-white text-black"
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
          <div>
            <label htmlFor="isSecond" className="mb-1 text-white">
              Czy artykuł ma być na pozycji drugiej:
            </label>
            <input
              type="checkbox"
              id="isSecond"
              checked={isSecond}
              onChange={(e) => setIsSecond(e.target.checked)}
              className="border rounded p-2 ml-5"
            />
          </div>
          {selectedArticle && (
            <div>
              <label htmlFor="isLatest" className="mb-1 text-white">
                Ustaw artykuł jako najnowszy:
              </label>
              <input
                type="checkbox"
                id="isLatest"
                checked={isLatest}
                onChange={(e) => setIsLatest(e.target.checked)}
                className="border rounded p-2 ml-5"
              />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-200 w-full"
            >
              {loading ? "Zapisywanie..." : "Zapisz artykuł"}
            </button>
            {selectedArticle && (
              <>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 text-white p-2 mt-4 rounded hover:bg-red-200 w-full"
                >
                  {loading ? "Usuwanie..." : "Usuń artykuł"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  disabled={loading}
                  className="bg-gray-500 text-white p-2 mt-4 rounded hover:bg-gray-300 w-full"
                >
                  {loading ? "Resetowanie..." : "Nowy artykuł"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      <div className="w-3/4 mx-auto">
        <NewsSliderA onClick={setSelectedArticle} />
      </div>
    </>
  );
};

export default NewsPanel;
