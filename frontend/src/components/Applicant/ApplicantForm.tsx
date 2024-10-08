import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import downloadFile from "../../utils/Download";
import { Sector, Applicant } from "../../types";
interface Choice {
  [key: string]: string;
}

interface ApplicantFormProps {
  applicantId: string | undefined;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ applicantId }) => {
  const [Applicant, setApplicant] = useState<Applicant>({
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    country: "",
    phone: "",
    diploma: "",
    target_educational_level: "",
    duration: "",
    contract_type: "",
    sector: [],
    location: "",
    kilometers_away: -1,
    resume: null,
    formation: null,
    skills: [],
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [targetEducationalLevels, setTargetEducationalLevels] = useState<
    Choice[]
  >([]);
  const [contractTypes, setContractTypes] = useState<Choice[]>([]);
  const [duration, setDuration] = useState<Choice[]>([]);
  const [formations, setFormations] = useState<Choice[]>([]);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await Axios.get("/user/info/");
        setApplicant((prev) => ({
          ...prev,
          first_name: userInfo.data.first_name,
          last_name: userInfo.data.last_name,
          email: userInfo.data.email,
        }));

        const [
          sectorData,
          educationalLevels,
          contractTypesData,
          durationData,
          formationsData,
        ] = await Promise.all([
          Axios.get("/sector/"),
          Axios.get("/choices/", {
            params: { target_educational_level: true },
          }),
          Axios.get("/choices/", { params: { contract_type: true } }),
          Axios.get("/choices/", { params: { duration: true } }),
          Axios.get("/formations/"),
        ]);

        setSectors(sectorData.data);
        console.log("Sectors:", sectorData.data);
        setTargetEducationalLevels(educationalLevels.data);
        setContractTypes(contractTypesData.data);
        setDuration(durationData.data);
        setFormations(formationsData.data);

        try {
          const applicantData = await Axios.get(
            `/applicants/registration/${applicantId}`
          );
          setApplicant(applicantData.data.applicant);
          console.log("Applicant data:", applicantData.data);
        } catch (error) {
          console.error("Applicant not found:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, multiple } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const options = (e.target as HTMLSelectElement).options;
    const files = (e.target as HTMLInputElement).files;
    console.log("Name:", name);
    console.log("Value:", value);

    // Handle multi-select for sectors
    if (name === "sector" && multiple) {
      const selectedSectors: number[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedSectors.push(Number(options[i].value));
        }
      }
      setApplicant((prev) => ({ ...prev, sector: selectedSectors }));
    } else {
      // Handle file input
      if (type === "file") {
        if (files) {
          setFile(files[0]);
        }
      } else {
        setApplicant((prev) => ({ ...prev, [name]: value }));
      }
    }
    console.log("Applicant:", Applicant);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFile = files[0]; // Get the file directly
      setFile(selectedFile); // Set the state for future use if needed
      console.log("File:", selectedFile);
      const formData = new FormData();
      formData.append("resume", selectedFile);

      try {
        const response = await Axios.post("/auto-fill/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Auto-fill response:", response.data);
      } catch (error) {
        console.error("Error auto-filling form:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all the form data fields
    formData.append("first_name", Applicant.first_name);
    formData.append("last_name", Applicant.last_name);
    formData.append("email", Applicant.email);
    formData.append("city", Applicant.city);
    formData.append("country", Applicant.country);
    formData.append("phone", Applicant.phone);
    formData.append("diploma", Applicant.diploma);
    formData.append(
      "target_educational_level",
      Applicant.target_educational_level
        ? String(Applicant.target_educational_level)
        : ""
    );
    formData.append("duration", Applicant.duration);
    formData.append(
      "contract_type",
      Applicant.contract_type ? String(Applicant.contract_type) : ""
    );
    formData.append("location", Applicant.location);
    formData.append("kilometers_away", String(Applicant.kilometers_away));
    formData.append("formation", String(Applicant.formation));
    console.log("Sector:", Applicant.sector);
    Applicant.sector.forEach((sectorId) => {
      formData.append("sector", String(sectorId));
    });
    // Append the resume file
    if (file) {
      formData.append("resume", file);
    }

    try {
      if (applicantId) {
        await Axios.put("/applicants/registration/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fiche candidat mise à jour avec succès!");
      } else {
        await Axios.post("/applicants/registration/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fiche candidat créée avec succès!");
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
        navigate("/#home");
      }, 1000);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(
        "Erreur lors de la création ou mise à jour de la fiche candidat."
      );
    }
  };

  return (
    <>
      <div className="p-6 bg-neutral text-neutral-content shadow-lg space-y-4 w-1/2 mx-auto text-xl my-10 rounded-3xl">
        <h1 className="text-4xl mt-10 font-bold mb-10 text-center lily">
          Ma fiche <span className="text-green-300">candidat</span>
        </h1>
        {Applicant.resume && (
          <button
            className="flex btn btn-primary btn-sm justy-end btn-outline"
            onClick={() => Applicant.resume && downloadFile(Applicant.resume)}
          >
            Télécharger le CV
          </button>
        )}
        <div className="form-control">
          <label htmlFor="resume" className="label">
            <span className="label-text">
              Télécharger le CV (PDF uniquement)
            </span>
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full"
          />
        </div>
        <div className="divider">Informations personnelles</div>
        <form onSubmit={handleSubmit} className=" ">
          <div className="form-control">
            <label htmlFor="formation" className="label">
              <span className="label-text">Formation</span>
            </label>
            <select
              name="formation"
              value={Applicant.formation ? Applicant.formation : ""}
              onChange={handleChange}
              className="select w-full select-bordered"
            >
              <option value="" disabled>
                Sélectionnez la formation dans laquelle vous êtes inscrit
              </option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.name}
                </option>
              ))}
            </select>
          </div>

          <hr />

          <div className="form-control">
            <label htmlFor="first_name" className="label">
              <span className="label-text">Prénom</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={Applicant.first_name}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled
            />
          </div>

          <div className="form-control">
            <label htmlFor="last_name" className="label">
              <span className="label-text">Nom</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={Applicant.last_name}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled
            />
          </div>

          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={Applicant.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled
            />
          </div>

          <hr />

          <div className="form-control">
            <label htmlFor="city" className="label">
              <span className="label-text">Ville de résidence</span>
            </label>
            <input
              type="text"
              name="city"
              value={Applicant.city}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="country" className="label">
              <span className="label-text">Pays</span>
            </label>
            <input
              type="text"
              name="country"
              value={Applicant.country}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="phone" className="label">
              <span className="label-text">Numéro de téléphone</span>
            </label>
            <input
              type="text"
              name="phone"
              value={Applicant.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="diploma" className="label">
              <span className="label-text">Dernier Diplôme obtenu</span>
            </label>
            <input
              type="text"
              name="diploma"
              value={Applicant.diploma}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="target_educational_level" className="label">
              <span className="label-text">Niveau visé</span>
            </label>
            <select
              name="target_educational_level"
              value={Applicant.target_educational_level}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">
                Sélectionnez le niveau d&apos;études visé
              </option>
              {targetEducationalLevels.map((level) => (
                <option key={level[0]} value={level[0]}>
                  {level[1]}
                </option>
              ))}
            </select>
          </div>

          <hr />

          <div className="form-control">
            <label htmlFor="duration" className="label">
              <span className="label-text">Durée</span>
            </label>
            <select
              name="duration"
              value={Applicant.duration}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Sélectionnez la durée</option>
              {duration.map((d) => (
                <option key={d[0]} value={d[0]}>
                  {d[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="contract_type" className="label">
              <span className="label-text">Type de contrat</span>
            </label>
            <select
              name="contract_type"
              value={Applicant.contract_type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Sélectionnez le type de contrat</option>
              {contractTypes.map((ct) => (
                <option key={ct[0]} value={ct[0]}>
                  {ct[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="sector" className="label">
              <span className="label-text">Secteur</span>
            </label>
            <select
              name="sector"
              value={Applicant.sector.map(String)}
              onChange={handleChange}
              className="select select-bordered w-full"
              multiple
            >
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="location" className="label">
              <span className="label-text">Localisation</span>
            </label>
            <input
              type="text"
              name="location"
              value={Applicant.location}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label htmlFor="kilometers_away" className="label">
              <span className="label-text">
                Rayon d&apos;acceptation (en km)
              </span>
            </label>
            <input
              type="number"
              name="kilometers_away"
              value={Applicant.kilometers_away}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {applicantId ? "Mettre à jour" : "Créer"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ApplicantForm;
