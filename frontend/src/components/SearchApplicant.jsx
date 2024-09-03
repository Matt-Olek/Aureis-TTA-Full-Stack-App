import { useState, useEffect } from 'react';
import Axios from '../utils/Axios';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    activate_city: false,
    city: '',
    activate_diploma: false,
    diploma: '',
    activate_target_educational_level: false,
    target_educational_level: '',
    activate_contract_type: false,
    contract_type: '',
    activate_sector: false,
    sector: [], // Array to handle multiple sectors
  });

  const [searchResults, setSearchResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [sectors, setSectors] = useState([]); // State to hold sector data

  useEffect(() => {
    fetchSectors();
  }, []);

  useEffect(() => {
    updateSearchResults();
  }, [formData]);

  const fetchSectors = async () => {
    try {
      const response = await Axios.get('sector/');
      setSectors(response.data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSectorChange = (e) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      sector: prevState.sector.includes(value)
        ? prevState.sector.filter(item => item !== value)
        : [...prevState.sector, value],
    }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (formData.activate_city && formData.city) params.append('city', formData.city);
    if (formData.activate_diploma && formData.diploma) params.append('diploma', formData.diploma);
    if (formData.activate_target_educational_level && formData.target_educational_level) params.append('target_educational_level', formData.target_educational_level);
    if (formData.activate_contract_type && formData.contract_type) params.append('contract_type', formData.contract_type);
    if (formData.activate_sector && formData.sector.length > 0) params.append('sector', formData.sector.join(',')); // Handling multiple sectors
    return params.toString();
  };

  const updateSearchResults = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await Axios.get(`search/applicant/?${queryParams}`);
      console.log('Search results:', response.data);
      setSearchResults(response.data);
      setResultCount(response.data.length);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const downloadExcel = () => {
    // Implementation for downloading the table as Excel
    // You might need a library like SheetJS or similar for this functionality
  };

  return (
    <div className="container mx-auto mb-24">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl mt-20">
          <div className="bg-stone-900 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-center mb-8">
              Rechercher un <span className="text-pink-300">candidat</span>
            </h1>
            <form id="searchForm" className="space-y-6">
              {[
                { name: 'city', label: 'Ville', type: 'text' },
                { name: 'diploma', label: 'Dernier diplôme', type: 'text' },
                { name: 'target_educational_level', label: 'Niveau visé', type: 'text' },
                { name: 'contract_type', label: 'Type de contrat', type: 'text' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col mb-4">
                  
                  <label className="text-white mb-2"><input
                    type="checkbox"
                    name={`activate_${field.name}`}
                    checked={formData[`activate_${field.name}`]}
                    onChange={handleCheckboxChange}
                    className="form-checkbox mb-2 mr-2"
                  /> {field.label}</label>
                  {formData[`activate_${field.name}`] && (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="p-2 border border-stone-300 rounded w-full"
                      placeholder={`Enter ${field.label}`}
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col mb-4">
               
                <label className="text-white mb-2"> <input
                  type="checkbox"
                  name="activate_sector"
                  checked={formData.activate_sector}
                  onChange={handleCheckboxChange}
                  className="form-checkbox mb-2 mr-2"
                />Secteurs</label>
                {formData.activate_sector && (
                  <div>
                    <label className="block text-white mb-2">Sélectionnez :</label>
                    <select
                      multiple
                      value={formData.sector}
                      onChange={handleSectorChange}
                      className="p-2 border border-stone-300 rounded w-full"
                    >
                      {sectors.map(sector => (
                        <option key={sector.id} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </form>

            <hr className="my-6 border-stone-700" />
            <div className="bg-green-300 text-stone-900 p-4 rounded-lg">
              <p id="resultCount" className="text-2xl text-center mb-0">
                {resultCount} {resultCount === 1 ? 'résultat' : 'résultats'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-7xl">
          <div className="bg-stone-900 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-center mb-8">Résultats</h1>
            <div className="text-center mb-4">
              <button
                id="downloadExcel"
                className="bg-green-300 text-stone-900 py-2 px-4 rounded hover:bg-stone-900 hover:text-white"
                onClick={downloadExcel}
              >
                Télécharger en Excel
              </button>
            </div>
            <table id="searchResults" className="w-full mt-4 border-collapse">
              <thead>
                <tr className="bg-stone-700">
                  <th className="p-2 border-b">Prénom</th>
                  <th className="p-2 border-b">Nom</th>
                  <th className="p-2 border-b">Ville</th>
                  <th className="p-2 border-b">Email</th>
                  <th className="p-2 border-b">Téléphone</th>
                  <th className="p-2 border-b">Niveau visé</th>
                  <th className="p-2 border-b">Dernier Diplôme</th>
                  <th className="p-2 border-b">Contrat</th>
                  <th className="p-2 border-b">Pays</th>
                  <th className="p-2 border-b">Lieu de travail</th>
                  <th className="p-2 border-b">CV</th>
                </tr>
              </thead>
              <tbody>
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-stone-700 cursor-pointer" onClick={() => window.location.href = `/applicant/${applicant.id}`}>
                      <td className="p-2 border-b">{applicant.first_name}</td>
                      <td className="p-2 border-b">{applicant.last_name}</td>
                      <td className="p-2 border-b">{applicant.city}</td>
                      <td className="p-2 border-b">{applicant.email}</td>
                      <td className="p-2 border-b">{applicant.phone}</td>
                      <td className="p-2 border-b">{applicant.target_educational_level}</td>
                      <td className="p-2 border-b">{applicant.diploma}</td>
                      <td className="p-2 border-b">{applicant.contract_type}</td>
                      <td className="p-2 border-b">{applicant.country}</td>
                      <td className="p-2 border-b">{applicant.location}</td>
                      <td className="p-2 border-b text-center">
                        <a href={applicant.resume} target="_blank" className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                          CV
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center p-4">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
