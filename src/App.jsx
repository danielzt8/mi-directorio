import React, { useState } from 'react'
import { miembrosFicticios } from './data'
import Tarjeta from './components/Tarjeta'

function App() {
  // 1. ESTADOS (Esto es lo que faltaba en tu snippet)
  const [busqueda, setBusqueda] = useState('');
  const [fuerzaActiva, setFuerzaActiva] = useState('TODOS');

  // 2. DEFINICIÓN DE FILTROS (Esto también debe estar aquí)
  const filtros = [
    { id: 'TODOS', label: 'Todos', color: 'bg-slate-500' },
    { id: 'ERD', label: 'Ejército', color: 'bg-green-800' },
    { id: 'ARD', label: 'Armada', color: 'bg-blue-900' },
    { id: 'FARD', label: 'Fuerza Aérea', color: 'bg-sky-500' },
    { id: 'PN', label: 'Policía', color: 'bg-slate-900' },
  ];

  // 3. LÓGICA DE FILTRADO
  const miembrosFiltrados = miembrosFicticios.filter((m) => {
    const nombreBusqueda = busqueda.toLowerCase();
    const nombreMiembro = m.nombre ? m.nombre.toLowerCase() : "";

    // 1. Limpiamos el rango y la fuerza seleccionada
    const rangoLimpio = m.instRango ? m.instRango.replace(/\./g, '').toUpperCase() : "";
    const fuerzaLimpia = fuerzaActiva.replace(/\./g, '').toUpperCase();

    // 2. Comprobamos el nombre
    const coincideNombre = nombreMiembro.includes(nombreBusqueda);

    // 3. NUEVA LÓGICA: ¿Es la fuerza una palabra exacta al final o separada por espacio?
    // Usamos una Expresión Regular para buscar la palabra exacta
    const regexFuerza = new RegExp(`\\b${fuerzaLimpia}\\b`);
    const coincideFuerza = fuerzaActiva === 'TODOS' || regexFuerza.test(rangoLimpio);

    return coincideNombre && coincideFuerza;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
            OBISPADO CASTRENSE
          </h1>
          <p className="text-slate-500 font-medium">Directorio de Capellanes</p>
        </header>

        {/* --- BARRA DE BÚSQUEDA --- */}
        <div className="mb-8 sticky top-4 z-10">
          <input
            type="text"
            placeholder="Buscar por nombre o rango (ej: ERD, Coronel...)"
            className="w-full p-5 rounded-2xl border-none shadow-lg ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* --- BOTONES DE FILTRO --- */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFuerzaActiva(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95 ${fuerzaActiva === f.id
                ? `${f.color} text-white shadow-lg scale-105`
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* --- RESULTADOS --- */}
        <div className="grid gap-4">
          {miembrosFiltrados.length > 0 ? (
            miembrosFiltrados.map((m) => (
              <Tarjeta key={m.id} datos={m} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No hay resultados para esta selección.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App