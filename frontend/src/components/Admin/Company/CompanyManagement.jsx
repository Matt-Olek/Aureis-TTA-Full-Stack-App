import { useState, useEffect } from "react";
import Axios from "../../../utils/Axios";
import { useFlyingMessage } from "../../../App";
import * as XLSX from "xlsx";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import CompanyModal from "./CompanyModal";
import CompanyFilters from "./CompanyFilters";
import CompaniesTable from "./CompaniesTable";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [tempCompanies, setTempCompanies] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [newCompany, setNewCompany] = useState({ name: "", email: "" });
  const showMessage = useFlyingMessage();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await Axios.get("/companies/");
      setCompanies(response.data.companies);
      setTempCompanies(response.data.temp_companies);
    } catch (error) {
      showMessage("Erreur lors du chargement des entreprises", 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameFilterChange = (e) => setNameFilter(e.target.value);

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const applyFilters = () => {
    const filteredByName = [
      ...companies.filter((company) =>
        company.name.toLowerCase().includes(nameFilter.toLowerCase())
      ),
      ...tempCompanies.filter((company) =>
        company.name.toLowerCase().includes(nameFilter.toLowerCase())
      ),
    ];
    return filteredByName.filter((company) =>
      company.link_inscription
        ? "En attente d'inscription".includes(statusFilter)
        : "En cours de matching".includes(statusFilter)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/companies/", [newCompany]);
      setNewCompany({ name: "", email: "" });
      await fetchCompanies();
      showMessage("Entreprise ajoutée avec succès", 3000);
    } catch (error) {
      showMessage("Erreur lors de l'ajout de l'entreprise", 5000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      showMessage(`Fichier sélectionné: ${file.name}`, 3000);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      showMessage("Veuillez sélectionner un fichier Excel", 5000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const companyData = json.map((row) => ({
        name: row[0],
        email: row[1],
      }));

      try {
        const response = await Axios.post("/companies/", companyData);
        showMessage(response.data.messages[0], 3000);
        await fetchCompanies();
      } catch (error) {
        showMessage("Erreur lors de l'ajout des entreprises", 5000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredCompaniesToDisplay = applyFilters();

  return (
    <>
      <style>{`
        body {
          background-image: none !important;
        }
      `}</style>
      <CompanyModal
        newCompany={newCompany}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <div className="flex items-center justify-center mt-10">
        <img
          src="/media/images/astronaute.svg"
          className="h-20 mb-5 fade-in"
          alt="Icon"
        />
      </div>
      <div className="flex items-center justify-center space-x-4 my-5">
        <h1 className="text-3xl font-bold text-gray-100 anton">Entreprises</h1>
        <button
          className="btn btn-ghost text-green-300"
          onClick={() => document.getElementById("company_modal").showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex items-center btn btn-ghost text-green-300 ml-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      <CompanyFilters
        nameFilter={nameFilter}
        statusFilter={statusFilter}
        handleNameFilterChange={handleNameFilterChange}
        handleStatusFilterChange={handleStatusFilterChange}
      />
      <h5 className="text-2xl font-bold text-gray-100 anton text-center">
        Résultats: {filteredCompaniesToDisplay.length} entreprises
      </h5>
      <CompaniesTable companies={filteredCompaniesToDisplay} />
    </>
  );
};

export default CompanyManagement;
