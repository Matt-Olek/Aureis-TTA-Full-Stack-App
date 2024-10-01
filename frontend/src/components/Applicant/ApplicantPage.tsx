import React, { useEffect, useState } from "react";
import ApplicantForm from "./ApplicantForm";
import Axios from "../../utils/Axios";

const ApplicantPage: React.FC = () => {
  const [applicantId, setApplicantId] = useState<string>("");
  const fetchApplicantId = async () => {
    try {
      const response = await Axios.get("/applicants/registration/");
      setApplicantId(response.data.applicant.id);
      console.log("Applicant ID:", response.data.applicant.id);
    } catch (error) {
      console.error("Error fetching applicant ID:", error);
    }
  };

  useEffect(() => {
    fetchApplicantId();
  }, []);

  return (
    <div>
      <ApplicantForm applicantId={applicantId} />
    </div>
  );
};

export default ApplicantPage;
