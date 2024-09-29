import React, { useState } from "react";
import { motion } from "framer-motion";
import Send from "../../assets/Send";

const MessageForm: React.FC = () => {
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState(""); // State for email
  const [message, setMessage] = useState(""); // State for message
  const [error, setError] = useState(""); // State for email errors
  const [nameError, setNameError] = useState(""); // State for name error

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
          // Optionally clear the form or show a success message
          setName("");
          setEmail("");
          setMessage(""); // Clear the message textarea
        } else {
          console.error("Error sending email");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-4/5">
      <input
        type="text"
        placeholder="Imię"
        value={name} // Bind name state
        onChange={handleNameChange} // Handle name input change
        className="block mx-auto bg-transparent text-gray-300 w-full m-5 border-b border-t-0 border-r-0 border-l-0 border-gray-500 focus:border-b-2 focus:border-gray-500 focus:ring-0"
      />
      {nameError && (
        <p className="absolute text-red-500 text-sm top-[230px]">{nameError}</p>
      )}
      <input
        type="email"
        placeholder="Adres e-mail"
        value={email}
        onChange={handleEmailChange}
        className="block mx-auto bg-transparent text-gray-300 w-full m-5 border-b border-t-0 border-r-0 border-l-0 border-gray-500 focus:border-b-2 focus:border-gray-500 focus:ring-0"
      />
      {error && (
        <p className="absolute text-red-500 text-sm top-[291px]">{error}</p>
      )}
      <label className="text-gray-500 mx-auto text-base ml-3">Wiadomość</label>
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
  );
};

export default MessageForm;
