import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import { useFlyingMessage } from "../App";
import * as XLSX from "xlsx"; // Import XLSX library

const ApplicantManagement = () => {
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [filteredTempApplicants, setFilteredTempApplicants] = useState([]);
  const [newApplicant, setNewApplicant] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [nameFilter, setNameFilter] = useState(""); // State for filtering by name
  const [statusFilter, setStatusFilter] = useState(""); // State for filtering by status
  const showMessage = useFlyingMessage();

  const fetchApplicants = async () => {
    try {
      const response = await Axios.get("/applicants/");
      setFilteredApplicants(response.data.applicants);
      setFilteredTempApplicants(response.data.temp_applicants);
    } catch (error) {
      showMessage("Erreur lors du chargement des candidats", 5000);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplicant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/applicants/", [newApplicant]);
      setNewApplicant({ first_name: "", last_name: "", email: "" });
      fetchApplicants();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout du candidat:",
        error.message
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      showMessage(`Fichier sélectionné: ${file.name}`, 3000);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
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
      const emailList = json
        .flat()
        .filter((email) => typeof email === "string" && email.includes("@"));

      const tempApplicantsData = emailList.map((email) => ({
        email: email,
      }));

      try {
        const response = await Axios.post("/applicants/", tempApplicantsData);
        showMessage(response.data.messages[0], 3000);
        fetchApplicants();
      } catch (error) {
        showMessage("Erreur lors de l'ajout des candidats", 5000);
        console.error("Error uploading temp applicants:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const applyFilters = () => {
    const filteredByName = [
      ...filteredApplicants,
      ...filteredTempApplicants,
    ].filter((applicant) =>
      `${applicant.first_name} ${applicant.last_name}`
        .toLowerCase()
        .includes(nameFilter.toLowerCase())
    );

    const filteredByStatus = filteredByName.filter((applicant) =>
      applicant.link_inscription
        ? "En attente d'inscription".includes(statusFilter)
        : "En cours de matching".includes(statusFilter)
    );
    return filteredByStatus;
  };

  const filteredApplicantsToDisplay = applyFilters();

  return (
    <>
      <style>
        {`
                body {
                    background-image: none !important;
                    }
                    `}
      </style>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">
              Ajouter un candidat
            </h1>
            <form onSubmit={handleSubmit} className="rounded m-5 w-full">
              <input
                type="text"
                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                id="first_name"
                name="first_name"
                placeholder="Prénom"
                value={newApplicant.first_name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                id="last_name"
                name="last_name"
                placeholder="Nom"
                value={newApplicant.last_name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                id="email"
                name="email"
                placeholder="Email"
                value={newApplicant.email}
                onChange={handleInputChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-pink-300 hover:bg-pink-400 text-stone-900 py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Contacter
              </button>
            </form>
          </div>
          <p className="py-4">ESC pour fermer</p>
        </div>
      </dialog>
      <div className="flex items-center justify-center mt-10">
        <img
          src="/media/images/icon-man.svg"
          className="h-20 mb-5"
          alt="Icon"
        />
      </div>
      <div className="flex items-center justify-center space-x-4 my-5">
        <h1 className="text-3xl font-bold text-gray-100 anton">Candidats</h1>
        <button
          className="btn btn-ghost text-green-300"
          onClick={() => document.getElementById("my_modal_1").showModal()}
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
        <div
          className="tooltip"
          data-tip="Format: .xlsx, .xls - Colonnes : prénom, nom, email"
        >
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-center btn btn-ghost text-green-300"
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
      </div>

      {/* Filters Section */}
      <div className="flex items-center justify-center space-x-4 my-10">
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={nameFilter}
          onChange={handleNameFilterChange}
          className="input input-bordered border-green-300 focus:border-green-400 hover:border-green-400"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="select select-bordered border-green-300 focus:border-green-400 hover:border-green-400 "
        >
          <option value="">Filtrer par statut</option>
          <option value="En attente d'inscription">
            En attente d&apos;inscription
          </option>
          <option value="En cours de matching">En cours de matching</option>
        </select>
      </div>
      <h5 className="text-2xl font-bold text-gray-100 anton text-center">
        Résultats: {filteredApplicantsToDisplay.length}
      </h5>

      <div className="">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Diplôme</th>
              <th>Type de contrat</th>
              <th>Emplacement</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicantsToDisplay.map((applicant, index) => (
              <tr key={index}>
                <td>{applicant.first_name}</td>
                <td>{applicant.last_name}</td>
                <td>{applicant.email}</td>
                <td>{applicant.phone}</td>
                <td>{applicant.diploma}</td>
                <td>{applicant.contract_type}</td>
                <td>{applicant.location}</td>
                <td>
                  {applicant.link_inscription ? (
                    <span className="badge bg-blue-300 text-blue-900 p-3">
                      En attente d&apos;inscription
                    </span>
                  ) : (
                    <span className="badge bg-green-300 text-green-900 p-3">
                      En cours de matching
                    </span>
                  )}
                </td>
                <td>
                  {applicant.link_inscription ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex="0"
                        role="button"
                        className="btn m-1 btn-ghost text-green-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </div>
                      <ul
                        tabIndex="0"
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li>
                          <a>Supprimer</a>
                        </li>
                        <li>
                          <a>Relancer</a>
                        </li>
                        <li>
                          <a
                            onClick={() =>
                              navigator.clipboard.writeText(
                                applicant.link_inscription
                              ) && alert("Lien copié !")
                            }
                          >
                            Copier le lien d&apos;inscription
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex="0"
                        role="button"
                        className="btn m-1 btn-ghost text-green-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </div>
                      <ul
                        tabIndex="0"
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li>
                          <a className="">Infos</a>
                        </li>
                        <li>
                          <a className="text-red-500">Supprimer</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApplicantManagement;
