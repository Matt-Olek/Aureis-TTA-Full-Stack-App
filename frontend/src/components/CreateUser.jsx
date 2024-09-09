import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";

const CreateUser = ({ type }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const getURL =
    type === "company"
      ? `/temp-companies/${token}/`
      : `/temp-applicants/${token}/`;

  const initialState =
    type === "company"
      ? {
          name: "",
          email: "",
          password: "",
          confirm_password: "",
        }
      : {
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
        };

  const [formData, setFormData] = useState(initialState);
  // State to hold errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data by token
  useEffect(() => {
    const fetchTempApplicantData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(getURL);
        if (type === "company") {
          const { name, email } = response.data;
          setFormData((prev) => ({
            ...prev,
            name,
            email,
          }));
        } else {
          const { first_name, last_name, email } = response.data;
          setFormData((prev) => ({
            ...prev,
            first_name,
            last_name,
            email,
          }));
        }
        setLoading(false);
      } catch (error) {
        setErrors({ fetch: "Le lien n'est pas valide." });
        setLoading(false);
      }
    };

    fetchTempApplicantData();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setErrors({ password: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      setLoading(true);
      const response = await Axios.post("/user/register/", {
        token,
        password: formData.password,
      });

      setSuccessMessage(response.data.message);
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 1000); // Redirect after 3 seconds
    } catch (error) {
      setErrors({
        submit: error.response?.data?.detail || "Une erreur s'est produite.",
      });
      console.log(error.response?.data);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center manrope">
      <div className="bg-stone-900 p-8 rounded-lg shadow-md w-full max-w-md mt-10">
        <img
          src="/media/images/icon-man.svg"
          alt="man"
          className="w-12 mx-auto mb-6"
        />
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Créez votre compte
        </h2>
        <p className="text-gray-500 mb-6 ">
          Ca n&apos;est pas vous ? Contactez l&apos;administrateur.
        </p>

        {loading && <p className="text-gray-500">Loading...</p>}
        {errors.fetch && <p className="text-red-500">{errors.fetch}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "company" && (
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled
                className="w-full rounded p-2 text-neutral bg-gray-100"
              />
            </div>
          )}
          {type === "applicant" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled
                  className="input w-full"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Créez votre mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {errors.password && <p className="text-red-500">{errors.password}</p>}
          {errors.submit && <p className="text-red-500">{errors.submit}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
