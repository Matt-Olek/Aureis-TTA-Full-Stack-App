import { Link } from 'react-router-dom'; // Import if you're using React Router for routing

const Search = () => {
  return (
    <section className='h-full '>
      <div className="flex justify-center">
        <div className="w-full lg:w-12/12 lg:mt-20">
          <div className="text-white">
            <div className="p-5 rounded-3xl bg-stone-900 shadow-lg h-1/2">
                <h1 className="text-4xl font-semibold text-center lily mb-10">Rechercher dans les données</h1>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">

                  <Link
                    to="/admin/search/applicant" 
                    className="bg-transparent border border-pink-300 text-pink-300 hover:bg-pink-300 hover:text-white text-lg font-semibold py-2 px-4 rounded-full w-full block text-center"
                  >
                    Rechercher un <span className="text-green-400">candidat</span>
                  </Link>
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <Link
                    to="/admin/search/company"
                    className="bg-transparent border border-green-300 text-green-300 hover:bg-green-300 hover:text-white text-lg font-semibold py-2 px-4 rounded-full w-full block text-center"
                  >
                    Rechercher une <span className="text-pink-300">entreprise</span>
                  </Link>
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <Link
                    to="/admin/search/match" 
                    className="bg-transparent border border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-white text-lg font-semibold py-2 px-4 rounded-full w-full block text-center"
                  >
                    Rechercher un <span className="text-yellow-400">match</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
