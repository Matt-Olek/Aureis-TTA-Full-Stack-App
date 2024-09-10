import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { useEffect, useState } from "react";

const HomeModules = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fetchInfoStatus, setFetchInfoStatus] = useState({
    applicant_page: false,
    applicant_test: false,
    applicant_matches: false,
  });

  useEffect(() => {
    if (user.type === "A") {
      const fetchInfo = async () => {
        console.log("Fetching info status");
        const response = await Axios.get("applicant/info/");
        console.log(response.data);
        setFetchInfoStatus(response.data);
      };

      fetchInfo();
    }
  }, [user]);

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
            className="btn btn-outline join-item"
            onClick={() => navigate("/admin/applicant-management")}
          >
            Candidats
          </button>
          <button
            className="btn btn-outline join-item"
            onClick={() => navigate("/admin/company-management")}
          >
            Entreprises
          </button>
          <button
            className="btn btn-outline join-item"
            onClick={() => navigate("/admin/offer-management")}
          >
            Matching
          </button>
          <button
            className="btn btn-outline join-item"
            onClick={() => navigate("/admin/formation-management")}
          >
            Formations
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
              {/* Step 1: Based on applicant_page */}
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
                <span className="badge  badge-base bold">1</span>
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
                <span className="badge  badge-base bold">2</span>
              )}
            </div>
            <div className="timeline-end timeline-box p-0">
              {/* Step 2: Based on applicant_test */}
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
              {/* Step 3: Based on applicant_matches */}
              <button
                className={`btn ${
                  fetchInfoStatus.applicant_matches
                    ? "btn-primary"
                    : "btn-outline"
                } join-item`}
                onClick={() => navigate("/admin/offer-management")}
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
                <span className="badge  badge-base bold">3</span>
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
};

export default HomeModules;
