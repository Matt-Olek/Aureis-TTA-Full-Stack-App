import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ApplicationTest = () => {
  const [formData, setFormData] = useState({});
  const [fieldMetadata, setFieldMetadata] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch field metadata
    Axios.get("applicant_test/metadata/")
      .then((response) => {
        const metadata = response.data;
        console.log("Fetched metadata:", metadata); // Debugging output
        setFieldMetadata(metadata);
        const initialData = {};
        Object.keys(metadata).forEach((field) => {
          initialData[field] = ""; // Initialize form fields with empty values
        });
        setFormData(initialData);
      })
      .catch((error) => console.error("Error fetching metadata:", error));

    // Fetch existing applicant data
    Axios.get(`applicant_test/`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [user.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.put(`applicant_test/`, formData)
      .then((response) => {
        console.log("Updated successfully:", response.data);
        navigate("/"); // Redirect to home page after successful update
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  const renderField = (fieldName, fieldInfo) => {
    const choices = fieldInfo.choices
      ? Object.entries(fieldInfo.choices) // Convert the choices object to an array of [value, label]
      : [];

    if (choices.length > 0) {
      // Render a select field for choices
      return (
        <div key={fieldName}>
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
