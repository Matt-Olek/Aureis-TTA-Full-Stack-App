import React, { ChangeEvent, FormEvent } from "react";

interface Company {
  name: string;
  email: string;
}

interface CompanyModalProps {
  newCompany: Company;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  newCompany,
  handleInputChange,
  handleSubmit,
}) => (
  <dialog id="company_modal" className="modal">
    <div className="modal-box">
      <div className="modal-action">
        <h1 className="text-3xl font-bold text-center my-10 anton">
          Ajouter une entreprise
        </h1>
        <form onSubmit={handleSubmit} className="rounded m-5 w-full">
          <input
            type="text"
            className="manrope input input-primary w-full p-2 rounded m-2"
            id="name"
            name="name"
            placeholder="Nom de l'entreprise"
            value={newCompany.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            className="manrope input input-primary w-full p-2 rounded m-2"
            id="email"
            name="email"
            placeholder="Email"
            value={newCompany.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="w-full btn btn-secondary mt-4">
            Ajouter
          </button>
        </form>
      </div>
      <button
        className="btn btn-outline mt-4"
        onClick={() =>
          (
            document.getElementById("company_modal") as HTMLDialogElement
          ).close()
        }
      >
        Fermer
      </button>
    </div>
  </dialog>
);

export default CompanyModal;
