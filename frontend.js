import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaHome, FaNewspaper, FaEnvelope, FaBell, FaSearch } from "react-icons/fa";
import axios from "axios";

const Home = () => (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold">Bienvenue sur le Journal en Ligne de l'ENSA Beni Mellal</h1>
    <p className="mt-2">Retrouvez ici toutes les actualités et événements de l'école.</p>
  </div>
);

const News = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/news").then((response) => {
      setArticles(response.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dernières Actualités</h1>
      <ul className="mt-4 space-y-2">
        {articles.map((article) => (
          <li key={article._id} className="p-2 border rounded">
            {article.title} - {new Date(article.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Contact = () => (
  <div className="p-4">
    <h1 className="text-xl font-bold">Contactez-nous</h1>
    <p>Email: contact@ensabm.ac.ma</p>
  </div>
);

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between">
    <div className="text-lg font-bold">ENSABM Journal</div>
    <div className="space-x-4">
      <Link to="/" className="hover:underline flex items-center"><FaHome className="mr-1" />Accueil</Link>
      <Link to="/news" className="hover:underline flex items-center"><FaNewspaper className="mr-1" />Actualités</Link>
      <Link to="/contact" className="hover:underline flex items-center"><FaEnvelope className="mr-1" />Contact</Link>
      <Link to="/subscribe" className="hover:underline flex items-center"><FaBell className="mr-1" />Abonnement</Link>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
