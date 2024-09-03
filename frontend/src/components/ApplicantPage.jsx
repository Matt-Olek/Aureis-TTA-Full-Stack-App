import ApplicantForm from './ApplicantForm';

const ApplicantPage = () => {
  const applicantId = null; // Replace with actual applicant ID if editing

  return (
    <div>
      <h1 className="text-4xl mt-10 font-bold mb-10 text-center lily">Ma fiche <span className="text-green-300">candidat</span></h1>
      <ApplicantForm applicantId={applicantId} />
    </div>
  );
};

export default ApplicantPage;
