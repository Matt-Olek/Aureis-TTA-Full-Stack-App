import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import "daisyui/dist/full.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Formation {
  id: number;
  name: string;
}

interface FormationStatistics {
  formation: string;
  total_applicants: number;
  pending_matches: number;
  accepted_by_company: number;
  fully_accepted: number;
  finalized_enrollment: number;
  no_matches: number; // Nouveau champ pour les candidats sans correspondance
}

const FormationStatistics: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [formationStatisticsList, setFormationStatisticsList] = useState<
    FormationStatistics[]
  >([]);

  useEffect(() => {
    fetchFormations();
    fetchFormationStatistics();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await Axios.get<Formation[]>("/formations/");
      setFormations(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFormationStatistics = async () => {
    try {
      const response = await Axios.get<FormationStatistics[]>(
        "/formation-statistics/"
      );
      setFormationStatisticsList(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPieData = (stats: FormationStatistics) => ({
    datasets: [
      {
        data: [
          stats.no_matches,
          stats.pending_matches,
          stats.accepted_by_company,
          stats.fully_accepted,
          stats.finalized_enrollment,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 4,
      },
    ],
    labels: [
      "Aucun match",
      "Matchs en attente",
      "Accepté par l'entreprise",
      "Accepté par les 2 parties",
      "Inscription finalisée",
    ],
  });

  return (
    <>
      <style>
        {`
    body {
      background-image: none !important;
    }
    `}
      </style>
      <div className="flex items-center justify-center mt-10">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Statistiques des formations
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formationStatisticsList.map((stats, index) => (
              <div key={index} className="card rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {stats.formation}
                </h2>
                <div className="flex justify-center">
                  {stats.total_applicants === 0 ? (
                    <div className="text-center">
                      <p className="text-2xl font-semibold">Aucun candidat</p>
                    </div>
                  ) : (
                    <Doughnut
                      data={getPieData(stats)}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: "Répartition des candidats",
                            font: {
                              size: 16,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <div className="dropdown dropdown-hover dropdown-top">
                    <label tabIndex={0} className="btn m-1">
                      Voir les détails
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a>Total des candidats : {stats.total_applicants}</a>
                      </li>
                      <hr />
                      <li>
                        <a>En attente : {stats.pending_matches}</a>
                      </li>
                      <li>
                        <a>
                          Accepté par l'entreprise : {stats.accepted_by_company}
                        </a>
                      </li>
                      <li>
                        <a>Entièrement accepté : {stats.fully_accepted}</a>
                      </li>
                      <li>
                        <a>
                          Inscription finalisée : {stats.finalized_enrollment}
                        </a>
                      </li>
                      <li>
                        <a>Aucune correspondance : {stats.no_matches}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationStatistics;
