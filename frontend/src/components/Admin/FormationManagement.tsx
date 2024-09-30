import { useState, useEffect, ChangeEvent } from "react";
import Axios from "../../utils/Axios";
import { Formation } from "../../types";
interface LevelChoice {
  [key: string]: string;
}

const FormationList = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [newFormation, setNewFormation] = useState<Formation>({
    name: "",
    level: "",
    id: 0,
  });
  const [levelChoices, setLevelChoices] = useState<[string, string][]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchFormations();
    fetchLevelChoices();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await Axios.get<Formation[]>("/formations/");
      console.log(response.data);
      setFormations(response.data);
    } catch (err) {
      setError("Error fetching formations.");
      console.error(err);
    }
  };

  const fetchLevelChoices = async () => {
    try {
      const response = await Axios.get<LevelChoice>(
        "/educational-level-choices/"
      );
      console.log("Fetched level choices:", response.data); // Debugging output
      const choicesArray = Object.entries(response.data);
      setLevelChoices(choicesArray);
    } catch (err) {
      setError("Error fetching level choices.");
      console.error(err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewFormation({ ...newFormation, [name]: value });
  };

  const addFormation = async () => {
    try {
      const response = await Axios.post<Formation>(
        "/formations/",
        newFormation
      );
      setFormations([...formations, response.data]);
      setNewFormation({ name: "", level: "", id: 0 });
      setError("");
    } catch (err) {
      setError("Error adding formation.");
      console.error(err);
    }
  };

  const removeFormation = async (id: number) => {
    try {
      await Axios.delete(`/formations/${id}/`);
      setFormations(formations.filter((formation) => formation.id !== id));
    } catch (err) {
      setError("Error removing formation.");
      console.error(err);
    }
  };

  return (
    <>
      <style>
        {`
    body {
      background-image: none !important;
    }
    `}
      </style>
      <div className="py-8 px-4 mt-10">
        <div className="max-w-2xl mx-auto shadow-md rounded-lg p-6 bg-stone-800">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Formations
          </h1>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {/* List all formations */}
          <ul className="space-y-4 mb-6">
            {formations.map((formation) => (
              <li
                key={formation.id}
                className="flex justify-between items-center bg-stone-700 px-4 py-2 rounded-md shadow-sm"
              >
                <span className="text-white">
                  {formation.name} - {formation.level}
                </span>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Êtes-vous sûr de vouloir supprimer cette formation ?"
                      )
                    ) {
                      removeFormation(formation.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-500 font-semibold"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          {/* Add new formation form */}
          <div className="bg-base-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Ajouter une formation
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nom de la formation"
                value={newFormation.name}
                onChange={handleChange}
                className="p-2 input input-primary"
              />
              <select
                name="level"
                value={newFormation.level}
                onChange={handleChange}
                className="p-2 input input-primary"
              >
                <option value="" disabled>
                  Sélectionner un Niveau
                </option>
                {levelChoices.map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <button onClick={addFormation} className="btn btn-primary w-full">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationList;
