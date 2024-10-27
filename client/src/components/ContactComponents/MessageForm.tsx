import React, { useState } from "react";
import { motion } from "framer-motion";
import Send from "../../assets/Send";
import SendIcon from "../../assets/SendIcon";

const MessageForm: React.FC = () => {
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState(""); // State for email
  const [message, setMessage] = useState(""); // State for message
  const [error, setError] = useState(""); // State for email errors
  const [nameError, setNameError] = useState(""); // State for name error
  const [fillEffect, setFillEffect] = useState(false); // State to trigger fill effect
  const [showIcon, setShowIcon] = useState(false); // State to control SendIcon visibility

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Email validation pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name
    if (name.trim() === "") {
      setNameError("Imię jest wymagane");
    } else {
      setNameError("");
    }

    // Validate email
    if (email === "") {
      setError("Adres email jest wymagany");
    } else if (!emailRegex.test(email)) {
      setError("Proszę podać poprawny adres email");
    } else {
      setError("");
    }

    // If both fields are valid, proceed to send email
    if (name && emailRegex.test(email)) {
      try {
        // Example payload with the message from textarea
        const payload = { name, email, message };

        // Sending email request to the server
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // Trigger the fill effect
          setFillEffect(true);

          // Clear the form inputs
          setName("");
          setEmail("");
          setMessage("");

          // Show the icon after the fill animation is done
          setTimeout(() => {
            setShowIcon(true);
          }, 1000); // 1000ms (1 second) to match the animation duration
        } else {
          console.error("Error sending email");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <section className="flex flex-col justify-center items-center px-24 pt-8 pb-1.5 mx-auto w-full text-white rounded-xl bg-neutral-900 max-lg:bg-opacity-80 min-h-[520px] max-md:px-5 max-md:mt-10 max-md:max-w-full overflow-hidden">
      <div className="relative w-4/5 mx-auto">
        <h1 className="max-w-full text-4xl font-black text-center rounded-none w-[512px] max-md:px-5 grid grid-cols-1 max-sm:text-3xl">
          <span>Wyślij do nas</span>
          <span style={{ color: "#DBFF00" }}>wiadomość</span>
        </h1>
        <form onSubmit={handleSubmit} className="overflow-hidden">
          <input
            type="text"
            placeholder="Imię"
            value={name} // Bind name state
            onChange={handleNameChange} // Handle name input change
            className="block mx-auto bg-transparent text-gray-300 w-full m-5 border-b border-t-0 border-r-0 border-l-0 border-gray-500 focus:border-b-2 focus:border-gray-500 focus:ring-0"
          />
          {nameError && (
            <p className="absolute text-red-500 text-sm lg:top-[193px] md:top-[193px] top-[233px]">
              {nameError}
            </p>
          )}
          <input
            type="email"
            placeholder="Adres e-mail"
            value={email}
            onChange={handleEmailChange}
            className="block mx-auto bg-transparent text-gray-300 w-full m-5 border-b border-t-0 border-r-0 border-l-0 border-gray-500 focus:border-b-2 focus:border-gray-500 focus:ring-0"
          />
          {error && (
            <p className="absolute text-red-500 text-sm lg:top-[253px] md:top-[253px] top-[293px]">
              {error}
            </p>
          )}
          <label className="text-gray-500 mx-auto text-base ml-3">
            Wiadomość
          </label>
          <textarea
            rows={5}
            value={message} // Bind message state
            onChange={handleMessageChange} // Handle message input change
            className="block bg-transparent mx-auto w-full rounded-lg focus:border-2 focus:border-gray-500 focus:ring-0 resize-none"
          ></textarea>
          <motion.button
            type="submit"
            className="flex items-center justify-center space-x-4 mt-12 text-center mx-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <p>Wyślij</p>
            <Send size={30} color={"white"} />
          </motion.button>
        </form>
      </div>
      {/* Red overlay animation */}
      {fillEffect && (
        <motion.div
          className="absolute inset-0 bg-neutral-900 z-10 rounded-xl max-[768px]:mt-10"
          initial={{
            width: 0,
            height: 0,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }} // Start from the center
          animate={{
            width: "100%",
            height: "100%",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }} // Expand to fill
          transition={{ type: "spring", duration: 1 }} // Adjust duration for the effect
        />
      )}

      {/* Show SendIcon after fill effect */}
      {showIcon && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 w-full max-[768px]:mt-[100px]"
          initial={{ y: 0 }} // Initial position
          animate={{ y: -20 }} // Move up by 20px
          transition={{ type: "spring", duration: 0.5 }} // Animation duration
        >
          <SendIcon />
          <motion.p
            className="flex text-white mt-2 text-[1rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
          >
            Dziękujemy za wiadomość!
          </motion.p>
        </motion.div>
      )}
    </section>
  );
};

export default MessageForm;
