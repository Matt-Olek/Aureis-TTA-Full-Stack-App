import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { Match, STATUS_MAP } from "../../types";
import MatchInfo from "../MatchInfo";

const CompanyMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState<string>("score");

  useEffect(() => {
    Axios.get("matches/")
      .then((response: { data: Match[] }) => {
        setMatches(response.data);
        console.log("Fetched matches:", response.data);
      })
      .catch((error: unknown) =>
        console.error("Error fetching matches:", error)
      );
  }, []);

  const sortMatches = (criteria: string) => {
    setSortBy(criteria);
    const sortedMatches = [...matches].sort((a, b) => {
      if (criteria === "score") {
        return b.score - a.score;
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });
    setMatches(sortedMatches);
  };

  const handleAccordionToggle = (id: number) => {
    setExpandedAccordion((prevExpanded) => (prevExpanded === id ? null : id));
  };

  return (
    <div className="p-5 pt-0">
      <div className="w-full flex justify-between items-center bg-base-200 rounded-lg shadow-md p-5 my-5">
        <h1 className="text-3xl font-bold">
          Vos matchs (<span className="text-secondary">{matches.length}</span>)
        </h1>
        <div className="space-x-2">
          <button
            className={`btn btn-primary ${
              sortBy === "score" ? "" : "btn-outline"
            }`}
            onClick={() => sortMatches("score")}
          >
            Trier par score
          </button>
          <button
            className={`btn btn-secondary ${
              sortBy === "date" ? "" : "btn-outline"
            }`}
            onClick={() => sortMatches("date")}
          >
            Trier par date
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
          >
            <input
              type="radio"
              name="my-accordion"
              checked={expandedAccordion === match.id}
              onChange={() => handleAccordionToggle(match.id)}
            />
            <div className="collapse-title text-xl font-medium">
              <div className="flex justify-between items-center">
                <span>
                  {match.offer.title} -{" "}
                  <span className="text-primary">{match.offer.location}</span>
                </span>
                <span className="text-primary border border-primary rounded-md px-2">
                  {STATUS_MAP[String(match.status) as keyof typeof STATUS_MAP]}
                </span>
                <span>
                  {new Date(match.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
            {/* Conditionally render MatchInfo only if expanded */}
            <div className="collapse-content">
              {expandedAccordion === match.id && (
                <MatchInfo match={match} type="company" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyMatches;
