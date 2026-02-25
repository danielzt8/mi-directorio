import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm font-bold mb-4 inline-block"
        >
          ← Volver al Directorio
        </Link>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">
            Panel de Administración
          </h2>

          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <p className="text-slate-500 mb-4">
              Aquí irá el formulario para agregar o editar capellanes.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              + Agregar Nuevo Capellán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
