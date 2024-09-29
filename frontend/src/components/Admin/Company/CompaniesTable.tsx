import React from "react";
import DropdownWithActions from "./DropdownWithActions";
import DropdownWithInfo from "./DropdownWithInfo";
import { Company } from "./types";

interface CompaniesTableProps {
  companies: Company[];
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ companies }) => (
  <div className="overflow-x-scroll w-full mt-10 h-96">
    <table className="table w-full table-zebra">
      <thead className="relative sticky top-0 z-10 bg-base-100">
        <tr>
          <th>Nom de l&apos;entreprise</th>
          <th>Email</th>
          <th>Secteur</th>
          <th>Code APE</th>
          {/* <th>Adresse</th> */}
          <th>Ville</th>
          {/* <th>Code postal</th> */}
          {/* <th>Pays</th> */}
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <tr key={company.id}>
            <td>{company.name}</td>
            <td>{company.email}</td>
            <td>{company.sector}</td>
            <td>{company.codeAPE}</td>
            {/* <td>{company.address}</td> */}
            <td>{company.city}</td>
            {/* <td>{company.zip_code}</td> */}
            {/* <td>{company.country}</td> */}
            <td>
              {company.link_inscription ? (
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
              {company.registrationLink ? (
                <DropdownWithActions
                  registrationLink={company.registrationLink}
                />
              ) : (
                <DropdownWithInfo companyId={company.id} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CompaniesTable;
