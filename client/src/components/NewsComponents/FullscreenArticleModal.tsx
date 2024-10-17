import React from "react";
import { motion } from "framer-motion";

interface FullscreenArticleModalProps {
  article: {
    title: string;
    content: string;
    image_url: string;
  };
  onClose: () => void; // Handler to close the modal
}

const FullscreenArticleModal: React.FC<FullscreenArticleModalProps> = ({
  article,
  onClose,
}) => {
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

        {/* Article content */}
        <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
        <img
          src={article.image_url}
          alt={article.title}
          className="mx-auto min-h-[30vw] max-h-[60vh] object-contain rounded mb-4"
        />
        <div
          className="article-content text-base leading-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </motion.div>
  );
};

export default FullscreenArticleModal;
