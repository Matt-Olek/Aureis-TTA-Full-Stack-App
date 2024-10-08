import React from "react";
import { Match } from "../types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Axios from "../utils/Axios"; // Import Axios for API calls
import downloadFile from "../utils/Download";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MatchInfoProps {
  match: Match;
  type: "admin" | "applicant" | "company"; // Added type prop
  adminView?: boolean; // Added adminView prop
}

const MatchInfo: React.FC<MatchInfoProps> = ({ match, type, adminView }) => {
  const handleAcceptApplicant = (id: number) => {
    Axios.post(`matches/${id}/`, { action: 3 })
      .then((response) => {
        console.log("Match accepted:", response.data);
      })
      .catch((error) => console.error("Error accepting match:", error));
  };

  const handleAcceptCompany = (id: number) => {
    Axios.post(`matches/${id}/`, { action: 1 })
      .then((response) => {
        console.log("Match accepted:", response.data);
      })
      .catch((error) => console.error("Error accepting match:", error));
  };

  const handleApplicantDecline = (id: number) => {
    Axios.post(`matches/${id}/`, { action: -2 })
      .then((response) => {
        console.log("Match declined:", response.data);
      })
      .catch((error) => console.error("Error declining match:", error));
  };

  const handleCompanyDecline = (id: number) => {
    Axios.post(`matches/${id}/`, { action: -1 })
      .then((response) => {
        console.log("Match declined:", response.data);
      })
      .catch((error) => console.error("Error declining match:", error));
  };

  const handleFinalize = (id: number) => {
    Axios.post(`matches/${id}/`, { action: 4 })
      .then((response) => {
        console.log("Match finalized:", response.data);
      })
      .catch((error) => console.error("Error finalizing match:", error));
  };

  const renderPieChart = () => {
    const totalMaxScore = 400;
    const totalScores =
      match.industry_score +
      match.test_score +
      match.geographic_score +
      match.resume_score;
    const remainingScore = totalMaxScore - totalScores;

    const data = {
      labels: [
        "Score de l'industrie",
        "Score du test",
        "Score géographique",
        "Score du CV",
        "Restant",
      ],
      datasets: [
        {
          label: "Répartition des scores",
          data: [
            match.industry_score,
            match.test_score,
            match.geographic_score,
            match.resume_score,
            remainingScore > 0 ? remainingScore : 0,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(224, 224, 224, 0)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(224, 224, 224, 0)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="mt-4 w-full">
        <Pie
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const score = tooltipItem.raw;
                    return `${tooltipItem.label}: ${score} / 100`;
                  },
                },
              },
            },
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="mr-4 w-1/2">
        <div className="card bg-base-200 shadow-xl p-6 manrope w-full">
          {/* Render offer details for admin and applicant */}
          {type === "applicant" && (
            <>
              <h2 className="card-title text-2xl">{match.offer.title}</h2>
              <hr className="border-primary my-4" />
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold">📍</span>
                <span className="ml-2">{match.offer.location}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold">📄</span>
                <span className="ml-2">{match.offer.contract_type}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold">🎓</span>
                <span className="ml-2">
                  {match.offer.target_educational_level}
                </span>
              </div>
              <p className="mt-4">
                <strong className="block">📝 Description :</strong>
                <p className="text-base p-5">{match.offer.description}</p>
              </p>
            </>
          )}

          {/* Render application details for companies and admin */}
          {type === "company" && (
            <>
              <h2 className="card-title text-2xl mb-4 text-center">
                Détails de la candidature
              </h2>
              <hr className="border-primary mb-4" />

              <div className="space-y-4">
                {/* Candidat */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Candidat :</span>
                  <span className="ml-2">
                    {match.application.applicant.first_name}{" "}
                    {match.application.applicant.last_name}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Email :</span>
                  <span className="ml-2">
                    {match.application.applicant.email}
                  </span>
                </div>

                {/* Ville */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Ville :</span>
                  <span className="ml-2">
                    {match.application.applicant.city}
                  </span>
                </div>

                {/* Pays */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Pays :</span>
                  <span className="ml-2">
                    {match.application.applicant.country}
                  </span>
                </div>

                {/* Téléphone */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Téléphone :</span>
                  <span className="ml-2">
                    {match.application.applicant.phone}
                  </span>
                </div>

                {/* Diplôme */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">
                    Dernier diplôme :
                  </span>
                  <span className="ml-2">
                    {match.application.applicant.diploma}
                  </span>
                </div>

                {/* Niveau éducatif cible */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Niveau cible :</span>
                  <span className="ml-2">
                    {match.application.applicant.target_educational_level}
                  </span>
                </div>

                {/* Type de contrat */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">
                    Type de contrat :
                  </span>
                  <span className="ml-2">
                    {match.application.applicant.contract_type}
                  </span>
                </div>

                {/* Secteur */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Secteur </span>
                  <span className="ml-2">
                    {match.application.applicant.sector.map((sector) => (
                      <li key={sector.id} className="mr-2">
                        {sector.name}
                      </li>
                    ))}
                  </span>
                </div>

                {/* Localisation */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Localisation :</span>
                  <span className="ml-2">
                    {match.application.applicant.location}
                  </span>
                </div>

                {/* Distance */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">Distance :</span>
                  <span className="ml-2">
                    {match.application.applicant.kilometers_away} km
                  </span>
                </div>

                {/* CV */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold">CV :</span>
                  <span className="ml-2">
                    <button
                      className="btn btn-primary btn-sm btn-outline"
                      onClick={() =>
                        downloadFile(
                          match.application.applicant.resume
                            ?.split("/")
                            .pop() || ""
                        )
                      }
                    >
                      Télécharger
                    </button>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4 w-full justify-center flex-wrap">
            {/* Admin actions */}
            {adminView && (
              <>
                {match.status === 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAcceptApplicant(match.id)}
                  >
                    Accepter
                  </button>
                ) : (
                  <button className="btn btn-primary" disabled>
                    Déjà accepté
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => handleApplicantDecline(match.id)}
                >
                  Décliner
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleFinalize(match.id)}
                >
                  Finaliser
                </button>
              </>
            )}

            {/* Applicant actions */}
            {type === "applicant" && (
              <>
                {match.status === 0 ? (
                  <button className="btn btn-primary" disabled>
                    En attente de l'enreprise
                  </button>
                ) : match.status === 1 ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAcceptApplicant(match.id)}
                    >
                      Accepter
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleApplicantDecline(match.id)}
                    >
                      Décliner
                    </button>
                  </>
                ) : match.status === 2 ? (
                  <button className="btn btn-primary" disabled>
                    Vous êtes en file d'attente
                  </button>
                ) : match.status === 3 ? (
                  <>
                    <button className="btn btn-success" disabled>
                      Félicitations, vous avez été accepté
                    </button>
                    <p className="text-primary">
                      Votre contrat est en cours de préparation
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        confirm("Êtes-vous sûr de vouloir annuler ce match ?")
                          ? handleApplicantDecline(match.id)
                          : null
                      }
                    >
                      Annuler
                    </button>
                  </>
                ) : match.status === 4 ? (
                  <>
                    <button className="btn btn-success" disabled>
                      Match finalisé
                    </button>
                    <p className="text-primary">
                      Félicitations, votre contrat est prêt. Vous allez être
                      contacté par l'entreprise
                    </p>
                  </>
                ) : match.status === -2 ? (
                  <>
                    <button className="btn btn-danger" disabled>
                      Match annulé
                    </button>
                    <p className="text-secondary">
                      Contactez votre responsable formation si c'est une erreur
                    </p>
                  </>
                ) : match.status === -1 ? (
                  <>
                    <button className="btn btn-danger" disabled>
                      Match refusé par l'entreprise
                    </button>
                  </>
                ) : (
                  <button className="btn btn-danger" disabled>
                    Aucune information sur le statut
                  </button>
                )}
              </>
            )}

            {/* Company actions */}
            {type === "company" && (
              <>
                {match.status === 0 ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAcceptCompany(match.id)}
                    >
                      Accepter le candidat
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCompanyDecline(match.id)}
                    >
                      Refuser le candidat
                    </button>
                  </>
                ) : match.status === 1 ? (
                  <>
                    <button className="btn btn-primary" disabled>
                      Candidat accepté
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCompanyDecline(match.id)}
                    >
                      Refuser le candidat
                    </button>
                  </>
                ) : match.status === 2 ? (
                  <>
                    <button className="btn btn-primary" disabled>
                      Candidat en file d'attente
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCompanyDecline(match.id)}
                    >
                      Refuser le candidat
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAcceptCompany(match.id)}
                    >
                      Accepter le candidat
                    </button>
                  </>
                ) : match.status === 3 ? (
                  <>
                    <button className="btn btn-success" disabled>
                      Matching conclu
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFinalize(match.id)}
                    >
                      Finaliser le matching
                    </button>
                  </>
                ) : match.status === 4 ? (
                  <>
                    <button className="btn btn-success" disabled>
                      Matching finalisé
                    </button>
                  </>
                ) : match.status === -1 ? (
                  <>
                    <button className="btn btn-danger" disabled>
                      Candidat refusé
                    </button>
                  </>
                ) : match.status === -2 ? (
                  <>
                    <button className="btn btn-danger" disabled>
                      Refus du candidat
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-danger" disabled>
                      Aucune information sur le statut
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-4 w-1/2 p-10">
        <p className="text-2xl font-bold">
          Votre score: <span className="text-primary">{match.score}/100</span>
        </p>
        {renderPieChart()}
      </div>
    </div>
  );
};

export default MatchInfo;
