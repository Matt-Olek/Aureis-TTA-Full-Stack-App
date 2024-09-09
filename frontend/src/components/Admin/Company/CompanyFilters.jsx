const CompanyFilters = ({
  nameFilter,
  statusFilter,
  handleNameFilterChange,
  handleStatusFilterChange,
}) => (
  <div className="flex items-center space-x-4 my-5 justify-center">
    <input
      type="text"
      value={nameFilter}
      onChange={handleNameFilterChange}
      className="input input-bordered border-green-300 focus:border-green-400 hover:border-green-400"
      placeholder="Filtrer par nom"
    />
    <select
      value={statusFilter}
      onChange={handleStatusFilterChange}
      className="select select-bordered border-green-300 focus:border-green-400 hover:border-green-400"
    >
      <option value="">Filtrer par statut</option>
      <option value="En attente d'inscription">En attente d'inscription</option>
      <option value="En cours de matching">En cours de matching</option>
    </select>
  </div>
);

export default CompanyFilters;
