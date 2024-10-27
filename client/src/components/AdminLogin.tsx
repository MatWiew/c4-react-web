import React, { useState } from "react";
import { useUser } from "./UserContext"; // Import the useUser hook

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { setUserFullName } = useUser(); // Get the setUserFullName function from context
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserFullName(data.fullName); // Set the full name from the response
        onLoginSuccess();
      } else {
        setError(data.message);
        console.error(data.message);
      }
    } catch (error) {
      setError("Server error. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute flex mx-auto h-[300px] bg-gray-700 rounded-lg p-5 w-[40vw] ml-[30vw] max-lg:w-[40vw] max-lg:ml-[30vw] max-md:w-[60vw] max-md:ml-[20vw] max-sm:w-[80vw] max-sm:ml-[10vw] mt-[100px]">
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-between mx-auto w-2/3 h-full"
      >
        <h2 className="mb-5 text-white text-xl text-center">
          Logowanie do panelu admina
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="flex flex-col gap-[20px]">
          <div>
            <input
              type="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
