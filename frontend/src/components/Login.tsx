import React, { useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const { login } = useAuth(); // Use the login function from context
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    const loadingToast = toast.loading("Connexion en cours..."); // Show loading toast
    event.preventDefault(); // Prevent default form submission

    try {
      await login(email, password); // Call the login function from AuthContext
      setTimeout(() => {
        toast.dismiss(loadingToast); // Dismiss loading toast
        toast.success("Connexion réussie !");
        setTimeout(() => {
          navigate("/"); // Redirect to home page after successful login
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.error(
          "Identifiant ou mot de passe incorrect. Veuillez réessayer."
        );
      }, 1000);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center filter">
      <div className="lg:w-1/4 bg-stone-900 flex flex-col items-center justify-center lg:rounded-3xl w-full h-full p-4 lg:h-auto lg:p-8 shadow-lg">
        <div className="anton mt-4 p-5 w-full">
          <img
            src="/media/images/icon-man.svg"
            className="mx-auto mb-4 h-16"
            alt="Icon"
          />
          <h1 className="text-xl text-center text-white mb-4">Connexion</h1>
          <form id="login-form" className="w-full" onSubmit={handleLogin}>
            <div className="form-group mb-4">
              <label htmlFor="email" className="block text-white mb-1">
                Adresse email
              </label>
              <input
                type="email"
                className="manrope input w-full p-2 rounded text-gray-100"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="block text-white mb-1">
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="manrope input w-full p-2 rounded text-gray-100"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-6">
              <input
                type="checkbox"
                id="show-password"
                className="mr-2"
                checked={showPassword}
                onChange={handleShowPassword}
              />
              <label htmlFor="show-password" className="text-white">
                Afficher le mot de passe
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-300 hover:bg-pink-400 text-stone-900 py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Se connecter
            </button>
          </form>
          <p className="text-white mt-4">
            Mot de passe oublié ?{" "}
            <a
              href="/reset-password-email"
              className="text-green-300 hover:text-green-400"
            >
              Cliquez ici pour le réinitialiser
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
