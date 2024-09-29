import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Axios from "../../../utils/Axios";
import * as XLSX from "xlsx";
import TempApplicantForm from "./TempApplicantForm";
import ApplicantFilters from "./ApplicantFilters";
import ApplicantsTable from "./ApplicantsTable";

// Define types for applicant and state
interface Applicant {
  first_name: string;
  last_name: string;
  email: string;
  link_inscription?: string;
}

interface NewApplicant {
  first_name: string;
  last_name: string;
  email: string;
}

const ApplicantManagement: React.FC = () => {
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [filteredTempApplicants, setFilteredTempApplicants] = useState<
    Applicant[]
  >([]);
  const [newApplicant, setNewApplicant] = useState<NewApplicant>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchApplicants = async () => {
    try {
      const response_applicants = await Axios.get("/applicant/");
      const response_temp_applicants = await Axios.get("/temp-applicants/");
      console.log("Applicants:", response_applicants.data);
      console.log("Temp Applicants:", response_temp_applicants.data);
      setFilteredApplicants(response_applicants.data);
      setFilteredTempApplicants(response_temp_applicants.data);
    } catch {
      console.error("Error fetching applicants");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewApplicant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await Axios.post("/temp-applicants/", [newApplicant]);
      setNewApplicant({ first_name: "", last_name: "", email: "" });
      fetchApplicants();
    } catch {
      console.error(
        "Une erreur s'est produite lors de l'ajout du candidat temporaire:"
      );
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: (string | string[])[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const emailList = json
        .flat()
        .filter(
          (item): item is string =>
            typeof item === "string" && item.includes("@")
        );

      const tempApplicantsData = emailList.map((email: string) => ({
        email: email,
      }));

      try {
        await Axios.post("/applicants/", tempApplicantsData);
        fetchApplicants();
      } catch (error) {
        console.error("Error uploading temp applicants:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
      <TempApplicantForm
        newApplicant={newApplicant}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <div className="flex items-center justify-center mt-10">
        <img
          src="/media/images/alternant.svg"
          className="h-20 mb-5 fade-in"
          alt="Alternant"
        />
      </div>
      <div className="flex items-center justify-center space-x-4 my-5">
        <h1 className="text-3xl font-bold text-gray-100 anton">Candidats</h1>
        <button
          className="btn btn-ghost text-primary"
          onClick={() =>
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            ).showModal()
          }
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
            className="cursor-pointer flex items-center btn btn-ghost text-primary"
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

      <ApplicantFilters
        nameFilter={nameFilter}
        statusFilter={statusFilter}
        handleNameFilterChange={handleNameFilterChange}
        handleStatusFilterChange={handleStatusFilterChange}
      />

      <h5 className="text-2xl font-bold text-gray-100 anton text-center">
        Résultats: {filteredApplicantsToDisplay.length}
      </h5>

      <ApplicantsTable applicants={filteredApplicantsToDisplay} />
    </>
  );
};

export default ApplicantManagement;
