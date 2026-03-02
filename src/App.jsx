import Navbar from "./components/Navbar";
import { db } from "./Firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { miembrosFicticios } from "./data";
import Tarjeta from "./components/Tarjeta";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminPage from "./components/AdminPage";
import Landing from "./pages/Landing";
import Perfil from "./pages/Perfil";

// --- 1. IMPORTACIONES DE FIREBASE QUE FALTABAN ---
import { auth } from "./Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  // --- 2. TODOS LOS HOOKS JUNTOS AL PRINCIPIO ---
  // (React exige que siempre se ejecuten en este orden exacto)
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [fuerzaActiva, setFuerzaActiva] = useState("TODOS");
  const [cargando, setCargando] = useState(true);
  const [miembros, setMiembros] = useState([]); // lista vacia
  const [rol, setRol] = useState(null);
  const [debeCambiar, setDebeCambiar] = useState(false);

  useEffect(() => {
    const desuscribirAuth = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        // 1. Si hay usuario, buscamos su "ficha" en la colección 'usuarios'
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRol(docSnap.data().rol); // Guardamos "admin" en nuestro estado
          // También guardamos si el usuario debe cambiar su contraseña
          setDebeCambiar(data.debeCambiarPassword || false);
        } else {
          setRol("lector"); // Si no existe en la colección, por defecto es lector
        }
        setEstaLogueado(true);
      } else {
        setEstaLogueado(false);
        setRol(null);
        setDebeCambiar(false);
      }
      setCargando(false);
    });

    // 2. Vigilar la base de datos (Colección 'capellanes')
    const desuscribirDocs = onSnapshot(
      collection(db, "capellanes"),
      (snapshot) => {
        const datosNube = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMiembros(datosNube); // Actualiza la lista automáticamente
      },
    );

    return () => {
      desuscribirAuth();
      desuscribirDocs();
    };
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
    { id: "TODOS", label: "Todos", color: "bg-slate-500" },
    { id: "ERD", label: "Ejército", color: "bg-green-800" },
    { id: "ARD", label: "Armada", color: "bg-blue-900" },
    { id: "FARD", label: "Fuerza Aérea", color: "bg-sky-500" },
    { id: "PN", label: "Policía", color: "bg-slate-900" },
  ];

  const miembrosFiltrados = miembros.filter((m) => {
    const nombreBusqueda = busqueda.toLowerCase();
    const nombreMiembro = m.nombre ? m.nombre.toLowerCase() : "";
    const rangoLimpio = m.instRango
      ? m.instRango.replace(/\./g, "").toUpperCase()
      : "";
    const fuerzaLimpia = fuerzaActiva.replace(/\./g, "").toUpperCase();

    const coincideNombre = nombreMiembro.includes(nombreBusqueda);
    const regexFuerza = new RegExp(`\\b${fuerzaLimpia}\\b`);
    const coincideFuerza =
      fuerzaActiva === "TODOS" || regexFuerza.test(rangoLimpio);

    return coincideNombre && coincideFuerza;
  });

  // --- 4. LOS "GUARDIAS" DE PANTALLA (RETURNS CONDICIONALES) ---
  // Estos van DESPUÉS de todos los hooks (useState/useEffect)

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white font-bold animate-pulse uppercase">
          Cargando sistema...
        </p>
      </div>
    );
  }

  // --- 5. RENDERIZADO PRINCIPAL DEL DIRECTORIO ---
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {estaLogueado && <Navbar rol={rol} onLogout={cerrarSesion} />}

        <Routes>
          {/* 1. PUBLIC LANDING PAGE */}
          <Route path="/home" element={<Landing />} />

          {/* 2. LOGIN PAGE */}
          <Route
            path="/login"
            element={
              !estaLogueado ? (
                <Login alEntrar={() => setEstaLogueado(true)} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/"
            element={
              estaLogueado ? (
                // CHECK: If the "force change" flag is active, send them to Perfil
                debeCambiar ? (
                  <Navigate to="/perfil" />
                ) : (
                  // Otherwise, show the directory as normal
                  <div className="p-6 sm:p-12">
                    <div className="max-w-4xl mx-auto">
                      <header className="mb-12 text-center">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 uppercase">
                          Obispado Castrense
                        </h1>
                        <p className="text-slate-500 font-medium">
                          Directorio de Capellanes
                        </p>
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
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95 ${
                              fuerzaActiva === f.id
                                ? `${f.color} text-white shadow-lg scale-105`
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
                            <p className="text-slate-400">
                              No hay resultados para esta selección.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          <Route
            path="/admin"
            element={rol === "admin" ? <AdminPage /> : <Navigate to="/" />}
          />

          <Route
            path="/perfil"
            element={estaLogueado ? <Perfil /> : <Navigate to="/home" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
