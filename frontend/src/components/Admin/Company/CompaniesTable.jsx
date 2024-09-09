import DropdownWithActions from "./DropdownWithActions";
import DropdownWithInfo from "./DropdownWithInfo";

const CompaniesTable = ({ companies }) => (
  <div className="">
    <table className="table w-full">
      <thead>
        <tr>
          <th>Nom de l&apos;entreprise</th>
          <th>Email</th>
          <th>Secteur</th>
          <th>Code APE</th>
          <th>Adresse</th>
          <th>Ville</th>
          <th>Code postal</th>
          <th>Pays</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company, index) => (
          <tr key={index}>
            <td>{company.name}</td>
            <td>{company.email}</td>
            <td>{company.sector}</td>
            <td>{company.codeAPE}</td>
            <td>{company.address}</td>
            <td>{company.city}</td>
            <td>{company.zip_code}</td>
            <td>{company.country}</td>
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
