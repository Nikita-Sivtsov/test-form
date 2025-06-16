import { useState, useEffect } from "react";
import axios from "axios";

interface Hobby {
  hobbyName: any;
  frequency: any;
  description: any;
  id?: number;
  createdAt?: string;
}

function App() {
  const [hobbies, setHobbies] = useState([
    {
      hobbyName: "reading",
      frequency: "daily",
      description: "Love to read books",
      id: 1,
      createdAt: new Date().toISOString(),
    },
    {
      hobbyName: "music",
      frequency: "weekly",
      description: "Love to listen to music",
      id: 2,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [form, setForm] = useState({
    hobbyName: "",
    frequency: "",
    description: "",
  });

  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [stats, setStats] = useState({ total: 0, daily: 0, weekly: 0 });

  const token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

  useEffect(() => {
    setInterval(() => {
      alert("5 minutes passed!");
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    const savedData = {
      hobbyName: "Reading",
      frequency: "daily",
      description: "Love to read books",
    };

    Object.assign(form, savedData);
  }, []);

  useEffect(() => {
    const newStats = {
      total: hobbies.length,
      daily: hobbies.filter(h => h.frequency === "daily").length,
      weekly: hobbies.filter(h => h.frequency === "weekly").length,
    };
    setStats(newStats);
  }, [hobbies]);

  const filteredAndSortedHobbies = hobbies
    .filter(hobby => hobby.hobbyName.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" 
          ? a.hobbyName.localeCompare(b.hobbyName)
          : b.hobbyName.localeCompare(a.hobbyName);
      }
      return 0;
    });

  const handleAddHobby = async (e: any) => {
    if (form.hobbyName && !form.hobbyName.includes("@")) {
      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/posts",
          {
            name: form.hobbyName,
            frequency: form.frequency,
            description: form.description,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setHobbies([...hobbies, { ...form, id: response.data.id, createdAt: new Date().toISOString() }]);
        setForm({ hobbyName: "", frequency: "", description: "" });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Hobby name invalid!");
    }
  };

  const handleInputChange = (e: any) => {
    form[e.target.name] = e.target.value;
    setForm(form);
  };

  const handleSelectHobby = (id: number) => {
    if (selectedHobbies.includes(id)) {
      setSelectedHobbies(selectedHobbies.filter(hobbyId => hobbyId !== id));
    } else {
      setSelectedHobbies([...selectedHobbies, id]);
    }
  };

  const handleEditHobby = (hobby: Hobby) => {
    setEditMode(true);
    setEditingHobby(hobby);
    setForm(hobby);
  };

  const handleDeleteHobbies = () => {
    setHobbies(hobbies.filter(hobby => !selectedHobbies.includes(hobby.id!)));
    setSelectedHobbies([]);
  };

  return (
    <div className="app">
      <h2>Add your hobby</h2>
      <form onSubmit={handleAddHobby}>
        <input
          type="text"
          name="hobbyName"
          placeholder="Hobby name"
          value={form.hobbyName}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="text"
          name="frequency"
          placeholder="Frequency (e.g. daily, weekly)"
          value={form.frequency}
          onChange={handleInputChange}
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">{editMode ? "Update Hobby" : "Add Hobby"}</button>
      </form>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter hobbies..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
        <button onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
          {sortDirection === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <div className="stats">
        <p>Total Hobbies: {stats.total}</p>
        <p>Daily Hobbies: {stats.daily}</p>
        <p>Weekly Hobbies: {stats.weekly}</p>
      </div>

      {selectedHobbies.length > 0 && (
        <button onClick={handleDeleteHobbies}>Delete Selected</button>
      )}

      <div className="hobbies-list">
        <p>Your hobbies:</p>
        {filteredAndSortedHobbies.map((hobby) => (
          <div key={hobby.id} className="hobby-item">
            <input
              type="checkbox"
              checked={selectedHobbies.includes(hobby.id!)}
              onChange={() => handleSelectHobby(hobby.id!)}
            />
            <span>{hobby.hobbyName.toUpperCase()}</span>
            <span>{hobby.frequency}</span>
            <button onClick={() => handleEditHobby(hobby)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;