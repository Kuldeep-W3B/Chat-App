import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios.get('http://localhost:5000/profile', { withCredentials: true }) // Include credentials in the request
      .then(response => {
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        // Handle 401 Unauthorized error here
        setId(null);
        setUsername(null);
      })
      .finally(() => setLoading(false)); // Update loading state
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
