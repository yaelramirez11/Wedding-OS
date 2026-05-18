import { useEffect, useState } from "react";

function Home() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/guests")
      .then((res) => res.json())
      .then((data) => {
        setGuests(data);
      });
  }, []);

  return (
    <main>
      <h1>WeddingOS</h1>

      {guests.map((guest) => (
        <div key={guest.id}>
          <p>{guest.name}</p>
        </div>
      ))}
    </main>
  );
}

export default Home;
