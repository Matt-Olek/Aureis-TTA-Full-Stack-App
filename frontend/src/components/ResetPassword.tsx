import { useLocation } from "react-router-dom";
import { useState } from "react";
import Axios from "../utils/Axios";

function ResetPassword() {
  const search = useLocation().search;
  const uid = new URLSearchParams(search).get("uid");
  const token = new URLSearchParams(search).get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword === confirmPassword) {
      try {
        await Axios.post("/password-reset/", {
          uid,
          token,
          new_password: newPassword,
        });
        setSuccessMessage("PMot de passe réinitialisé avec succès");
      } catch (error) {
        console.error(error);
        setErrorMessage("Erreur lors de la réinitialisation du mot de passe");
      }
    } else {
      setErrorMessage("Les mots de passe ne correspondent pas");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <div className="w-full max-w-md p-8 space-y-6 card shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-base-800">
          Réinitialiser le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Nouveau Mot de Passe</span>
            </label>
            <input
              type="password"
              placeholder="Entrez le nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Confirmer le mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Réinitialiser le mot de passe
          </button>
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm text-center">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
