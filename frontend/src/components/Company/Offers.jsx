import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [educationalLevels, setEducationalLevels] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: "",
    same_entity_location: false,
    location: "",
    contract_type: "Autre",
    target_educational_level: "",
    description: "",
    skills: [],
  });
  const [editingOffer, setEditingOffer] = useState(null);

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
        document.getElementById("offer_modal").close(); // Close modal after adding the offer
        setNewOffer({
          title: "",
          same_entity_location: false,
          location: "",
          contract_type: contractTypes[0][0],
          target_educational_level: "",
          description: "",
          skills: [],
        }); // Reset form fields
      })
      .catch((error) => {
        console.error("Error adding offer:", error);
      });
  };

  const handleEditOffer = () => {
    Axios.put(`offers/${editingOffer.id}/`, editingOffer)
      .then((response) => {
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === editingOffer.id ? response.data : offer
          )
        );
        setEditingOffer(null);
        document.getElementById("offer_modal").close();
      })
      .catch((error) => {
        console.error("Error editing offer:", error);
      });
  };

  const handleDeleteOffer = (id) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingOffer) {
      setEditingOffer((prevOffer) => ({ ...prevOffer, [name]: value }));
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

          <div className="w-full my-10 p-2">
            {offers.map((offer) => (
              <div
                className="collapse bg-base-200 my-2 border hover:border-primary transition-all"
                key={offer.id}
              >
                <input
                  type="radio"
                  name="my-accordion"
                  id={`offer-${offer.id}`}
                />
                <div
                  className="collapse-title text-xl font-medium"
                  htmlFor={`offer-${offer.id}`}
                >
                  <div className="flex justify-between">
                    <span>{offer.title}</span>
                    <span>{offer.created_at.substring(0, 10)}</span>
                  </div>
                </div>
                <div className="collapse-content">
                  <p>
                    <strong>Ville :</strong> {offer.location}
                  </p>
                  <p>
                    <strong>Type de contrat :</strong> {offer.contract_type}
                  </p>
                  <p>
                    <strong>Niveau d&apos;éducation :</strong>{" "}
                    {offer.target_educational_level}
                  </p>
                  <p>
                    <strong>Description :</strong> {offer.description}
                  </p>
                  <p>
                    <strong>Compétences :</strong> {offer.skills.join(", ")}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => {
                        setEditingOffer(offer);
                        document.getElementById("offer_modal").showModal();
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button to open the modal for adding a new offer */}
          <button
            className="btn btn-outline-primary w-full"
            onClick={() => {
              setEditingOffer(null);
              document.getElementById("offer_modal").showModal();
            }}
          >
            Créer un nouveau besoin
          </button>

          {/* Modal using dialog element */}
          <dialog id="offer_modal" className="modal">
            <div className="modal-box">
              <h3 className="text-2xl font-bold text-center text-white anton">
                {editingOffer
                  ? "Modifier le besoin"
                  : "Créer un nouveau besoin"}
              </h3>

              <div className="py-4">
                {/* Input fields for offer details */}
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

              {/* Modal action buttons */}
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
                  onClick={() => document.getElementById("offer_modal").close()}
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
