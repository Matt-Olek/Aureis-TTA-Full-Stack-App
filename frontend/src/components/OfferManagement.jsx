import { useState, useEffect } from 'react';
import Axios from '../utils/Axios';

const OfferManagement = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [groupBy, setGroupBy] = useState('offer'); 
  const [openItems, setOpenItems] = useState({});
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [offerFilter, setOfferFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  
  // New candidate filters
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [diplomaFilter, setDiplomaFilter] = useState('');
  const [targetEducationalLevelFilter, setTargetEducationalLevelFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [contractTypeFilter, setContractTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [formationFilter, setFormationFilter] = useState('');
  const [formations, setFormations] = useState([]);
  
  useEffect(() => {
    Axios.get('/formations/')
      .then(response => {
        setFormations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the formations!', error);
      });
  }, []);
  
  useEffect(() => {
    Axios.get('/match_applicants/', {
      params: {
        formation : formationFilter,
        offer: offerFilter,
        company: companyFilter,
        status: statusFilter,
        first_name: firstNameFilter,
        last_name: lastNameFilter,
        city: cityFilter,
        country: countryFilter,
        phone: phoneFilter,
        diploma: diplomaFilter,
        target_educational_level: targetEducationalLevelFilter,
        duration: durationFilter,
        contract_type: contractTypeFilter,
        location: locationFilter,
      }
    })
    .then(response => {
      setMatches(response.data);
      setFilteredMatches(response.data); // Set initial filtered matches
    })
    .catch(error => {
      console.error('There was an error fetching the matches!', error);
    });
    Axios.get('/formations/')
    .then(response => {
      setFormations(response.data);
    })

  }, [offerFilter,companyFilter, statusFilter, firstNameFilter, lastNameFilter, cityFilter, countryFilter, phoneFilter, diplomaFilter, targetEducationalLevelFilter, durationFilter, contractTypeFilter, locationFilter,formationFilter]);

  // Function to calculate statistics
  const calculateStatistics = () => {
    if (filteredMatches.length === 0) return {
      totalMatches: 0,
      averageScore: 0,
    };

    const totalMatches = filteredMatches.length;
    const totalScore = filteredMatches.reduce((sum, match) => sum + match.score, 0);
    const averageScore = (totalScore / totalMatches).toFixed(2);

    return {
      totalMatches,
      averageScore,
    };
  };

  const stats = calculateStatistics();

  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const key = groupBy === 'offer' ? match.offer : match.application;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(match);
    return acc;
  }, {});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <style>
        {`
        body {
            background-image: none !important;

        }
          .group-card-content {
            transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
            overflow: hidden;
          }

          .group-card-content.collapsed {
            max-height: 0;
            opacity: 0;
          }

          .group-card-content.expanded {
            max-height: 1000px;
            opacity: 1;
          }
        `}
      </style>

      <div className="p-6 flex w-full bg-stone-900">
         {/* Filter Section */}
         <div className="w-1/4 h-full bg-stone-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filtres</h3>

          <h1 className="text-xl font-bold mb-4">Filtrer par formation</h1>
          <select
            id="formationFilter"
            value={formationFilter}
            onChange={(e) => setFormationFilter(e.target.value)}
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          >
            <option value="">Toutes les formations</option>
            {formations.map((formation, index) => (
              <option key={index} value={formation.id}>{formation.name}</option>
            ))}

          </select>
          <h1 className="text-xl font-bold mb-4">Filtres de Besoin</h1>

          <label htmlFor="offerFilter" className="block mb-2">Filtrer par Besoin</label>
          <input 
            type="text" 
            id="offerFilter" 
            value={offerFilter} 
            onChange={(e) => setOfferFilter(e.target.value)} 
            placeholder="Filtrer par nom de besoin"
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

            <label htmlFor="companyFilter" className="block mb-2">Filtrer par Entreprise</label>
            <input
                type="text" 
                id="companyFilter"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                placeholder="Filtrer par nom d'entreprise"
                className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
            />
            
          
          <hr className="my-4" />
          <h1 className="text-xl font-bold mb-4">Filtres de candidat</h1>

          {/* New candidate filters */}
          <label htmlFor="firstNameFilter" className="block mb-2">Prénom</label>
          <input 
            type="text" 
            id="firstNameFilter" 
            value={firstNameFilter} 
            onChange={(e) => setFirstNameFilter(e.target.value)} 
            placeholder="Filtrer par prénom" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="lastNameFilter" className="block mb-2">Nom</label>
          <input 
            type="text" 
            id="lastNameFilter" 
            value={lastNameFilter} 
            onChange={(e) => setLastNameFilter(e.target.value)} 
            placeholder="Filtrer par nom" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="cityFilter" className="block mb-2">Ville</label>
          <input 
            type="text" 
            id="cityFilter" 
            value={cityFilter} 
            onChange={(e) => setCityFilter(e.target.value)} 
            placeholder="Filtrer par ville" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="countryFilter" className="block mb-2">Pays</label>
          <input 
            type="text" 
            id="countryFilter" 
            value={countryFilter} 
            onChange={(e) => setCountryFilter(e.target.value)} 
            placeholder="Filtrer par pays" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="phoneFilter" className="block mb-2">Téléphone</label>
          <input 
            type="text" 
            id="phoneFilter" 
            value={phoneFilter} 
            onChange={(e) => setPhoneFilter(e.target.value)} 
            placeholder="Filtrer par téléphone" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="diplomaFilter" className="block mb-2">Diplôme</label>
          <input 
            type="text" 
            id="diplomaFilter" 
            value={diplomaFilter} 
            onChange={(e) => setDiplomaFilter(e.target.value)} 
            placeholder="Filtrer par diplôme" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="targetEducationalLevelFilter" className="block mb-2">Niveau de diplôme visé</label>
          <input 
            type="text" 
            id="targetEducationalLevelFilter" 
            value={targetEducationalLevelFilter} 
            onChange={(e) => setTargetEducationalLevelFilter(e.target.value)} 
            placeholder="Filtrer par niveau de diplôme" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="durationFilter" className="block mb-2">Durée du contrat</label>
          <input 
            type="text" 
            id="durationFilter" 
            value={durationFilter} 
            onChange={(e) => setDurationFilter(e.target.value)} 
            placeholder="Filtrer par durée" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="contractTypeFilter" className="block mb-2">Type de contrat</label>
          <input 
            type="text" 
            id="contractTypeFilter" 
            value={contractTypeFilter} 
            onChange={(e) => setContractTypeFilter(e.target.value)} 
            placeholder="Filtrer par type de contrat" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />

          <label htmlFor="locationFilter" className="block mb-2">Lieu désiré</label>
          <input 
            type="text" 
            id="locationFilter" 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)} 
            placeholder="Filtrer par lieu désiré" 
            className="w-full p-2 mb-4 rounded-lg border border-stone-700 bg-stone-700 text-white"
          />




          <button 
            onClick={() => {
              setOfferFilter('');
              setStatusFilter('');
              setFirstNameFilter('');
              setLastNameFilter('');
              setCityFilter('');
              setCountryFilter('');
              setPhoneFilter('');
              setDiplomaFilter('');
              setTargetEducationalLevelFilter('');
              setDurationFilter('');
              setContractTypeFilter('');
              setLocationFilter('');
              setFilteredMatches(matches);
            }} 
            className="w-full p-3 bg-green-500 rounded-lg text-stone-900 font-bold mt-4 hover:bg-green-600"
          >
            Réinitialiser
          </button>
        </div>

        {/* Main Content Section */}
        <div className="w-3/4 pl-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center">Offres d&apos;emploi et correspondances associées</h1>

          {/* Statistics Section */}
          <div className="bg-stone-800 text-white p-4 rounded-lg mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-2">Statistiques</h2>
            <p><span className="font-semibold">Total des correspondances :</span> {stats.totalMatches}</p>
            <p><span className="font-semibold">Score moyen :</span> {stats.averageScore} %</p>
          </div>

          <div className="mb-4">
            <label htmlFor="group-by" className="font-medium mr-2">Regrouper par :</label>
            <select 
              id="group-by" 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value)} 
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="offer">Offre</option>
              <option value="applicant">Candidat</option>
            </select>
          </div>

          {Object.keys(groupedMatches).length === 0 ? (
            <p className="text-gray-600">Aucune correspondance trouvée.</p>
          ) : (
            Object.keys(groupedMatches).map((key, index) => (
              <div key={index} className="group-card mb-6">
                <button 
                  className="group-card-header text-xl font-semibold text-white p-4 rounded-t-md w-full text-left transition duration-300 ease-in-out focus:outline-none bg-stone-800"
                  onClick={() => toggleItem(key)}
                >
                  {groupBy === 'offer' ? `Besoin : ${key}` : `Candidat : ${key}`}
                </button>
                <div className={`group-card-content text-white rounded-b-md p-2 bg-stone-700 ${openItems[key] ? 'expanded' : 'collapsed'}`}>
                  {groupedMatches[key].map((match, matchIndex) => (
                    <div key={matchIndex} className="match-card p-4 mb-3 bg-stone-900 rounded-md shadow-md">
                      {groupBy === 'offer' ? (
                        <p className="mb-2"><span className="font-semibold"></span> {match.application}</p>
                      ) : (
                        <p className="mb-2"><span className="font-semibold"></span> {match.offer}</p>
                      )}
                      <p><span className="font-semibold">Score total :</span> {match.score} %</p>
                      <div className="flex space-x-4 my-3">
                        <div className="relative">
                          <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold">Industrie {match.industry_score} %</span>
                        </div>
                        <div className="relative">
                          <span className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-semibold">Test {match.test_score} %</span>
                        </div>
                        <div className="relative">
                          <span className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold">Géographie {match.geographic_score} %</span>
                        </div>
                        <div className="relative">
                          <span className="bg-yellow-500 text-white rounded-full px-3 py-1 text-sm font-semibold">CV {match.resume_score} %</span>
                        </div>
                      </div>
                      <p className="mb-2"><span className="font-semibold">Statut :</span> {match.status}</p>
                      <p className="mb-2"><span className="font-semibold">Créé le :</span> {new Date(match.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OfferManagement;
