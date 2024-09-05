import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useFlyingMessage } from "../App";
import StatusTimeline from "./StatusTimeline";

const MatchDetailsModal = ({ match, onClose }) => {
  if (!match) return null;

  useEffect(() => {
    const detailsModal = document.getElementById("details_modal");

    function handleEscKey(event) {
      if (event.key === "Escape") {
        detailsModal.close();
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  useEffect(() => {
    const closeButton = document.querySelector(".modal-action button");

    closeButton.addEventListener("click", onClose);

    return () => {
      closeButton.removeEventListener("click", onClose);
    };
  }, [onClose]);

  return (
    <dialog id="details_modal" className="modal modal-open">
      <div className="modal-box bg-base-200">
        <h1 className="text-3xl font-bold text-gray-100 text-center my-6 anton">
          Détails du Match
        </h1>
        <div className="py-4 grid grid-cols-1 gap-4">
          <p>
            <strong>Offre :</strong> {match.offer}
          </p>
          <p>
            <strong>Candidature :</strong> {match.application}
          </p>
          <p>
            <strong>Score :</strong> {match.score}
          </p>

          <div>
            <strong>Score de l'industrie : {match.industry_score}</strong>
            <div className="w-full bg-gray-300 rounded-full h-4 mt-1">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${match.industry_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <strong>Score du test : {match.test_score}</strong>
            <div className="w-full bg-gray-300 rounded-full h-4 mt-1">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{ width: `${match.test_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <strong>Score géographique : {match.geographic_score}</strong>
            <div className="w-full bg-gray-300 rounded-full h-4 mt-1">
              <div
                className="bg-yellow-600 h-4 rounded-full"
                style={{ width: `${match.geographic_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <strong>Score du CV : {match.resume_score}</strong>
            <div className="w-full bg-gray-300 rounded-full h-4 mt-1">
              <div
                className="bg-red-600 h-4 rounded-full"
                style={{ width: `${match.resume_score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="py-4">
          <StatusTimeline status={match.status} />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
      <p className="py-4 text-center text-gray-400">
        Appuyez sur Échap pour fermer
      </p>
    </dialog>
  );
};

const MatchApplicantManagement = () => {
  const [matchApplicants, setMatchApplicants] = useState([]);
  const [newStatus, setNewStatus] = useState("Pending");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const showMessage = useFlyingMessage();

  const [columnDefs] = useState([
    { headerName: "Offer", field: "offer", filter: true },
    { headerName: "Application", field: "application", filter: true },
    { headerName: "Score", field: "score", filter: true },
    // { headerName: 'Industry Score', field: 'industry_score', filter: true },
    // { headerName: 'Test Score', field: 'test_score', filter: true },
    // { headerName: 'Geographic Score', field: 'geographic_score', filter: true },
    // { headerName: 'Resume Score', field: 'resume_score', filter: true },
    { headerName: "Status", field: "status", filter: true },
    // Actions column removed since it's no longer needed
  ]);

  const fetchMatchApplicants = async () => {
    try {
      const response = await Axios.get("/match_applicants/");
      setMatchApplicants(response.data);
      console.log("Match applicants:", response.data);
    } catch (error) {
      showMessage("Erreur lors du chargement des correspondances", 5000);
      console.error("Error fetching match applicants:", error);
    }
  };

  useEffect(() => {
    fetchMatchApplicants();
  }, []);

  const handleRowClick = (event) => {
    setSelectedMatch(event.data);
    document.getElementById("details_modal").showModal();
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      await Axios.put(`/match_applicants/${selectedMatch.id}/`, {
        status: newStatus,
      });
      showMessage("Statut mis à jour avec succès", 3000);
      fetchMatchApplicants();
      document.getElementById("status_modal").close();
    } catch (error) {
      showMessage("Erreur lors de la mise à jour du statut", 5000);
      console.error("Error updating status:", error);
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

      <MatchDetailsModal
        match={selectedMatch}
        onClose={() => document.getElementById("details_modal").close()}
      />

      <dialog id="status_modal" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">
              Mettre à jour le statut
            </h1>
            <form onSubmit={handleSubmit} className="rounded m-5 w-full">
              <select
                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted_company">Accepted by Company</option>
                <option value="Queue_company">In Company Queue</option>
                <option value="Canceled_company">Canceled by Company</option>
                <option value="Canceled_applicant">
                  Canceled by Applicant
                </option>
                <option value="Fully_accepted">Fully Accepted</option>
                <option value="Finalized_enrollment">
                  Finalized Enrollment
                </option>
              </select>
              <button
                type="submit"
                className="w-full bg-pink-300 hover:bg-pink-400 text-stone-900 py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Mettre à jour
              </button>
            </form>
          </div>
          <p className="py-4">ESC pour fermer</p>
        </div>
      </dialog>

      <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">
        Matchs des candidats
      </h1>
      <div className="flex">
        <div className="ag-theme-material-dark w-full" style={{ height: 600 }}>
          <AgGridReact
            rowData={matchApplicants}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
            }}
            animateRows={true}
            pagination={true}
            paginationPageSize={50}
            onRowClicked={handleRowClick}
            onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </div>
    </>
  );
};

export default MatchApplicantManagement;
