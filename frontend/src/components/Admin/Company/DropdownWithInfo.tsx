import React from "react";
import { Company } from "../../../types";
import Axios from "../../../utils/Axios";

interface DropdownWithInfoProps {
  companyId: number;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}

const DropdownWithInfo: React.FC<DropdownWithInfoProps> = ({
  companyId,
  companies,
  setCompanies,
}) => {
  const deleteCompany = async (id: number) => {
    try {
      await Axios.delete(`/company/${id}`);
      // Update the state after deleting the company
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Failed to delete company", error);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
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
        className="dropdown-content menu bg-base-100 rounded-box z-150 w-52 p-2 shadow"
      >
        <li>
          <a onClick={() => deleteCompany(companyId)}>Supprimer</a>
        </li>
      </ul>
    </div>
  );
};

export default DropdownWithInfo;
