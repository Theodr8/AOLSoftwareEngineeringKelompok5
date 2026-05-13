import React, { useEffect, useState } from 'react';

// types.ts or inside App.tsx
interface BackendResponse {
  message: string;
  status: number;
}

const App: React.FC = () => {
  // Define the state type using our Interface
  const [data, setData] = useState<BackendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/message');
        const result: BackendResponse = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Backend Message: {data?.message}</h1>
    </div>
  );
};

export default App;