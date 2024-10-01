import { useState } from "react";
import Axios from "../utils/Axios";

function ResetPasswordEmail() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await Axios.post("/password-reset-email/", { email });
      setSuccessMessage(
        "Un e-mail de réinitialisation du mot de passe a été envoyé."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe."
      );
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
              <span className="label-text">Adresse E-mail</span>
            </label>
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Envoyer l'e-mail de réinitialisation
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

export default ResetPasswordEmail;
