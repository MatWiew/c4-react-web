import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface Article {
  _id: string;
  title: string;
  content: string;
  image_url: string;
}

interface FullscreenArticleModalProps {
  articleId: string;
  onClose: () => void;
}

const FullscreenArticleModal: React.FC<FullscreenArticleModalProps> = ({
  articleId,
  onClose,
}) => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to load article:", err);
        onClose(); // fallback: close modal if article not found
      }
    };

    if (articleId) fetchArticle();
  }, [articleId, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!article) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full h-full overflow-y-auto">
        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 text-white p-2 rounded-full w-10 h-10 z-10 flex items-center justify-center cursor-pointer hover:no-underline hover:text-white bg-red-600"
          initial={{ backgroundColor: "#FF0000" }}
          whileHover={{ scale: 1.2, backgroundColor: "#8B0000" }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          onClick={onClose}
          aria-label="Close article modal"
        >
          X
        </motion.button>

        {/* Article content */}
        <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
        <img
          src={article.image_url}
          alt={article.title}
          className="mx-auto min-h-[30vw] max-h-[60vh] object-contain rounded mb-4"
        />
        <div
          className="article-content text-base leading-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </motion.div>
  );
};

export default FullscreenArticleModal;
