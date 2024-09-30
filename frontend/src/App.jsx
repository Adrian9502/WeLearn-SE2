import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => setMessage(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">{message}</h1>
    </div>
  );
}

export default App;
