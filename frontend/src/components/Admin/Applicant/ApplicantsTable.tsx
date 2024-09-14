import React from "react";

interface Applicant {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  diploma?: string;
  contract_type?: string;
  location?: string;
  link_inscription?: string;
}

interface ApplicantsTableProps {
  applicants: Applicant[];
}

interface ActionDropdownOption {
  label: string;
  action: () => void;
}

interface ActionDropdownProps {
  options: ActionDropdownOption[];
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ applicants }) => {
  return (
    <div className="overflow-x-scroll w-full mt-10 h-96">
      <table className="table w-full">
        <thead className="relative sticky top-0 z-10 bg-base-100">
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Diplôme</th>
            <th>Type de contrat</th>
            <th>Emplacement</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={index}>
              <td>{applicant.first_name}</td>
              <td>{applicant.last_name}</td>
              <td>{applicant.email}</td>
              <td>{applicant.phone || "-"}</td>
              <td>{applicant.diploma || "-"}</td>
              <td>{applicant.contract_type || "-"}</td>
              <td>{applicant.location || "-"}</td>
              <td>
                {applicant.link_inscription ? (
                  <span className="badge bg-blue-300 text-blue-900 p-3">
                    Inscription
                  </span>
                ) : (
                  <span className="badge bg-primary text-primary-content p-3">
                    Matching
                  </span>
                )}
              </td>
              <td>
                <ActionDropdown
                  options={
                    applicant.link_inscription
                      ? [
                          { label: "Supprimer", action: () => {} },
                          { label: "Relancer", action: () => {} },
                          {
                            label: "Copier le lien d'inscription",
                            action: () => {
                              navigator.clipboard.writeText(
                                applicant.link_inscription as string
                              );
                              alert("Lien copié !");
                            },
                          },
                        ]
                      : [
                          { label: "Infos", action: () => {} },
                          { label: "Supprimer", action: () => {} },
                        ]
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({ options }) => (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn m-1 btn-ghost text-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
      </svg>
    </div>
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
    >
      {options.map((option, index) => (
        <li key={index}>
          <a onClick={option.action}>{option.label}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default ApplicantsTable;
