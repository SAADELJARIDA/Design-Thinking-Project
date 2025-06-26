import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const authLinks = (
    <>
      <div className="hidden md:block flex-1">
        <div className="ml-10 flex items-baseline space-x-4">
          <Link to="/accueil" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Accueil
          </Link>
          <Link to="/actualites" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Actualités
          </Link>
          <Link to="/evenements" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Évènements
          </Link>
          <Link to="/blog" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Blog
          </Link>
        </div>
      </div>
      
      <div className="hidden md:block">
        <div className="ml-4 flex items-center md:ml-6">
          <div className="ml-3 relative">
            <div>
              <button 
                type="button" 
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                onClick={toggleMenu}
              >
                <img 
                  src={user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
            </div>
            
            {isOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                {user && user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="material-icons text-gray-500 mr-2 text-base">dashboard</span>
                      Tableau de bord admin
                    </Link>
                    <Link
                      to="/admin/actualites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="material-icons text-gray-500 mr-2 text-base">article</span>
                      Gérer les actualités
                    </Link>
                    <Link
                      to="/admin/evenements"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="material-icons text-gray-500 mr-2 text-base">event</span>
                      Gérer les événements
                    </Link>
                  </>
                )}
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="material-icons text-gray-500 mr-2 text-base">settings</span>
                  Paramètres
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <span className="material-icons text-gray-500 mr-2 text-base">logout</span>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const guestLinks = (
    <>
      <div className="hidden md:block flex-1">
        <div className="ml-10 flex items-baseline space-x-4">
          <Link to="/accueil" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Accueil
          </Link>
          <Link to="/actualites" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Actualités
          </Link>
          <Link to="/evenements" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Évènements
          </Link>
          <Link to="/blog" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Blog
          </Link>
        </div>
      </div>
      
      <div className="hidden md:block">
        <div className="ml-4 flex items-center space-x-2">
          <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
            <span className="material-icons text-gray-300 mr-1 text-base">login</span>
            Login
          </Link>
          
          <Link to="/register" className="bg-gray-700 text-white hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
            <span className="material-icons text-white mr-1 text-base">person_add</span>
            Register
          </Link>
        </div>
      </div>
    </>
  );

  // Mobile menu
  const mobileMenu = (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link to="/accueil" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
          Accueil
        </Link>
        <Link to="/actualites" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
          Actualités
        </Link>
        <Link to="/evenements" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
          Évènements
        </Link>
        <Link to="/blog" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
          Blog
        </Link>
        
        {isAuthenticated ? (
          <>
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin" className="text-green-400 hover:bg-gray-700 hover:text-green-300 block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">dashboard</span>
                  Admin
                </Link>
                <Link to="/admin/actualites" className="text-green-400 hover:bg-gray-700 hover:text-green-300 block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">article</span>
                  Gérer les actualités
                </Link>
                <Link to="/admin/evenements" className="text-green-400 hover:bg-gray-700 hover:text-green-300 block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">event</span>
                  Gérer les événements
                </Link>
              </>
            )}
            <Link to="/settings" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <span className="material-icons text-gray-300 mr-2 text-base">settings</span>
              Paramètres
            </Link>
            <button
              onClick={onLogout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <span className="material-icons text-gray-300 mr-2 text-base">logout</span>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <span className="material-icons text-gray-300 mr-2 text-base">login</span>
              Login
            </Link>
            
            <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <span className="material-icons text-gray-300 mr-2 text-base">person_add</span>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/ensa.png" 
                alt="ENSA Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-white text-lg font-bold">School Blog</span>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-between items-center">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenu}
    </nav>
  );
};

export default Navbar; 