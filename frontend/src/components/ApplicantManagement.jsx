import { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useFlyingMessage } from '../App';
import * as XLSX from 'xlsx'; // Import XLSX library

const ApplicantManagement = () => {
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [filteredTempApplicants, setFilteredTempApplicants] = useState([]);
    const [newApplicant, setNewApplicant] = useState({ first_name: '', last_name: '', email: '' });
    const showMessage = useFlyingMessage();

    const [columnDefs] = useState([
        { headerName: 'Prénom', field: 'first_name', filter: true },
        { headerName: 'Nom', field: 'last_name', filter: true },
        { headerName: 'Email', field: 'email', filter: true },
        { headerName: 'Téléphone', field: 'phone', filter: true },
        { headerName: 'Diplôme', field: 'diploma', filter: true },
        { headerName: 'Type de contrat', field: 'contract_type', filter: "agSetColumnFilter" },
        { headerName: 'Emplacement', field: 'location', filter: true },
        {
            headerName: 'Statut', field: 'status', filter: true,
            valueGetter: (params) => {

                if (params.data.link_inscription) {
                    return `En attente d'inscription (${new Date(params.data.date_created).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })})`;
                }
                return 'En cours de matching';
            }
        },
        {
            headerName: 'Actions', field: 'actions', filter: false, sortable: false,
            cellRenderer: (params) => {
                const { link_inscription } = params.data;
                // Differentiate based on the presence of `link_inscription`
                if (link_inscription) {
                    return (
                        <div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="btn m-1 btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </div>
                            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a>Supprimer</a></li>
                                <li><a>Relancer</a></li>
                                <li><a onClick={() => navigator.clipboard.writeText(link_inscription) && alert('Lien copié !')}>Copier le lien d&apos;inscription</a></li>
                            </ul>
                        </div>
                    );
                }
                return (
                    <div className="dropdown dropdown-end">
                        <div tabIndex="0" role="button" className="btn m-1 btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </div>
                        <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a>Infos</a></li>
                            <li><a>Supprimer</a></li>
                        </ul>
                    </div>
                );
            }
        }
    ]);

    const fetchApplicants = async () => {
        try {
            const response = await Axios.get('/applicants/');
            setFilteredApplicants(response.data.applicants);
            setFilteredTempApplicants(response.data.temp_applicants);
        } catch (error) {
            showMessage('Erreur lors du chargement des candidats', 5000);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewApplicant((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console
            await Axios.post('/applicants/', [newApplicant]);
            setNewApplicant({ first_name: '', last_name: '', email: '' });
            fetchApplicants();
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'ajout du candidat:', error.message);
        }
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            showMessage(`Fichier sélectionné: ${file.name}`, 3000);
            handleFileUpload(file);
        }
    };

    // Parse the Excel file
    const handleFileUpload = (file) => {
        if (!file) {
            showMessage('Veuillez sélectionner un fichier Excel', 5000);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const emailList = json.flat().filter(email => typeof email === 'string' && email.includes('@'));

            // Create temp applicant objects
            const tempApplicantsData = emailList.map(email => ({
                email: email,
                // Add other required fields if needed
            }));

            try {
                // Send POST request to your API endpoint
                const response = await Axios.post('/applicants/', tempApplicantsData);
                showMessage(response.data.messages[0], 3000);
                fetchApplicants(); // Refresh the applicant list
            } catch (error) {
                showMessage('Erreur lors de l\'ajout des candidats', 5000);
                console.error('Error uploading temp applicants:', error);
            }
        };
        reader.readAsArrayBuffer(file);
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
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <div className="modal-action">
                        <h1 className="text-3xl font-bold text-gray-100 text-center my-10 anton">Ajouter un candidat</h1>
                        <form onSubmit={handleSubmit} className="rounded m-5 w-full">
                            <input
                                type="text"
                                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                                id="first_name"
                                name="first_name"
                                placeholder="Prénom"
                                value={newApplicant.first_name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                                id="last_name"
                                name="last_name"
                                placeholder="Nom"
                                value={newApplicant.last_name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="email"
                                className="manrope form-control w-full p-2 rounded text-gray-100 m-2"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={newApplicant.email}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-pink-300 hover:bg-pink-400 text-stone-900 py-2 px-4 rounded transition duration-300 ease-in-out"
                            >
                                Contacter
                            </button>
                        </form>
                    </div>
                    <p className="py-4">ESC pour fermer</p>
                </div>
            </dialog>

            <div className="flex items-center justify-center space-x-4 my-10">
                <h1 className="text-3xl font-bold text-gray-100 anton">Candidats</h1>
                <button className="btn btn-ghost" onClick={() => document.getElementById('my_modal_1').showModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                <label htmlFor="fileInput" className="cursor-pointer flex items-center btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>


            <div className="flex">
                <div className="ag-theme-material-dark w-full" style={{ height: 600 }}>
                    <AgGridReact
                        rowData={[...filteredApplicants, ...filteredTempApplicants]}
                        columnDefs={columnDefs}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            filter: true
                        }}
                        animateRows={true}
                        pagination={true}
                        paginationPageSize={50}
                        onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
                    />
                </div>
            </div>
        </>
    );
};

export default ApplicantManagement;
