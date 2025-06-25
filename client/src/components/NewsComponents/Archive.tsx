import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FullscreenArticleModal from "./FullscreenArticleModal";

const Archive: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { articleId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/articles`
        );
        const data = await response.json();

        const sortedArticles = data.sort((a: any, b: any) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setArticles(sortedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  const handleArticleClick = (article: any) => {
    navigate(`/news/article/${article._id}`);
  };

  const handleModalClose = () => {
    navigate("/news"); 
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

        <h1 className="text-3xl font-bold mb-10 text-center">
          Archiwum naszych aktualności
        </h1>

        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {articles.map((article) => (
              <motion.li
                key={article._id}
                className="flex items-center cursor-pointer rounded-lg border-2 border-black border-solid hover:border-dashed p-4"
                onClick={() => handleArticleClick(article)}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <span className="text-xl">{article.title}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Show modal if articleId is in URL */}
      {articleId && (
        <FullscreenArticleModal
          articleId={articleId.replace("article:", "")}
          onClose={handleModalClose}
        />
      )}
    </motion.div>
  );
};

export default Archive;
