import React from "react";
import ApplicantForm from "./ApplicantForm";

const ApplicantPage: React.FC = () => {
  const applicantId: string = "1";

  return (
    <div>
      <ApplicantForm applicantId={applicantId} />
    </div>
  );
};

export default ApplicantPage;
