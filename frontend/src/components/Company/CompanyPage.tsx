import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Définir l'interface Company
interface Company {
  name: string;
  sector: string[];
  adress: string;
  city: string;
  zip_code: string;
  country: string;
  description: string;
}

// Définir l'interface Sector
interface Sector {
  id: number;
  name: string;
}

const CompanyPage = () => {
  const [company, setCompany] = useState<Company>({
    name: "",
    sector: [],
    adress: "",
    city: "",
    zip_code: "",
    country: "France",
    description: "",
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [fetchedCompany, setFetchedCompany] = useState<Company | null>(null);
  const navigate = useNavigate();

  // Récupérer les secteurs
  const fetchSectors = async () => {
    try {
      const response = await Axios.get("/sector/");
      console.log("Secteurs récupérés avec succès :", response.data);
      setSectors(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des secteurs :", error);
    }
  };

  // Récupérer les données de l'entreprise
  const fetchCompany = async () => {
    try {
      const response = await Axios.get("/company/");
      console.log("Entreprise récupérée avec succès :", response.data);
      setFetchedCompany(response.data);
      setCompany(response.data); // Définir l'état de l'entreprise avec les données récupérées
    } catch (error) {
      console.error("Erreur lors de la récupération de l'entreprise :", error);
    }
  };

  // Gérer les changements d'input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const options = (e.target as HTMLSelectElement).options;

    if (name === "sector") {
      // Gérer la sélection multiple pour le champ secteur
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setCompany({ ...company, [name]: selectedOptions });
    } else {
      // Gérer les autres entrées
      setCompany({ ...company, [name]: value });
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/company/", company);
      console.log("Entreprise enregistrée avec succès :", response.data);
      toast.success("Entreprise enregistrée avec succès");
      setTimeout(() => {
        navigate("/#home");
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la création de l'entreprise :", error);
      toast.error("Erreur lors de la création de l'entreprise");
    }
  };

  // Utiliser useEffect pour récupérer les données
  useEffect(() => {
    fetchSectors();
    fetchCompany(); // Récupérer les données de l'entreprise lorsque le composant est monté
  }, []);

  useEffect(() => {
    if (fetchedCompany) {
      setCompany(fetchedCompany); // Préremplir les champs si une entreprise est récupérée
    }
  }, [fetchedCompany]);

  return (
    <>
      <style>
        {`
        body {
            background-image: none !important;
        }
        `}
      </style>

      <div className="container mx-auto w-full p-4 lg:w-1/2">
        <h1 className="text-2xl font-bold mb-4">Page de l'entreprise</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Nom de l'entreprise</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={company.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="sector">
              <span className="label-text">
                Secteur d'activité (maintenez Ctrl pour sélectionner plusieurs)
              </span>
            </label>
            <select
              id="sector"
              name="sector"
              multiple
              value={company.sector}
              onChange={handleChange}
              className="select select-bordered"
              style={{ height: "200px" }}
            >
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="adress">
              <span className="label-text">Adresse</span>
            </label>
            <input
              id="adress"
              name="adress"
              type="text"
              value={company.adress}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="city">
              <span className="label-text">Ville</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={company.city}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="zip_code">
              <span className="label-text">Code Postal</span>
            </label>
            <input
              id="zip_code"
              name="zip_code"
              type="text"
              value={company.zip_code}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="country">
              <span className="label-text">Pays</span>
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={company.country}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={company.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyPage;
