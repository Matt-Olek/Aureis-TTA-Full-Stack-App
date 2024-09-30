import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import Axios from "../../utils/Axios";
import { useAuth } from "../../contexts/AuthContext";

interface FieldInfo {
  label: string;
  choices?: { [key: string]: string };
}

interface FormData {
  [key: string]: string;
}

const CompanyTest = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [fieldMetadata, setFieldMetadata] = useState<{
    [key: string]: FieldInfo;
  }>({});
  const { token } = useParams<{ token: string }>(); // Extract token from the URL
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("Token:", token); // Debugging output

  useEffect(() => {
    // Fetch field metadata
    Axios.get("company_test/metadata/")
      .then((response) => {
        const metadata = response.data as { [key: string]: FieldInfo };
        console.log("Fetched metadata:", metadata); // Debugging output
        setFieldMetadata(metadata);
        const initialData: FormData = {};
        Object.keys(metadata).forEach((field) => {
          initialData[field] = ""; // Initialize form fields with empty values
        });
        setFormData(initialData);
      })
      .catch((error) => console.error("Error fetching metadata:", error));
  }, [user]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    Axios.put(`company_test/${token}/`, formData) // Use the token in the API call
      .then((response) => {
        console.log("Updated successfully:", response.data);
        navigate("/thanks-test"); // Redirect to home page after successful update
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  const renderField = (fieldName: string, fieldInfo: FieldInfo) => {
    const choices = fieldInfo.choices ? Object.entries(fieldInfo.choices) : [];

    if (choices.length > 0) {
      return (
        <div key={fieldName} className="relative">
          <label className="label">{fieldInfo.label}:</label>
          <select
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleChange}
            className="select w-full"
          >
            <option value="" disabled>
              {" "}
              -- Choisir une option --{" "}
            </option>
            {choices.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {formData[fieldName] && formData[fieldName] !== "" && (
            <span className="absolute right-2 top-2 text-green-500">✔</span>
          )}
        </div>
      );
    }

    return (
      <div key={fieldName}>
        <label>{fieldInfo.label}:</label>
        <input
          type="text"
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleChange}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="lg:w-1/2 w-full bg-base-200 p-5 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mt-6 text-center text-white lily">
          <span className="text-primary">Test</span> de personnalité
        </h1>
        <hr className="border-primary my-4" />
        <p className="text-center text-white manrope">
          Vous avez été invité à remplir ce test afin de mieux cerner le profil
          de l'alternant que vous recherchez.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(fieldMetadata).map(([fieldName, fieldInfo]) =>
            renderField(fieldName, fieldInfo)
          )}
          <button type="submit" className="btn btn-primary mt-4 w-full">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyTest;
