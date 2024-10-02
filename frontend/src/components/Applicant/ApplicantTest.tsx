import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Axios from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

// Define types for metadata and form data
interface FieldInfo {
  label: string;
  choices?: { [key: string]: string };
}

interface FormData {
  [key: string]: string;
}

const ApplicationTest = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [fieldMetadata, setFieldMetadata] = useState<{
    [key: string]: FieldInfo;
  }>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch field metadata
    Axios.get("applicant_test/metadata/")
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

    // Fetch existing applicant data
    Axios.get("applicant_test/")
      .then((response) => {
        setFormData(response.data as FormData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [user]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    Axios.post("applicant_test/", formData)
      .then((response) => {
        console.log("Updated successfully:", response.data);
        toast.success("Données mises à jour avec succès");
        navigate("/#home"); // Redirect to home page after successful update
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  const renderField = (fieldName: string, fieldInfo: FieldInfo) => {
    const choices = fieldInfo.choices
      ? Object.entries(fieldInfo.choices) // Convert the choices object to an array of [value, label]
      : [];

    if (choices.length > 0) {
      // Render a select field for choices
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

    // Render a text input for other fields
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
          <span className="text-primary ">Test</span> de personnalité
        </h1>
        <hr className="border-primary my-4" />
        <p className="text-center text-white manrope">En moins de 2 minutes</p>
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

export default ApplicationTest;
