import { useState, useEffect } from "react";
import Axios from "../../utils/Axios";

interface Formation {
  id: number;
  name: string;
  level: string;
}

interface Staff {
  email: string;
  first_name: string;
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_name: string;
  type: string;
}
interface FormationLink {
  manager: number;
  formation: number;
  id: number;
}

const FormationManagement = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [formationLinks, setFormationLinks] = useState<FormationLink[]>([]);
  const [Staff, setStaff] = useState<Staff[]>([]);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    fetchFormations();
    fetchStaff();
    fetchFormationLink();
  }, []);

  // Formations
  const fetchFormations = async () => {
    try {
      const response = await Axios.get<Formation[]>("/formations/");
      console.log(response.data);
      setFormations(response.data);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la récupération des formations."
      );
      console.error(err);
    }
  };
  const fetchFormationLink = async () => {
    try {
      const response = await Axios.get<FormationLink[]>("/formationlink/");
      console.log(response.data);
      setFormationLinks(response.data);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la récupération des liens de formation."
      );
      console.error(err);
    }
  };
  const addFormationLink = async (manager: number, formation: number) => {
    try {
      await Axios.post("/formationlink/", {
        manager,
        formation,
      });
      fetchFormationLink();
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du lien.");
      console.error(err);
    }
  };
  const deleteFormationLink = async (id: number) => {
    try {
      await Axios.delete(`/formationlink/${id}/`);
      setFormationLinks(formationLinks.filter((link) => link.id !== id));
    } catch (err) {
      setError("Une erreur s'est produite lors de la suppression du lien.");
      console.error(err);
    }
  };

  // Staff
  const fetchStaff = async () => {
    try {
      const response = await Axios.get<Staff[]>("/staff/");
      console.log(response.data);
      setStaff(response.data);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la récupération du personnel."
      );
      console.error(err);
    }
  };
  const deleteStaff = async (id: number) => {
    try {
      await Axios.delete(`/staff/${id}/`);
      setStaff(Staff.filter((staff) => staff.id !== id));
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la suppression du personnel."
      );
      console.error(err);
    }
  };

  const createStaff = async () => {
    try {
      const first_name = (
        document.querySelector(
          'input[placeholder="Prénom"]'
        ) as HTMLInputElement
      ).value;

      const last_name = (
        document.querySelector('input[placeholder="Nom"]') as HTMLInputElement
      ).value;

      const email = (
        document.querySelector('input[placeholder="Email"]') as HTMLInputElement
      ).value;

      await Axios.post("/staff/", {
        first_name,
        last_name,
        email,
      });
      fetchStaff();
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du personnel.");
      console.error(err);
    }
  };

  return (
    <>
      <style>
        {`
    body {
      background-image: none !important;
    }
    `}
      </style>
      <div className="flex items-center justify-center mt-10">
        <img
          src="/media/images/icon-matching.svg"
          className="h-20 mb-5 fade-in"
          alt="Entreprises"
        />
      </div>
      <div className=" w-full p-10 rounded-md items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-100 anton">
          Membres du staff
        </h1>
        <div className="overflow-x-scroll w-full mt-10 h-96">
          <table className="table w-full table-zebra">
            <thead className="relative sticky top-0 z-10 bg-base-100">
              <tr>
                <th className="px-4 py-2">Prénom</th>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Formations supervisées</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Staff.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.first_name}</td>
                  <td>{staff.last_name}</td>
                  <td>{staff.email}</td>
                  <td className="flex flex-wrap text-sm">
                    <div className="dropdown dropdown-left">
                      <label tabIndex={0} className="btn btn-ghost ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto z-10"
                      >
                        {formations.map((formation) => (
                          <li key={formation.id}>
                            <a
                              onClick={() =>
                                addFormationLink(staff.id, formation.id)
                              }
                            >
                              {formation.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {formationLinks
                      .filter((link) => link.manager === staff.id)
                      .map((link) => (
                        <div
                          key={link.id}
                          className="text-primary rounded-md p-1 pl-3 m-1"
                        >
                          {
                            formations.find(
                              (formation) => formation.id === link.formation
                            )?.name
                          }
                          <button
                            onClick={() => deleteFormationLink(link.id)}
                            className="btn btn-sm btn-outline btn-error ml-3 mr-1 "
                          >
                            X
                          </button>
                        </div>
                      ))}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        confirm("Voulez-vous supprimer ce membre ?") &&
                        deleteStaff(staff.id)
                      }
                      className="btn btn-sm btn-error"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="my-5" />
        <h1 className="text-3xl font-bold text-gray-100 anton mt-10">
          Ajouter un membre du staff
        </h1>
        <div className="flex items-center justify-center space-x-4 my-5">
          <input
            type="text"
            placeholder="Prénom"
            className="input input-primary input-bordered w-full"
          />

          <input
            type="text"
            placeholder="Nom"
            className="input input-primary input-bordered w-full"
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-primary input-bordered w-full"
          />

          <button onClick={createStaff} className="btn btn-sm btn-primary">
            Créer le membre du staff
          </button>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    </>
  );
};

export default FormationManagement;
