import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Axios from "../../utils/Axios";

interface InitialValues {
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  diploma: string;
  target_educational_level: string;
  duration: string;
  contract_type: string;
  sector: string[];
  location: string;
  kilometers_away: number;
  is_not_signed_in_school: boolean;
  do_accept_school: boolean;
}

interface Sector {
  id: string;
  name: string;
}

interface Choice {
  [key: string]: string;
}

interface ApplicantFormProps {
  applicantId: string | undefined;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ applicantId }) => {
  const [initialValues, setInitialValues] = useState<InitialValues>({
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    country: "",
    phone: "",
    diploma: "",
    target_educational_level: "",
    duration: "-1",
    contract_type: "",
    sector: [],
    location: "",
    kilometers_away: -1,
    is_not_signed_in_school: false,
    do_accept_school: false,
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [targetEducationalLevels, setTargetEducationalLevels] = useState<
    Choice[]
  >([]);
  const [contractTypes, setContractTypes] = useState<Choice[]>([]);
  const [duration, setDuration] = useState<Choice[]>([]);
  const [formations, setFormations] = useState<Choice[]>([]);
  const navigate = useNavigate();
  const [isModification, setIsModification] = useState(false);

  useEffect(() => {
    Axios.get("/user/info/").then((response) => {
      setInitialValues({
        ...initialValues,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      });
    });
    Axios.get("/sector/").then((response) => {
      setSectors(response.data);
    });
    Axios.get("/choices/", { params: { target_educational_level: true } }).then(
      (response) => {
        setTargetEducationalLevels(response.data);
      }
    );
    Axios.get("/choices/", { params: { contract_type: true } }).then(
      (response) => {
        setContractTypes(response.data);
      }
    );
    Axios.get("/choices/", { params: { duration: true } }).then((response) => {
      setDuration(response.data);
    });
    Axios.get("/formations/").then((response) => {
      setFormations(response.data);
    });

    Axios.get("/applicants/registration/").then((response) => {
      if (response.data) {
        setInitialValues(response.data.applicant);
        console.log(response.data.applicant);
        setIsModification(true);
      }
    });
  }, []);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    city: Yup.string().required("La ville est requise"),
    country: Yup.string().required("Le pays est requis"),
    phone: Yup.string().required("Le numéro de téléphone est requis"),
    diploma: Yup.string().required("Le diplôme est requis"),
    target_educational_level: Yup.string().required(
      "Le niveau d'études visé est requis"
    ),
    duration: Yup.string().required("La durée est requise"),
    contract_type: Yup.string().required("Le type de contrat est requis"),
    location: Yup.string().required("Le lieu de travail souhaité est requis"),
  });

  const handleSubmit = (values: InitialValues) => {
    if (isModification) {
      // Update existing applicant
      Axios.put(`/applicants/registration/`, values).then(() => {
        window.alert("Fiche candidat mise à jour avec succès!");
        navigate("/#home"); // Redirect to the home page
      });
    } else {
      // Create new applicant
      Axios.post("/applicants/registration/", values).then(() => {
        window.alert("Fiche candidat créée avec succès!");
        navigate("/#home"); // Redirect to the home page
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="p-6 bg-neutral text-neutral-content shadow-md space-y-4 w-1/2 mx-auto text-xl my-10 rounded-3xl border border-accent">
            <h1 className="text-4xl mt-10 font-bold mb-10 text-center lily">
              Ma fiche <span className="text-green-300">candidat</span>
            </h1>

            <p className="mt-10 font-bold mb-10 text-center manrope">
              Veuillez remplir les champs suivants avec attention
            </p>
            <div className="form-control">
              <label htmlFor="formation" className="label">
                <span className="label-text">Formation</span>
              </label>
              <Field
                as="select"
                name="formation"
                className="select w-full select-bordered"
              >
                <option value="" disabled selected>
                  Sélectionnez la formation dans laquelle vous êtes inscrit
                </option>
                {formations.map((formation) => (
                  <option key={formation.id} value={formation.id}>
                    {formation.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="formation"
                component="div"
                className="text-error mt-1"
              />
            </div>
            <hr />

            <div className="form-control">
              <label htmlFor="first_name" className="label">
                <span className="label-text">Prénom</span>
              </label>
              <Field
                type="text"
                name="first_name"
                className="input input-bordered w-full"
                disabled
              />
            </div>

            <div className="form-control">
              <label htmlFor="last_name" className="label">
                <span className="label-text">Nom</span>
              </label>
              <Field
                type="text"
                name="last_name"
                className="input input-bordered w-full"
                disabled
              />
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <Field
                type="email"
                name="email"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            <hr />

            <div className="form-control">
              <label htmlFor="city" className="label">
                <span className="label-text">Ville de résidence</span>
              </label>
              <Field
                type="text"
                name="city"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="country" className="label">
                <span className="label-text">Pays</span>
              </label>
              <Field type="text" name="country" className="input w-full" />
              <ErrorMessage
                name="country"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="phone" className="label">
                <span className="label-text">Numéro de téléphone</span>
              </label>
              <Field
                type="text"
                name="phone"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="diploma" className="label">
                <span className="label-text">Dernier Diplôme obtenu</span>
              </label>
              <Field
                type="text"
                name="diploma"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="diploma"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="target_educational_level" className="label">
                <span className="label-text">Niveau visé</span>
              </label>
              <Field
                as="select"
                name="target_educational_level"
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
              </Field>
              <ErrorMessage
                name="target_educational_level"
                component="div"
                className="text-error mt-1"
              />
            </div>
            <hr />
            <div className="form-control">
              <label htmlFor="duration" className="label">
                <span className="label-text">Durée</span>
              </label>
              <Field
                as="select"
                name="duration"
                className="select select-bordered w-full"
              >
                <option value="">Sélectionnez la durée</option>
                {duration.map((d) => (
                  <option key={d[0]} value={d[0]}>
                    {d[1]}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="duration"
                component="div"
                className="text-error mt-1"
              />
            </div>
            <div className="form-control">
              <label htmlFor="contract_type" className="label">
                <span className="label-text">Type de contrat</span>
              </label>
              <Field
                as="select"
                name="contract_type"
                className="select select-bordered w-full"
              >
                <option value="">Sélectionnez le type de contrat</option>
                {contractTypes.map((type) => (
                  <option key={type[0]} value={type[0]}>
                    {type[1]}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="contract_type"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="sector" className="label">
                <span className="label-text">Secteur</span>
              </label>
              <Field
                as="select"
                name="sector"
                multiple={true}
                className="select select-bordered w-full"
              >
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="sector"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="location" className="label">
                <span className="label-text">Lieu de travail souhaité</span>
              </label>
              <Field
                type="text"
                name="location"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label htmlFor="kilometers_away" className="label">
                <span className="label-text">
                  Distance maximum en kilomètres (-1 si pas de préférence, sinon
                  5,10,50,100)
                </span>
              </label>
              <Field
                type="number"
                name="kilometers_away"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="kilometers_away"
                component="div"
                className="text-error mt-1"
              />
            </div>

            <div className="form-control">
              <label
                htmlFor="is_not_signed_in_school"
                className="label cursor-pointer"
              >
                <span className="label-text">Non inscrit dans une école</span>
              </label>
              <Field
                type="checkbox"
                name="is_not_signed_in_school"
                className="checkbox checkbox-primary"
              />
            </div>

            <div className="form-control">
              <label
                htmlFor="do_accept_school"
                className="label cursor-pointer"
              >
                <span className="label-text">
                  Accepter une école partenaire
                </span>
              </label>
              <Field
                type="checkbox"
                name="do_accept_school"
                className="checkbox checkbox-primary"
              />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary btn-lg mt-6">
                Soumettre
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ApplicantForm;
