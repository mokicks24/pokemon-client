import { useState, useEffect } from "react";

/*
  
*/
const typeEffectiveness = {
  Fire: {
    strong: ["Grass", "Ice", "Bug", "Steel"],
    weak: ["Water", "Rock", "Ground"]
  },
  Water: {
    strong: ["Fire", "Rock", "Ground"],
    weak: ["Electric", "Grass"]
  },
  Grass: {
    strong: ["Water", "Rock", "Ground"],
    weak: ["Fire", "Ice", "Bug", "Flying"]
  },
  Electric: {
    strong: ["Water", "Flying"],
    weak: ["Ground"]
  }
};

//  API base URL from Vite env
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    type: "",
    level: "",
    evolution_line: ""
  });

  // Fetch Pokémon from API
  const fetchPokemon = () => {
    fetch(`${API_URL}/api/pokemon`)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE Pokémon
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/pokemon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        type:
          formData.type.charAt(0).toUpperCase() +
          formData.type.slice(1).toLowerCase(),
        level: Number(formData.level)
      })
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({
          name: "",
          nickname: "",
          type: "",
          level: "",
          evolution_line: ""
        });
        fetchPokemon();
      })
      .catch((err) => console.error(err));
  };

  // DELETE Pokémon
  const deletePokemon = (id) => {
    fetch(`${API_URL}/api/pokemon/${id}`, {
      method: "DELETE"
    })
      .then(() => fetchPokemon())
      .catch((err) => console.error(err));
  };

  // UPDATE Pokémon (Level Up)
  const levelUpPokemon = (p) => {
    fetch(`${API_URL}/api/pokemon/${p.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: p.name,
        nickname: p.nickname,
        type: p.type,
        level: p.level + 1,
        evolution_line: p.evolution_line
      })
    })
      .then(() => fetchPokemon())
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h1>Pokédex</h1>

      <h2>Add Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="nickname"
          placeholder="Nickname"
          value={formData.nickname}
          onChange={handleChange}
        />

        <input
          name="type"
          placeholder="Type (Fire, Water, Grass, Electric)"
          value={formData.type}
          onChange={handleChange}
        />

        <input
          name="level"
          type="number"
          placeholder="Level"
          value={formData.level}
          onChange={handleChange}
        />

        <input
          name="evolution_line"
          placeholder="Evolution line (e.g. Charmander -> Charmeleon -> Charizard)"
          value={formData.evolution_line}
          onChange={handleChange}
        />

        <button type="submit">Add Pokémon</button>
      </form>

      <h2>My Pokémon</h2>

      {pokemon.length === 0 ? (
        <p>No Pokémon found</p>
      ) : (
        <ul>
          {pokemon.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> (Level {p.level})

              {p.evolution_line && (
                <div style={{ fontSize: "0.9em", color: "#555", marginTop: "4px" }}>
                  Evolution: {p.evolution_line}
                </div>
              )}

              {typeEffectiveness[p.type] && (
                <div style={{ fontSize: "0.85em", marginTop: "6px" }}>
                  <div>
                    <strong>Strong against:</strong>{" "}
                    {typeEffectiveness[p.type].strong.join(", ")}
                  </div>
                  <div>
                    <strong>Weak against:</strong>{" "}
                    {typeEffectiveness[p.type].weak.join(", ")}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => levelUpPokemon(p)}>Level Up</button>{" "}
                <button onClick={() => deletePokemon(p.id)}>Release</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;