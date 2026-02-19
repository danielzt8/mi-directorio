import React, { useState, useEffect } from 'react'
import { miembrosFicticios } from './data'
import Tarjeta from './components/Tarjeta'
import Login from './components/login'

// --- 1. IMPORTACIONES DE FIREBASE QUE FALTABAN ---
import { auth } from './Firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

function App() {
  // --- 2. TODOS LOS HOOKS JUNTOS AL PRINCIPIO ---
  // (React exige que siempre se ejecuten en este orden exacto)
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [fuerzaActiva, setFuerzaActiva] = useState('TODOS');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Este escuchador verifica si ya habías entrado antes
    const desuscribir = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setEstaLogueado(true);
      } else {
        setEstaLogueado(false);
      }
      setCargando(false);
    });
    return () => desuscribir();
  }, []);

  // --- 3. FUNCIONES DE LÓGICA ---
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  const filtros = [
    { id: 'TODOS', label: 'Todos', color: 'bg-slate-500' },
    { id: 'ERD', label: 'Ejército', color: 'bg-green-800' },
    { id: 'ARD', label: 'Armada', color: 'bg-blue-900' },
    { id: 'FARD', label: 'Fuerza Aérea', color: 'bg-sky-500' },
    { id: 'PN', label: 'Policía', color: 'bg-slate-900' },
  ];

  const miembrosFiltrados = miembrosFicticios.filter((m) => {
    const nombreBusqueda = busqueda.toLowerCase();
    const nombreMiembro = m.nombre ? m.nombre.toLowerCase() : "";
    const rangoLimpio = m.instRango ? m.instRango.replace(/\./g, '').toUpperCase() : "";
    const fuerzaLimpia = fuerzaActiva.replace(/\./g, '').toUpperCase();

    const coincideNombre = nombreMiembro.includes(nombreBusqueda);
    const regexFuerza = new RegExp(`\\b${fuerzaLimpia}\\b`);
    const coincideFuerza = fuerzaActiva === 'TODOS' || regexFuerza.test(rangoLimpio);

    return coincideNombre && coincideFuerza;
  });

  // --- 4. LOS "GUARDIAS" DE PANTALLA (RETURNS CONDICIONALES) ---
  // Estos van DESPUÉS de todos los hooks (useState/useEffect)

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white font-bold animate-pulse">CARGANDO SISTEMA...</p>
      </div>
    );
  }

  if (!estaLogueado) {
    return <Login alEntrar={() => setEstaLogueado(true)} />;
  }

  // --- 5. RENDERIZADO PRINCIPAL DEL DIRECTORIO ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <button
        onClick={cerrarSesion}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl z-50 transition-all active:scale-90"
      >
        CERRAR SESIÓN SEGURA
      </button>

      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
            OBISPADO CASTRENSE
          </h1>
          <p className="text-slate-500 font-medium">Directorio de Capellanes</p>
        </header>

        <div className="mb-8 sticky top-4 z-10">
          <input
            type="text"
            placeholder="Buscar por nombre o rango (ej: ERD, Coronel...)"
            className="w-full p-5 rounded-2xl border-none shadow-lg ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

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