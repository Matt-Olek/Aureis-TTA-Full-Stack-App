const TempApplicantForm = ({
  newApplicant,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <div className="modal-action">
          <h1 className="text-3xl font-bold text-center my-10 anton">
            Ajouter un candidat
          </h1>
          <form onSubmit={handleSubmit} className="rounded m-5 w-full">
            <input
              type="text"
              className="input input-primary w-full p-2 rounded m-2"
              id="first_name"
              name="first_name"
              placeholder="Prénom"
              value={newApplicant.first_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="input input-primary w-full p-2 rounded m-2"
              id="last_name"
              name="last_name"
              placeholder="Nom"
              value={newApplicant.last_name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              className="input input-primary w-full p-2 rounded m-2"
              id="email"
              name="email"
              placeholder="Email"
              value={newApplicant.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="w-full btn btn-secondary mt-4">
              Contacter
            </button>
          </form>
        </div>
        <button
          className="btn btn-outline mt-4"
          onClick={() => document.getElementById("my_modal_1").close()}
        >
          Fermer
        </button>
      </div>
    </dialog>
  );
};

export default TempApplicantForm;
