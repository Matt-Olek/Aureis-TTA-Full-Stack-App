import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import { Match, Formation, STATUS_MAP } from "../types";
import MatchInfo from "./MatchInfo"; // Import the MatchInfo component

const OfferManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [groupBy, setGroupBy] = useState<string>("offer");
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(
    null
  );

  const handleAccordionToggle = (index: number) => {
    setExpandedAccordion((prevExpanded) =>
      prevExpanded === index ? null : index
    );
  };

  // Filter states
  const [statusFilter, setStatusFilter] = useState<number | string>("");
  const [offerFilter, setOfferFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");

  // New candidate filters
  const [firstNameFilter, setFirstNameFilter] = useState<string>("");
  const [lastNameFilter, setLastNameFilter] = useState<string>("");
  const [contractTypeFilter, setContractTypeFilter] = useState<string>("");
  const [formationFilter, setFormationFilter] = useState<string>("");
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    Axios.get("/formations/")
      .then((response) => {
        setFormations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the formations!", error);
      });
  }, []);

  useEffect(() => {
    Axios.get("/match_applicants/", {
      params: {
        formation: formationFilter,
        offer: offerFilter,
        company: companyFilter,
        status: statusFilter,
        first_name: firstNameFilter,
        last_name: lastNameFilter,
        contract_type: contractTypeFilter,
      },
    })
      .then((response) => {
        setMatches(response.data);
        setFilteredMatches(response.data); // Set initial filtered matches
      })
      .catch((error) => {
        console.error("There was an error fetching the matches!", error);
      });
  }, [
    offerFilter,
    companyFilter,
    statusFilter,
    firstNameFilter,
    lastNameFilter,
    contractTypeFilter,
    formationFilter,
  ]);

  // Function to calculate statistics
  const calculateStatistics = () => {
    if (filteredMatches.length === 0)
      return {
        totalMatches: 0,
        averageScore: 0,
      };

    const totalMatches = filteredMatches.length;
    const totalScore = filteredMatches.reduce(
      (sum, match) => sum + match.score,
      0
    );
    const averageScore = (totalScore / totalMatches).toFixed(2);

    return {
      totalMatches,
      averageScore,
    };
  };

  const stats = calculateStatistics();

  const groupedMatches = filteredMatches.reduce(
    (acc: Record<string, Match[]>, match) => {
      const key =
        groupBy === "offer"
          ? match.offer.title
          : match.application.applicant.first_name +
            " " +
            match.application.applicant.last_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    },
    {}
  );

  return (
    <>
      <style>
        {`
    body {
        background-image: none !important;
    }
      .group-card-content {
        transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
        overflow: hidden;
      }

      .group-card-content.collapsed {
        max-height: 0;
        opacity: 0;
      }

      .group-card-content.expanded {
        max-height: 1000px;
        opacity: 1;
      }
    `}
      </style>

      <div className="p-6 flex w-full h-full">
        {/* Filter Section */}
        <div className="w-1/4 h-full bg-base-200 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Filtrer par formation</h1>
          <select
            id="formationFilter"
            value={formationFilter}
            onChange={(e) => setFormationFilter(e.target.value)}
            className="w-full select select-secondary"
          >
            <option value="">Toutes les formations</option>
            {formations.map((formation, index) => (
              <option key={index} value={formation.id}>
                {formation.name}
              </option>
            ))}
          </select>
          <hr className="my-4" />
          <h1 className="text-xl font-bold mb-4">Filtres de Besoin</h1>

          <label htmlFor="offerFilter" className="block mb-2">
            Filtrer par Besoin
          </label>
          <input
            type="text"
            id="offerFilter"
            value={offerFilter}
            onChange={(e) => setOfferFilter(e.target.value)}
            placeholder="Filtrer par nom de besoin"
            className="w-full input input-primary p-2 mb-4 rounded-lg"
          />

          <label htmlFor="companyFilter" className="block mb-2">
            Filtrer par Entreprise
          </label>
          <input
            type="text"
            id="companyFilter"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder="Filtrer par nom d'entreprise"
            className="w-full input input-primary p-2 mb-4 rounded-lg"
          />

          <hr className="my-4" />
          <h1 className="text-xl font-bold mb-4">Filtres de candidat</h1>

          {/* New candidate filters */}
          <label htmlFor="firstNameFilter" className="block mb-2">
            Prénom
          </label>
          <input
            type="text"
            id="firstNameFilter"
            value={firstNameFilter}
            onChange={(e) => setFirstNameFilter(e.target.value)}
            placeholder="Filtrer par prénom"
            className="w-full input input-primary p-2 mb-4 rounded-lg"
          />

          <label htmlFor="lastNameFilter" className="block mb-2">
            Nom
          </label>
          <input
            type="text"
            id="lastNameFilter"
            value={lastNameFilter}
            onChange={(e) => setLastNameFilter(e.target.value)}
            placeholder="Filtrer par nom"
            className="w-full input input-primary p-2 mb-4 rounded-lg"
          />

          <label htmlFor="contractTypeFilter" className="block mb-2">
            Type de contrat
          </label>
          <input
            type="text"
            id="contractTypeFilter"
            value={contractTypeFilter}
            onChange={(e) => setContractTypeFilter(e.target.value)}
            placeholder="Filtrer par type de contrat"
            className="w-full input input-primary p-2 mb-4 rounded-lg"
          />

          <button
            onClick={() => {
              setOfferFilter("");
              setStatusFilter("");
              setFirstNameFilter("");
              setLastNameFilter("");
              setContractTypeFilter("");
              setFilteredMatches(matches);
            }}
            className="w-full p-3 btn btn-primary"
          >
            Réinitialiser
          </button>
        </div>

        {/* Main Content Section */}
        <div className="w-3/4 pl-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center">
            Offres d&apos;emploi et correspondances associées
          </h1>

          {/* Statistics Section */}
          <div className="bg-base-200 text-white p-4 rounded-lg mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-2">Statistiques</h2>
            <p>
              <span className="font-semibold">Total des correspondances :</span>{" "}
              {stats.totalMatches}
            </p>
            <p>
              <span className="font-semibold">Score moyen :</span>{" "}
              {stats.averageScore} %
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="group-by" className="font-medium mr-2">
              Regrouper par :
            </label>
            <select
              id="group-by"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="select select-primary"
            >
              <option value="offer">Offre</option>
              <option value="applicant">Candidat</option>
            </select>
          </div>

          {Object.keys(groupedMatches).length === 0 ? (
            <p className="text-gray-600">Aucune correspondance trouvée.</p>
          ) : (
            Object.keys(groupedMatches).map((key, index) => (
              <div
                key={index}
                className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-2"
              >
                <input
                  type="radio"
                  name="group-accordion"
                  checked={expandedAccordion === index}
                  onChange={() => handleAccordionToggle(index)}
                  className="peer"
                />
                <div className="collapse-title text-xl font-medium flex justify-between items-center">
                  <span>{key} </span>
                </div>
                {/* Conditionally render MatchInfo only if expanded */}
                <div
                  className={`collapse-content ${
                    expandedAccordion === index ? "expanded" : "collapsed"
                  }`}
                >
                  {expandedAccordion === index &&
                    groupedMatches[key].map((match, matchIndex) => (
                      <>
                        <div className="flex justify-center mb-2 text-primary">
                          <span className="text-lg font-semibold text-center border border-primary rounded-md px-2">
                            {" "}
                            {STATUS_MAP[match.status]}{" "}
                          </span>
                        </div>
                        <MatchInfo
                          key={matchIndex}
                          match={match}
                          type={groupBy === "offer" ? "company" : "applicant"}
                          adminView={true}
                        />
                        <hr className="border-primary my-4" />
                      </>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OfferManagement;
