import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <style>
        {`
            body{ 
                background-image: none !important;
            }
            `}
      </style>
      <div>
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-lg mb-4">
            Désolé, la page que vous recherchez n&apos;existe pas.
          </p>
          <Link to="/" className="text-blue-500">
            Retour à la page d&apos;accueil
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
