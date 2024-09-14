import React, { useEffect, useState } from "react";
import ApplicantForm from "./ApplicantForm";
import axios from "axios";

const ApplicantPage: React.FC = () => {
  const [applicantId, setApplicantId] = useState<string>("");
  const fetchApplicantId = async () => {
    try {
      const response = await axios.get("/applicant/registration/");
      setApplicantId(response.data.id);
      console.log(response.data);
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
