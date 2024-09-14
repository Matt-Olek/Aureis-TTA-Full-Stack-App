import React from "react";

interface ApplicantFiltersProps {
  nameFilter: string;
  statusFilter: string;
  handleNameFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ApplicantFilters: React.FC<ApplicantFiltersProps> = ({
  nameFilter,
  statusFilter,
  handleNameFilterChange,
  handleStatusFilterChange,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 my-5">
      <input
        type="text"
        placeholder="Filtrer par nom"
        value={nameFilter}
        onChange={handleNameFilterChange}
        className="input input-bordered border-primary focus:border-green-400 hover:border-green-400"
      />
      <select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        className="select select-bordered border-primary focus:border-green-400 hover:border-green-400"
      >
        <option value="">Filtrer par statut</option>
        <option value="En attente d'inscription">
          En attente d'inscription
        </option>
        <option value="En cours de matching">En cours de matching</option>
      </select>
    </div>
  );
};

export default ApplicantFilters;
