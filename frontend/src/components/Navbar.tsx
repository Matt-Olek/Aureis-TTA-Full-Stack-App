import React from "react";
import { useAuth } from "../contexts/AuthContext"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", (error as Error).message);
    }
  };

  return (
    <>
      <div className="navbar bg-stone-900">
        <div className="navbar-start">
          <a
            className="btn btn-ghost flex items-center space-x-3 rtl:space-x-reverse"
            onClick={() => navigate("/")}
          >
            <img
              src="/media/logos/logo.png"
              alt="Aureis Logo"
              className="h-8"
            />
            <span className="text-lg text-green-300">AUREIS - TTA</span>
          </a>
          {user.loggedIn ? (
            user.is_superuser ? (
              <p className="text-gray-100 text-lg">Compte Administrateur</p>
            ) : user.is_staff ? (
              <p className="text-gray-100 text-lg">Compte Staff</p>
            ) : user.type === "A" ? (
              <p className="text-gray-100 text-lg">Compte Candidat</p>
            ) : (
              <p className="text-gray-100 text-lg">Compte Entreprise</p>
            )
          ) : (
            <p className="text-gray-100 text-lg">Connexion</p>
          )}
        </div>
        <div className="navbar-center md:flex"></div>

        <div className="navbar-end flex space-x-3 rtl:space-x-reverse">
          {user.loggedIn ? (
            <>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle">
                  <img
                    src="/media/icons/icon-deroulant.svg"
                    alt="Dropdown Icon"
                    className="h-100 w-100"
                  />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-stone-800 text-gray-100 rounded-box w-48 z-10"
                >
                  {user.is_staff || user.is_superuser ? (
                    <>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() =>
                            navigate("/admin/applicant-management")
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          Candidats
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/admin/company-management")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                            />
                          </svg>
                          Entreprises
                        </a>
                      </li>
                      {/* <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/admin/match-management")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                            />
                          </svg>
                          Matchs
                        </a>
                      </li> */}
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/admin/offer-management")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                          Matching
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() =>
                            navigate("/admin/formation-management")
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                            />
                          </svg>
                          Formations
                        </a>
                      </li>
                    </>
                  ) : user.type === "A" ? (
                    <>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/applicant/application")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          Ma fiche candidat
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/applicant/test")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                            />
                          </svg>
                          Mon test
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/applicant/matchs")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                            />
                          </svg>
                          Mes Matchs
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          href="#"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                          Fiche Entreprise
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => navigate("/company/offers")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                            />
                          </svg>
                          Besoins en recrutement
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                          href="#"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                            />
                          </svg>
                          Matchs
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle">
                  <img
                    src="/media/icons/icon-profile.svg"
                    alt="Profile Icon"
                    className="h-100 w-100 mx-2"
                  />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-stone-900 text-gray-100 rounded-box w-48"
                >
                  <li>
                    <a
                      className="text-sm text-gray-100 hover:bg-gray-100"
                      href="#"
                    >
                      Profil
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-sm text-gray-100 hover:bg-gray-100"
                      href="#"
                    >
                      Paramètres
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-sm text-gray-100 hover:bg-gray-100"
                      href="#"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <a
              href="/login"
              className="btn btn-ghost btn-circle text-dark text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-12 green hover:text-green-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
