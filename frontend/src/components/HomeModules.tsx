import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";

// Define types for user and fetchInfoStatus
interface User {
  loggedIn: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  type: "A" | "C";
}

interface FetchInfoStatus {
  applicant_page: boolean;
  applicant_test: boolean;
  applicant_matches: boolean;
}
interface Formation {
  id: number;
  name: string;
  level: string;
}

const HomeModules: React.FC = () => {
  const { user } = useAuth() as { user: User }; // Casting to User type
  const navigate = useNavigate();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [fetchInfoStatus, setFetchInfoStatus] = useState<FetchInfoStatus>({
    applicant_page: false,
    applicant_test: false,
    applicant_matches: false,
  });

  useEffect(() => {
    if (user.type === "A") {
      const fetchInfo = async () => {
        console.log("Fetching info status");
        try {
          const response = await Axios.get<FetchInfoStatus>("applicant/info/");
          console.log(response.data);
          setFetchInfoStatus(response.data);
        } catch (error) {
          console.error("Error fetching info status:", error);
        }
      };

      fetchInfo();
    }
    if (user.is_staff) {
      const fetchFormations = async () => {
        try {
          const response = await Axios.get("/formations/");
          console.log(response.data);
          setFormations(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchFormations();
    }
  }, [user.type, user.is_staff]);

  if (!user.loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <button
          onClick={() => navigate("/login")}
          className="btn btn-primary btn-outline"
        >
          Accéder à mon espace
        </button>
      </div>
    );
  }

  if (user.is_superuser) {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="join">
          <button
            className="btn btn-primary btn-outline join-item"
            onClick={() => navigate("/admin/applicant-management")}
          >
            Candidats
          </button>
          <button
            className="btn btn-secondary btn-outline join-item"
            onClick={() => navigate("/admin/company-management")}
          >
            Entreprises
          </button>
          <button
            className="btn btn-primary btn-outline join-item"
            onClick={() => navigate("/admin/offer-management")}
          >
            Matching
          </button>
          <button
            className="btn btn-secondary btn-outline join-item"
            onClick={() => navigate("/admin/formation-management")}
          >
            Formations
          </button>
          <button
            className="btn btn-primary btn-outline join-item"
            onClick={() => navigate("/admin/manager-management")}
          >
            Gestionnaires
          </button>
          <button
            className="btn btn-secondary btn-outline join-item"
            onClick={() => navigate("/admin/formation-statistics")}
          >
            Statistiques
          </button>
        </div>
      </div>
    );
  } else if (user.is_staff) {
    return (
      <div className="flex flex-col items-center justify-center w-full mt-5">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Gestion des formations :
        </h1>
        <div className="flex flex-row w-full mb-6 justify-center">
          {formations.map((formation) => (
            <li
              key={formation.id}
              className="flex justify-between items-center bg-stone-700 px-4 py-2 rounded-md shadow-sm m-1"
            >
              <span className="text-white">
                {formation.name} - {formation.level}
              </span>
            </li>
          ))}
        </div>
        <div className="join">
          <button
            className="btn btn-primary btn-outline join-item"
            onClick={() => navigate("/admin/applicant-management")}
          >
            Candidats
          </button>
          <button
            className="btn btn-secondary btn-outline join-item"
            onClick={() => navigate("/admin/company-management")}
          >
            Entreprises
          </button>
          <button
            className="btn  btn-outline join-item"
            onClick={() => navigate("/admin/offer-management")}
          >
            Matching
          </button>
        </div>
      </div>
    );
  } else if (user.type === "A") {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <ul className="timeline timeline-vertical fade-in">
          <li>
            <div className="timeline-start timeline-box p-0">
              <button
                className={`btn ${
                  fetchInfoStatus.applicant_page ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => navigate("/applicant/application")}
              >
                1. Remplir ma fiche candidat
              </button>
            </div>
            <div className="timeline-middle p-0">
              {fetchInfoStatus.applicant_page ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-primary h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="badge badge-base bold">1</span>
              )}
            </div>
            <hr
              className={fetchInfoStatus.applicant_page ? "bg-primary" : ""}
            />
          </li>
          <li>
            <hr
              className={fetchInfoStatus.applicant_test ? "bg-primary" : ""}
            />
            <div className="timeline-middle p-0">
              {fetchInfoStatus.applicant_test ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-primary h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="badge badge-base bold">2</span>
              )}
            </div>
            <div className="timeline-end timeline-box p-0">
              <button
                className={`btn ${
                  fetchInfoStatus.applicant_test ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => navigate("/applicant/test")}
              >
                Remplir mon test
              </button>
            </div>
            <hr
              className={fetchInfoStatus.applicant_test ? "bg-primary" : ""}
            />
          </li>
          <li>
            <hr
              className={fetchInfoStatus.applicant_matches ? "bg-primary" : ""}
            />
            <div className="timeline-start timeline-box p-0">
              <button
                className={`btn ${
                  fetchInfoStatus.applicant_matches
                    ? "btn-primary"
                    : "btn-outline"
                } join-item`}
                onClick={() => navigate("/applicant/matches")}
              >
                Gérer mes matchs
              </button>
            </div>
            <div className="timeline-middle">
              {fetchInfoStatus.applicant_matches ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-primary h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="badge badge-base bold">3</span>
              )}
            </div>
          </li>
        </ul>
      </div>
    );
  } else if (user.type === "C") {
    return (
      <div className="flex flex-col items-center justify-center mt-5">
        <button
          onClick={() => navigate("/company/offers")}
          className="btn btn-primary btn-outline"
        >
          Mes besoins en recrutement
        </button>
      </div>
    );
  }

  return null; // Return null or a fallback UI if no conditions are met
};

export default HomeModules;
