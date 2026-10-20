import { useEffect, useState } from "react";

import api from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";


function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.HELLO);

        setMessage(response.data.message);
      } catch (err) {
        setError("Unable to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    };

    fetchHello();
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Student Brand Platform
        </h1>

        {loading && (
          <p className="mt-4 text-gray-500">
            Connecting to backend...
          </p>
        )}

        {!loading && message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

        {!loading && error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
