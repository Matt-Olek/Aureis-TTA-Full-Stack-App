import { useAuth } from '../contexts/AuthContext'; // Adjust import path as needed
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    return (
        <>
        <div className="navbar bg-stone-900 ">
                <div className="navbar-start">
                    <a className="flex items-center space-x-3 rtl:space-x-reverse" onClick={() => navigate('/')}>   
                        <img src="/media/logos/logo.png" alt="Aureis Logo" className="h-8 " />
                        <span className="text-lg text-green-300">AUREIS - TTA</span>
                    </a>
                </div>
                <div className="navbar-center hidden md:flex"></div>

                <div className="navbar-end flex space-x-3 rtl:space-x-reverse">
                    {user.loggedIn ? (
                        <>
                            <div className="dropdown dropdown-end">
                                <button tabIndex="0" className="btn btn-ghost btn-circle">
                                    <img src="/media/icons/icon-deroulant.svg" alt="Dropdown Icon" className="h-100 w-100" />
                                </button>
                                <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-stone-800 text-gray-100 rounded-box w-48 z-10">
                                    {user.is_staff || user.is_superuser ? (
                                        <>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/admin/applicant-management')}>Management Candidats</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/admin/company-management')}>Management Entreprises</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/admin/match-management')}>Management Matchs</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/admin/offer-management')}>Management Offres</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/admin/formation-management')}>Management Formations</a></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" onClick={() => navigate('/applicant/application')}>Ma fiche candidat</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" href="#">Mes offres</a></li>
                                            <li><a className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900" href="#">Action 3</a></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div className="dropdown dropdown-end">
                                <button tabIndex="0" className="btn btn-ghost btn-circle">
                                    <img src="/media/icons/icon-profile.svg" alt="Profile Icon" className="h-100 w-100 mx-2" />
                                </button>
                                <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-stone-900 text-gray-100 rounded-box w-48">
                                    <li><a className="text-sm text-gray-100 hover:bg-gray-100" href="#">Profile</a></li>
                                    <li><a className="text-sm text-gray-100 hover:bg-gray-100" href="#">Settings</a></li>
                                    <li><a className="text-sm text-gray-100 hover:bg-gray-100" href="#" onClick={handleLogout}>Logout</a></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <a href="/login" className="btn btn-ghost btn-circle text-dark text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 green hover:text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
      </>   
    );
};

export default Navbar;
