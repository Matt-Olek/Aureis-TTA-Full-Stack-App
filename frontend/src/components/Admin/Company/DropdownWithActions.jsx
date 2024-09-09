const DropdownWithActions = ({ registrationLink }) => (
  <div className="dropdown dropdown-end">
    <div tabIndex="0" role="button" className="btn btn-ghost h-5 w-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
      </svg>
    </div>
    <ul
      tabIndex="0"
      className="dropdown-content menu bg-base-100 rounded-box z-150 w-52 p-2 shadow"
    >
      <li>
        <a>Supprimer</a>
      </li>
      <li>
        <a>Relancer</a>
      </li>
      <li>
        <a onClick={() => navigator.clipboard.writeText(registrationLink)}>
          Copier le lien
        </a>
      </li>
    </ul>
  </div>
);

export default DropdownWithActions;
