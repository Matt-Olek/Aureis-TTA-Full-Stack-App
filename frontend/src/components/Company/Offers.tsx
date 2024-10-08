import React, { useState, useEffect, ChangeEvent } from "react";
import Axios from "../../utils/Axios";
import { Offer } from "../../types";
import toast from "react-hot-toast";

const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contractTypes, setContractTypes] = useState<[string, string][]>([]);
  const [educationalLevels, setEducationalLevels] = useState<
    [string, string][]
  >([]);
  const [newOffer, setNewOffer] = useState<Offer>({
    title: "",
    same_entity_location: false,
    location: "",
    contract_type: "Autre",
    target_educational_level: "",
    description: "",
    skills: [],
    is_active: false,
    token: "",
  });
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  useEffect(() => {
    Axios.get("offers/").then((response) => {
      setOffers(response.data);
    });

    Axios.get("choices/", { params: { target_educational_level: true } }).then(
      (response) => {
        setEducationalLevels(response.data);
        setNewOffer((prevOffer) => ({
          ...prevOffer,
          target_educational_level: response.data[0][0],
        }));
      }
    );
    Axios.get("choices/", { params: { contract_type: true } }).then(
      (response) => {
        setContractTypes(response.data);
        setNewOffer((prevOffer) => ({
          ...prevOffer,
          contract_type: response.data[0][0],
        }));
      }
    );
  }, []);

  const handleAddOffer = () => {
    Axios.post("offers/", newOffer)
      .then((response) => {
        setOffers((prevOffers) => [...prevOffers, response.data]);
        (document.getElementById("offer_modal") as HTMLDialogElement)?.close();
        setNewOffer({
          title: "",
          same_entity_location: false,
          location: "",
          contract_type: contractTypes[0][0],
          target_educational_level: "",
          description: "",
          skills: [],
          is_active: false,
          token: "",
        }); // Reset form fields
        toast.success(
          "Besoin ajouté avec succès ! N'oubliez pas de transmettre le lien de test au tuteur pour activer l'offre.",
          {
            duration: 10000,
          }
        );
      })
      .catch((error) => {
        console.error("Error adding offer:", error);
      });
  };

  const handleEditOffer = () => {
    if (editingOffer) {
      Axios.put(`offers/${editingOffer.id}/`, editingOffer)
        .then((response) => {
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === editingOffer.id ? response.data : offer
            )
          );
          setEditingOffer(null);
          (
            document.getElementById("offer_modal") as HTMLDialogElement
          )?.close();
        })
        .catch((error) => {
          console.error("Error editing offer:", error);
        });
    }
  };

  const handleDeleteOffer = (id: number) => {
    Axios.delete(`offers/${id}/`)
      .then(() => {
        setOffers((prevOffers) =>
          prevOffers.filter((offer) => offer.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting offer:", error);
      });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingOffer) {
      setEditingOffer(
        (prevOffer) => ({ ...prevOffer, [name]: value } as Offer)
      );
    } else {
      setNewOffer((prevOffer) => ({ ...prevOffer, [name]: value }));
    }
  };

  return (
    <>
      <style>{`
        body {
          background-image: none !important;
        }
      `}</style>
      <div className="w-full flex flex-col items-center justify-center mt-10">
        <div className="lg:w-1/2 w-full">
          <h1 className="text-4xl font-bold mt-6 text-center text-white lily">
            Vos besoins en <span className="text-primary">recrutement</span>
          </h1>
          <p className="text-center text-gray-300 mt-2">
            Chez TrouveTonAlternance, nous sommes convaincus que chaque besoin
            demande une attention particulière. C'est pourquoi, pour chaque
            besoin, afin d'activer l'offre, nous vous demandons de transmettre
            le lien d'un rapide test au futur tuteur de l'alternant afin de
            cerner au mieux ses attentes.
          </p>

          <hr className="my-5 border-gray-500" />

          <p className="text-left text-white">
            <span className="h-3 w-3 ml-2">
              <span className="animate-ping inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>{" "}
            : Besoin actif
          </p>

          <p className="text-left text-white">
            <span className="h-3 w-3 ml-2">
              <span className="animate-ping inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>{" "}
            : Besoin inactif, le test n'a pas été transmis
          </p>

          <div className="w-full my-10 p-2">
            {offers.map((offer) => (
              <div
                className="collapse collapse-arrow  bg-base-200 my-2 border hover:border-primary transition-all"
                key={offer.id}
              >
                <input
                  type="radio"
                  name="my-accordion"
                  id={`offer-${offer?.id}`}
                />
                <div className="collapse-title text-xl font-medium">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>{offer.title}</span>
                      {!offer.is_active ? (
                        <span className="relative flex h-3 w-3 ml-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      ) : (
                        <span className="relative flex h-3 w-3 ml-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <span>{offer.created_at?.substring(0, 10)}</span>
                  </div>
                </div>
                <div className="collapse-content">
                  <div className="form-data space-y-2 mb-4 p-2">
                    <div className="flex items-center">
                      <strong className="w-1/3">Ville :</strong>
                      <span className="w-2/3">{offer.location}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="w-1/3">Type de contrat :</strong>
                      <span className="w-2/3">{offer.contract_type}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="w-1/3">Niveau d'éducation :</strong>
                      <span className="w-2/3">
                        {offer.target_educational_level}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <strong className="w-1/3">Description :</strong>
                      <span className="w-2/3">{offer.description}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="w-1/3">Compétences :</strong>
                      <span className="w-2/3">{offer.skills.join(", ")}</span>
                    </div>
                  </div>
                  {!offer.is_active &&
                    (() => {
                      const testUrl =
                        import.meta.env.VITE_DOMAIN + "test/" + offer.token;
                      return (
                        <div className="flex flex-col w-full mb-4">
                          <label className="font-semibold mb-2">
                            <span className="relative flex h-3 w-3 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Lien de test :
                          </label>
                          <div className="flex justify-between p-2 border border-gray-300 rounded-md">
                            <a
                              href={testUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" hover:underline decoration-none text-primary"
                            >
                              {testUrl}
                            </a>
                            <button
                              className="btn btn-sm ml-4"
                              onClick={() => {
                                navigator.clipboard.writeText(testUrl);
                                toast.success("Lien copié !");
                              }}
                            >
                              Copier le lien
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  <div className="flex justify-end mt-2">
                    <div className="flex items-center">
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => {
                          setEditingOffer(offer);
                          (
                            document.getElementById(
                              "offer_modal"
                            ) as HTMLDialogElement
                          ).showModal();
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteOffer(offer.id!)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-outline-primary w-full"
            onClick={() => {
              setEditingOffer(null);
              (
                document.getElementById("offer_modal") as HTMLDialogElement
              ).showModal();
            }}
          >
            Créer un nouveau besoin
          </button>

          <dialog id="offer_modal" className="modal">
            <div className="modal-box">
              <h3 className="text-2xl font-bold text-center text-white anton">
                {editingOffer
                  ? "Modifier le besoin"
                  : "Créer un nouveau besoin"}
              </h3>

              <div className="py-4">
                <input
                  type="text"
                  name="title"
                  value={editingOffer ? editingOffer.title : newOffer.title}
                  onChange={handleInputChange}
                  placeholder="Intitulé"
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  name="location"
                  value={
                    editingOffer ? editingOffer.location : newOffer.location
                  }
                  onChange={handleInputChange}
                  placeholder="Ville"
                  className="input input-bordered w-full mb-2"
                />
                <select
                  name="contract_type"
                  value={
                    editingOffer
                      ? editingOffer.contract_type
                      : newOffer.contract_type
                  }
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-2"
                >
                  {contractTypes.map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  name="target_educational_level"
                  value={
                    editingOffer
                      ? editingOffer.target_educational_level
                      : newOffer.target_educational_level
                  }
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-2"
                >
                  {educationalLevels.map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <textarea
                  name="description"
                  value={
                    editingOffer
                      ? editingOffer.description
                      : newOffer.description
                  }
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="textarea textarea-bordered w-full mb-2"
                ></textarea>
              </div>

              <div className="modal-action">
                {editingOffer ? (
                  <button className="btn" onClick={handleEditOffer}>
                    Enregistrer les modifications
                  </button>
                ) : (
                  <button className="btn" onClick={handleAddOffer}>
                    Enregistrer
                  </button>
                )}
                <button
                  className="btn"
                  onClick={() =>
                    (
                      document.getElementById(
                        "offer_modal"
                      ) as HTMLDialogElement
                    )?.close()
                  }
                >
                  Annuler
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
};

export default Offers;
