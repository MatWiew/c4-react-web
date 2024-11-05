import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FullscreenArticleModal from "./FullscreenArticleModal"; // Import your modal

const Archive: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [articles, setArticles] = useState<any[]>([]); // Use appropriate type for articles
  const [loading, setLoading] = useState(true); // State for loading
  const [selectedArticle, setSelectedArticle] = useState<any>(null); // State for selected article

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/articles`
        );
        const data = await response.json();

        // Sort articles by created_at date (newest first)
        const sortedArticles = data.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at); // Ensure created_at is a Date object
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order
        });

        setArticles(sortedArticles); // Set the sorted articles
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article); // Set the selected article
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full h-full overflow-y-auto">
        {/* Close button */}
        <motion.a
          className="absolute top-4 right-4 text-white p-2 rounded-full w-10 h-10 z-10 flex items-center justify-center cursor-pointer hover:no-underline hover:text-white"
          initial={{ backgroundColor: "#FF0000" }}
          whileHover={{ scale: 1.2, backgroundColor: "#8B0000" }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          onClick={onClose}
        >
          X
        </motion.a>

        {/* Article list */}
        <h1 className="text-3xl font-bold mb-10 text-center">
          Archiwum naszych aktualności
        </h1>
        {loading ? (
          <p>Loading articles...</p> // Loading state
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {articles.map(
              (article: {
                title: string;
                image_url: string;
                content: string;
              }) => (
                <motion.li
                  key={article.title}
                  className="flex items-center cursor-pointer rounded-lg border-2 border-black border-solid hover:border-dashed p-4"
                  onClick={() => handleArticleClick(article)}
                  whileHover={{ scale: 1.03 }} // Slight scale on hover
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} // Smooth scaling transition
                >
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <span className="text-xl">{article.title}</span>
                </motion.li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Fullscreen modal for selected article */}
      {selectedArticle && (
        <FullscreenArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)} // Close handler for modal
        />
      )}
    </motion.div>
  );
};

export default Archive;
