import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [miembros, setMiembros] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    instRango: "",
    mision: "",
    diocesis: "",
    telefono: "",
    foto: "",
    cumpleaños: "",
    ordenacion: "",
  });

  // 1. Real-time list of Chaplains for the management table
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "capellanes"), (snap) => {
      setMiembros(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Add or Update Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // UPDATE existing record
        await updateDoc(doc(db, "capellanes", editandoId), formData);
        setMensaje("✅ Registro actualizado con éxito");
        setEditandoId(null);
      } else {
        // ADD new record
        await addDoc(collection(db, "capellanes"), formData);
        setMensaje("✅ Capellán agregado con éxito");
      }

      // Reset form
      setFormData({
        nombre: "",
        instRango: "",
        mision: "",
        diocesis: "",
        telefono: "",
        foto: "",
        cumpleaños: "",
        ordenacion: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al procesar la solicitud");
    }
  };

  // 3. Prepare form for Editing
  const prepararEdicion = (m) => {
    setEditandoId(m.id);
    setFormData({
      nombre: m.nombre || "",
      instRango: m.instRango || "",
      mision: m.mision || "",
      diocesis: m.diocesis || "",
      telefono: m.telefono || "",
      foto: m.foto || "",
      cumpleaños: m.cumpleaños || "",
      ordenación: m.ordenacion || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Delete Logic
  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este capellán?")) {
      try {
        await deleteDoc(doc(db, "capellanes", id));
        setMensaje("🗑️ Registro eliminado");
        setTimeout(() => setMensaje(""), 3000);
      } catch (error) {
        setMensaje("❌ No se pudo eliminar");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm font-bold mb-6 inline-block uppercase"
        >
          ← Volver al Directorio
        </Link>

        {/* --- FORM SECTION --- */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
            {editandoId ? "Modificar Registro" : "Nuevo Registro"}
          </h2>

          {mensaje && (
            <div
              className={`p-4 rounded-xl mb-6 font-bold text-center transition-all ${
                mensaje.includes("✅") || mensaje.includes("🗑️")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mensaje}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Nombre Completo
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Francisco Ozoria"
                className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Rango e Institución
              </label>
              <input
                name="instRango"
                value={formData.instRango}
                onChange={handleChange}
                placeholder="Ej: Mayor General, ERD"
                className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                URL de la Foto (Enlace)
              </label>
              <input
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <input
                name="mision"
                value={formData.mision}
                onChange={handleChange}
                placeholder="Misión"
                className="p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="diocesis"
                value={formData.diocesis}
                onChange={handleChange}
                placeholder="Diócesis"
                className="p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="cumpleaños"
                value={formData.cumpleaños}
                onChange={handleChange}
                placeholder="Cumpleaños"
                className="p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="ordenacion"
                value={formData.ordenacion}
                onChange={handleChange}
                placeholder="Ej: 20 de mayo"
                className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className={`flex-1 p-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 text-white ${editandoId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {editandoId ? "Actualizar Datos" : "Guardar Capellán"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditandoId(null);
                    setFormData({
                      nombre: "",
                      instRango: "",
                      mision: "",
                      diocesis: "",
                      telefono: "",
                      foto: "",
                      cumpleaños: "",
                      ordenacion: "",
                    });
                  }}
                  className="bg-slate-200 text-slate-600 px-6 rounded-xl font-bold uppercase text-xs"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest ml-2">
            Gestión de Capellanes
          </h3>
          <div className="grid gap-3">
            {miembros.map((m) => (
              <div
                key={m.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={m.foto || "https://via.placeholder.com/50"}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover bg-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 leading-none">
                      {m.nombre}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">
                      {m.instRango}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => prepararEdicion(m)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminar(m.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
