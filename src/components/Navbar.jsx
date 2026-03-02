import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ rol, onLogout }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <span className="text-xl">
              <img
                src="src\assets\Escudo_Obispado_Castrense_RD.svg"
                alt=""
                srcset=""
                className="w-12 h-12"
              />
            </span>
          </div>
          <div>
            <h1 className="text-white font-black leading-none tracking-tight uppercase">
              Obispado Castrense
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              República Dominicana
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {rol === "admin" && (
            <>
              <span className="hidden sm:inline-block bg-blue-600/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/20 uppercase">
                Acceso Administrador
              </span>

              <Link
                to="/admin"
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all"
              >
                Panel de Control
              </Link>

              <Link
                to="/perfil"
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Mi Perfil
              </Link>
            </>
          )}

          {/* Solo el Admin verá este botón */}

          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-white text-xs font-bold transition-colors uppercase tracking-widest"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
