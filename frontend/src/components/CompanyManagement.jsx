import { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useFlyingMessage } from '../App';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [tempCompanies, setTempCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [filteredTempCompanies, setFilteredTempCompanies] = useState([]);
    const [newCompany, setNewCompany] = useState({ name: '', email: '' });
    const [messages, setMessages] = useState([]);
    const showMessage = useFlyingMessage();

    const [columnDefs] = useState([
        { headerName: "Nom de l'entreprise", field: 'name', filter: true },
        { headerName: 'Email', field: 'email', filter: true },
        { headerName: 'Secteur', field: 'sector', filter: true },
        { headerName: 'Code APE', field: 'codeAPE', filter: true },
        { headerName: 'Adresse', field: 'address', filter: true },
        { headerName: 'Ville', field: 'city', filter: true },
        { headerName: 'Code postal', field: 'zip_code', filter: true },
        { headerName: 'Pays', field: 'country', filter: true },
        {
            headerName: 'Statut', field: 'status', filter: true,
            valueGetter: (params) => {
                if (params.data.registrationLink) {
                    return `En attente d'inscription (${new Date(params.data.date_created).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })})`;
                }
                return 'En cours de matching';
            }
        },
        {
            headerName: 'Actions', field: 'actions', filter: false, sortable: false,
            cellRenderer: (params) => {
                const { registrationLink, id } = params.data;
                if (registrationLink) {
                    return (
                        <div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="btn btn-ghost h-5 w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </div>
                            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-150 w-52 p-2 shadow">
                                <li><a>Supprimer</a></li>
                                <li><a>Relancer</a></li>
                                <li><a onClick={() => navigator.clipboard.writeText(registrationLink)}>Copier le lien</a></li>
                            </ul>
                        </div>
                    );
                }
                return (
                    <div className="dropdown dropdown-end">
                        <div tabIndex="0" role="button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </div>
                        <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-150 w-52 p-2 shadow">
                            <li><a href={`/company_info/${id}`}>Infos</a></li>
                            <li><a href={`/delete_company/${id}`}>Supprimer</a></li>
                        </ul>
                    </div>
                );
            }
        }
    ]);

    const fetchCompanies = async () => {
        try {
            const response = await Axios.get('/companies/');
            setCompanies(response.data.companies);
            setTempCompanies(response.data.temp_companies);
            setFilteredCompanies(response.data.companies);
            setFilteredTempCompanies(response.data.temp_companies);
            console.log(response.data);
        } catch (error) {
            showMessage('Erreur lors du chargement des entreprises', 5000);
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCompany((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('/companies/', newCompany);
            setMessages(response.data.messages);
            setNewCompany({ name: '', email: '' });
            const updatedCompanies = await Axios.get('/companies/');
            setCompanies(updatedCompanies.data.companies);
            setTempCompanies(updatedCompanies.data.temp_companies);
            showMessage('Entreprise ajoutée avec succès', 3000);
            fetchCompanies();
        } catch (error) {
            console.error('Error submitting new company:', error);
        }
    };

    // Function to calculate company status counts
    const getStatusCounts = () => {
        const counts = { 'En attente d\'inscription': 0, 'En cours de matching': 0 };
        [...companies, ...tempCompanies].forEach((company) => {
            if (company.registrationLink) {
                counts['En attente d\'inscription']++;
            } else {
                counts['En cours de matching']++;
            }
        });
        return counts;
    };

    const statusCounts = getStatusCounts();
    const data = {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1,
        }],
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
            <dialog id="company_modal" className="modal">
                <div className="modal-box">
                    <div className="modal-action">
                        <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">Ajouter une entreprise</h1>
                        <form onSubmit={handleSubmit} className="rounded m-5 w-full">
                            <input
                                type="text"
                                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                                id="name"
                                name="name"
                                placeholder="Nom de l'entreprise"
                                value={newCompany.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={newCompany.email}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-pink-300 hover:bg-pink-400 text-stone-900 py-2 px-4 rounded transition duration-300 ease-in-out"
                            >
                                Ajouter
                            </button>
                        </form>
                    </div>
                    <p className="py-4">ESC pour fermer</p>
                </div>
            </dialog>

            <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">Entreprises
                <button className="btn btn-ghost mx-5" onClick={() => document.getElementById('company_modal').showModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </h1>
            <div className="flex">
                <div className="ag-theme-material-dark w-full" style={{ height: 600 }}>
                    <AgGridReact
                        rowData={[...filteredCompanies, ...filteredTempCompanies]}
                        columnDefs={columnDefs}
                        domLayout={'autoHeight'}
                        pagination={true}
                        paginationPageSize={10}
                        onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
                        overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading...</span>'}
                        overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No rows to show</span>'}
                    />
                </div>
            </div>

            {/* Pie Chart Section */}
            <div className="my-10 flex justify-center">
                <div className="w-1/2">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Répartition des entreprises par statut</h2>
                    <Pie data={data} />
                </div>
            </div>
        </>
    );
};

export default CompanyManagement;
