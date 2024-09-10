import './StatusTimeline.css';

const StatusTimeline = ({ status }) => {
    const statusSteps = [
        { name: "Pending", label: "Matché" },
        { name: "Accepted_company", label: "Accepté par l'entreprise" },
        // { name: "Queue_company", label: "En file d'attente de l'entreprise" },
        // { name: "Canceled_company", label: "Annulé par l'entreprise" },
        // { name: "Canceled_applicant", label: "Annulé par le candidat" },
        { name: "Fully_accepted", label: "Accepté par le candidat" },
        { name: "Finalized_enrollment", label: "Inscription finalisée" }
    ];

    const isCanceled = status === "Canceled_company" || status === "Canceled_applicant";
    const currentIndex = statusSteps.findIndex(step => step.name === status);

    return (
        <>
        <ul className={`timeline timeline-vertical ${isCanceled ? "canceled" : ""}`}>
            {statusSteps.map((step, index) => (
                <li key={step.name} className={index <= currentIndex && !isCanceled ? "active" : ""}>
                    {isCanceled ? <div className="timeline-canceled">Annulé</div> : null}
                    {index > 0 && <hr />}
                    <div className="timeline-start">{index + 1}</div>
                    <div className="timeline-middle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`h-5 w-5 ${index <= currentIndex && !isCanceled ? "text-primary" : "text-grey-400"}`}>
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className={`timeline-end timeline-box ${index <= currentIndex && !isCanceled ? "bg-primary text-white" : "bg-gray-200"}`}>
                        {step.label}
                    </div>
                </li>
            ))}
        </ul>
        </>
    );
};


export default StatusTimeline;