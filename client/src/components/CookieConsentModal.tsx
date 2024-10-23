import React from "react";
import { motion } from "framer-motion";

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4" // Adjusted for bottom left corner
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
        >
          <h2 className="text-lg font-bold mb-2">Informacja o ciasteczkach</h2>
          <p className="mb-4">
            Korzystając z tej strony, akceptujesz naszą politykę prywatności
            oraz używanie plików cookie.
          </p>
          <div
            className="bg-blue-500 text-white rounded py-2 px-4"
            onClick={onClose}
          >
            Akceptuję
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CookieConsentModal;
