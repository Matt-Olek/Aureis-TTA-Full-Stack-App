import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";

// Define types for the component props
interface CreateUserProps {
  type: "company" | "applicant";
}

// Define types for form data and errors
interface FormDataCompany {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface FormDataApplicant {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface Errors {
  fetch?: string;
  password?: string;
  submit?: string;
}

const CreateUser: React.FC<CreateUserProps> = ({ type }) => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const initialState: FormDataCompany | FormDataApplicant =
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

  const [formData, setFormData] = useState<FormDataCompany | FormDataApplicant>(
    initialState
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTempApplicantData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          type === "company"
            ? `/temp-companies/${token}/`
            : `/temp-applicants/${token}/`
        );
        if (type === "company") {
          const { name, email } = response.data;
          setFormData(
            (prevFormData) =>
              ({
                ...prevFormData,
                name,
                email,
              } as FormDataCompany)
          );
        } else {
          const { first_name, last_name, email } = response.data;
          setFormData(
            (prevFormData) =>
              ({
                ...prevFormData,
                first_name,
                last_name,
                email,
              } as FormDataApplicant)
          );
        }
        setLoading(false);
      } catch {
        setErrors({
          fetch:
            "Une erreur s'est produite lors de la récupération des données.",
        });
        setLoading(false);
      }
    };

    fetchTempApplicantData();
  }, [token, type, formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (formData as FormDataCompany).password !==
      (formData as FormDataCompany).confirm_password
    ) {
      setErrors({ password: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      setLoading(true);
      const response = await Axios.post("/user/register/", {
        token,
        password: (formData as FormDataCompany).password,
      });

      setSuccessMessage(response.data.message);
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 1000); // Redirect after 1 second
    } catch {
      setErrors({
        submit: "Une erreur s'est produite lors de la création du compte.",
      });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <p className="text-gray-500 mb-6">
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
                value={(formData as FormDataCompany).name}
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
                  value={(formData as FormDataApplicant).first_name}
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
                  value={(formData as FormDataApplicant).last_name}
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
              value={(formData as FormDataCompany | FormDataApplicant).email}
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
              value={(formData as FormDataCompany | FormDataApplicant).password}
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
              value={
                (formData as FormDataCompany | FormDataApplicant)
                  .confirm_password
              }
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
