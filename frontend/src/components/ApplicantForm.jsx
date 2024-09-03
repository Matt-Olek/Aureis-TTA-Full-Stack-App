import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Axios from '../utils/Axios';

const ApplicantForm = () => {
  const [initialValues, setInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    city: '',
    country: '',
    phone: '',
    diploma: '',
    target_educational_level: '',
    duration: '-1',
    contract_type: '',
    sector: [],
    location: '',
    kilometers_away: -1,
    is_not_signed_in_school: false,
    do_accept_school: false,
  });

  const [sectors, setSectors] = useState([]);
  const [targetEducationalLevels, setTargetEducationalLevels] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [applicantId, setApplicantId] = useState(null);
  const [duration, setDuration] = useState([]);
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    Axios.get('/user/info/').then((response) => {
      setInitialValues({
        ...initialValues,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      });
    });
    Axios.get('/sector/').then((response) => {
      setSectors(response.data);
    });
    Axios.get('/choices/', { params: { 'target_educational_level': true } }).then((response) => {
      setTargetEducationalLevels(response.data);
    });
    Axios.get('/choices/', { params: { 'contract_type': true } }).then((response) => {
      setContractTypes(response.data);
    });
    Axios.get('/choices/', { params: { 'duration': true } }).then((response) => {
      setDuration(response.data);
    });
    Axios.get('/formations/').then((response) => {
      setFormations(response.data);
    });


    Axios.get('/applicants/registration/').then((response) => {
      if (response.data) {
        setInitialValues(response.data.applicant);
        console.log(response.data.applicant);
        setApplicantId(response.data.applicant.id);
      }
    });

  }, []);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    city: Yup.string().required('La ville est requise'),
    country: Yup.string().required('Le pays est requis'),
    phone: Yup.string().required('Le numéro de téléphone est requis'),
    diploma: Yup.string().required('Le diplôme est requis'),
    target_educational_level: Yup.string().required('Le niveau d\'études visé est requis'),
    duration: Yup.string().required('La durée est requise'),
    contract_type: Yup.string().required('Le type de contrat est requis'),
    location: Yup.string().required('Le lieu de travail souhaité est requis'),
  });

  const handleSubmit = (values) => {
    if (applicantId) {
      // Update existing applicant
      Axios.put(`/applicants/registration/`, values).then(() => {
        alert('Fiche candidat mise à jour avec succès!');
      });
    } else {
      // Create new applicant
      Axios.post('/applicants/registration/', values).then(() => {
        alert('Fiche candidat créée avec succès!');
      });
    }
  };

  return (
    <>
    <style>
                {`
                body {
                    font-family: 'Nunito', sans-serif;
                    background-image: none !important;
                    }
                    `}
            </style>
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    enableReinitialize={true}
    onSubmit={handleSubmit}
  >
    {() => (
      <Form className="p-6 bg-stone-900 text-white rounded-lg shadow-md space-y-4 w-1/2 mx-auto">
        <p className=" mt-10 font-bold mb-10 text-center manrope">Veuillez remplir les champs suivants avec attention</p>
        <div className="form-control">
          <label htmlFor="formation" className="label">
            <span className="label-text">Formation</span>
          </label>
          <Field as="select" name="formation" className="select select-bordered w-full">
            <option value="">Sélectionnez la formation dans laquelle vous êtes inscrit</option>
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
        <div className="form-control">
          <label htmlFor="first_name" className="label">
            <span className="label-text">Prénom</span>
          </label>
          <Field type="text" name="first_name" className="input input-bordered w-full" disabled/>
        </div>

        <div className="form-control">
          <label htmlFor="last_name" className="label">
            <span className="label-text">Nom</span>
          </label>
          <Field type="text" name="last_name" className="input input-bordered w-full" disabled/>
        </div>

        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <Field type="email" name="email" className="input input-bordered w-full" disabled/>
        </div>

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
          <Field
            type="text"
            name="country"
            className="input input-bordered w-full"
          />
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
          <Field as="select" name="target_educational_level" className="select select-bordered w-full">
            <option value="">Sélectionnez le niveau d&apos;études visé</option>
            {targetEducationalLevels.map((level) => (
              <option key={level[0]} value={level[0]} >
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
  
        <div className="form-control">
          <label htmlFor="duration" className="label">
            <span className="label-text">Durée du contrat</span>
          </label>
          <Field as="select" name="duration" className="select select-bordered w-full">
            <option value="-1">Sélectionnez la durée</option>
            {duration.map((duration) => (
              <option key={duration[0]} value={duration[0]}>
                {duration[1]}
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
            <span className="label-text">Contract Type</span>
          </label>
          <Field as="select" name="contract_type" className="select select-bordered w-full">
            <option value="">Sélectionnez le type de contrat</option>
            {contractTypes.map((contractType) => (
              <option key={contractType[0]} value={contractType[0]}>
                {contractType[1]}
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
            <span className="label-text">Secteur d&apos;activité (Ctrl + clic pour sélectionner plusieurs)</span>
          </label>
          <Field as="select" name="sector" multiple={true} className="select select-bordered w-full h-12">
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </Field>
        </div>
  
        <div className="form-control">
          <label htmlFor="location" className="label">
            <span className="label-text">Ville de travail souhaitée</span>
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
            <span className="label-text">Distance maximale souhaitée (km)</span>
          </label>
          <Field as="select" name="kilometers_away" className="select select-bordered w-full">
            <option value="-1">Aucune préférence</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </Field>
          <ErrorMessage
            name="kilometers_away"
            component="div"
            className="text-error mt-1"
          />
        </div>
  
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Je ne suis pas inscrit dans une école</span>
            <Field
              type="checkbox"
              name="is_not_signed_in_school"
              className="checkbox"
            />
          </label>
        </div>
  
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Je ne souhaite pas être contacté par les écoles</span>
            <Field
              type="checkbox"
              name="do_accept_school"
              className="checkbox"
            />
          </label>
        </div>
  
        <button type="submit" className="btn w-full bg-green-300 text-white">
          Enregistrer
        </button>
      </Form>
    )}
  </Formik>
  </> 
  
  );
};

export default ApplicantForm;
