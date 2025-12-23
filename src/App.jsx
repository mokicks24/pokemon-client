import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Type effectiveness map
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

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    type: "",
    level: "",
    evolution_line: ""
  });

  const fetchPokemon = async () => {
    const res = await fetch(`${API_URL}/api/pokemon`);
    const data = await res.json();
    setPokemon(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/api/pokemon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        type:
          formData.type.charAt(0).toUpperCase() +
          formData.type.slice(1).toLowerCase(),
        level: Number(formData.level) || 1
      })
    });

    setFormData({
      name: "",
      nickname: "",
      type: "",
      level: "",
      evolution_line: ""
    });

    fetchPokemon();
  };

  const deletePokemon = async (id) => {
    await fetch(`${API_URL}/api/pokemon/${id}`, { method: "DELETE" });
    fetchPokemon();
  };

  const levelUpPokemon = async (p) => {
    await fetch(`${API_URL}/api/pokemon/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, level: p.level + 1 })
    });
    fetchPokemon();
  };

  return (
    <div className="container">
      <h1>Pokédex</h1>

      <h2>Add Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} />
        <input name="type" placeholder="Type (Fire, Water, etc.)" value={formData.type} onChange={handleChange} />
        <input name="level" type="number" placeholder="Level" value={formData.level} onChange={handleChange} />
        <input name="evolution_line" placeholder="Evolution line" value={formData.evolution_line} onChange={handleChange} />
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

              {typeEffectiveness[p.type] && (
                <div style={{ fontSize: "0.9em", marginTop: "6px" }}>
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