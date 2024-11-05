import React, { useState, useEffect } from "react";
import { Article } from "../../Types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill's CSS
import NewsSliderA from "../NewsComponents/NewsSliderA";

const NewsPanel = () => {
  const [articles, setArticles] = useState<Article[]>([]); // State to hold articles
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>(""); // This will store HTML formatted content
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [isLatest, setIsLatest] = useState<boolean>(false); // New state for the checkbox
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/articles`
        );
        if (!response.ok) throw new Error("Error fetching articles");
        const data = await response.json();

        // Convert dates to Date objects
        const formattedData = data.map((article: any) => ({
          ...article,
          created_at: new Date(article.created_at),
          updated_at: new Date(article.updated_at),
        }));

        setArticles(formattedData); // Set the fetched articles
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);
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
      updated_at: new Date(),
    };

    try {
      // If "Ustaw artykuł jako najnowszy" is checked
      if (isLatest && selectedArticle) {
        // Delete the existing article
        const deleteResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/articles/${selectedArticle._id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Nie udało się usunąć istniejącego artykułu");
        }

        // Create a new article
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/articles`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(articleData),
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("Error response:", errorResponse); // Log error response
          throw new Error("Nie udało się zapisać nowego artykułu");
        }

        const newArticle = await response.json(); // Get the new or updated article from response

        // Update articles state
        setArticles((prev) => {
          if (selectedArticle) {
            // Update existing article
            return prev.map((article) =>
              article._id === selectedArticle._id ? { ...newArticle } : article
            );
          }
          // Add new article if no article was selected
          return [...prev, newArticle];
        });
      } else {
        // Update the article normally
        const response = selectedArticle
          ? await fetch(
              `${process.env.REACT_APP_API_URL}/articles/${selectedArticle._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(articleData),
              }
            )
          : await fetch(`${process.env.REACT_APP_API_URL}/articles`, {
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

        // Update articles state
        if (selectedArticle) {
          setArticles((prev) =>
            prev.map((article) =>
              article._id === selectedArticle._id
                ? { ...article, ...articleData }
                : article
            )
          );
        } else {
          const newArticle = await response.json();
          setArticles((prev) => [...prev, newArticle]);
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

      // Remove selection after submission
      setSelectedArticle(null);
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
        `${process.env.REACT_APP_API_URL}/articles/${selectedArticle._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się usunąć artykułu");
      }

      // Update articles state to remove the deleted article
      setArticles((prev) =>
        prev.filter((article) => article._id !== selectedArticle._id)
      );

      alert("Artykuł usunięty pomyślnie!");

      // Clear the input fields
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsSecond(false);
      setIsLatest(false); // Reset the checkbox after deletion

      // Remove selection after deletion
      setSelectedArticle(null);
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
              URL zdjęcia:
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSecond"
              checked={isSecond}
              onChange={(e) => setIsSecond(e.target.checked)}
            />
            <label htmlFor="isSecond" className="ml-2 text-white">
              Ustaw artykuł jako drugi
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLatest"
              checked={isLatest}
              onChange={(e) => setIsLatest(e.target.checked)}
            />
            <label htmlFor="isLatest" className="ml-2 text-white">
              Ustaw artykuł jako najnowszy
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2"
            disabled={loading}
          >
            {selectedArticle ? "Zaktualizuj artykuł" : "Dodaj artykuł"}
          </button>
          {selectedArticle && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white rounded p-2 mt-2"
              >
                Usuń artykuł
              </button>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="bg-gray-500 text-white rounded p-2 mt-2"
              >
                Utwórz nowy
              </button>
            </>
          )}
        </form>
      </div>
      <div className="w-4/5 mx-auto max-w-[1200px]">
        <NewsSliderA articles={articles} onClick={setSelectedArticle} />
      </div>
    </>
  );
};

export default NewsPanel;
