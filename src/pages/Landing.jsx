import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      {/* Logo Area */}
      <div className="bg-white p-6 rounded-3xl mb-8">
        <span className="text-6xl">
          <img
            src="src\assets\Escudo_Obispado_Castrense_RD.svg"
            alt=""
            srcset=""
            className="w-12 h-12"
          />
        </span>
      </div>

      {/* App Name */}
      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase">
        Obispado <span className="text-blue-500">Castrense</span>
      </h1>

      <p className="text-slate-400 text-lg md:text-xl max-w-md mb-10 font-medium">
        Directorio Digital de Capellanes de la República Dominicana
      </p>

      {/* Access Button */}
      <Link
        to="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
      >
        Acceder al Sistema
      </Link>

      <footer className="fixed bottom-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
        Fuerzas Armadas & Policía Nacional
      </footer>
    </div>
  );
};

export default Landing;
