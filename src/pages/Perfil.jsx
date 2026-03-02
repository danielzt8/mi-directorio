import React, { useState } from "react";
import { auth } from "../Firebase";
import { updatePassword } from "firebase/auth";
import { Link } from "react-router-dom";

const Perfil = () => {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [cargando, setCargando] = useState(false);

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.nueva !== passwordData.confirmar) {
      setMensaje({ texto: "❌ Las contraseñas no coinciden", tipo: "error" });
      return;
    }

    setCargando(true);
    try {
      const usuario = auth.currentUser;

      // 1. Update the password in Firebase Auth
      await updatePassword(usuario, passwordData.nueva);

      // 2. IMPORTANT: Update the 'debeCambiarPassword' flag in Firestore
      const userRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(userRef, {
        debeCambiarPassword: false,
      });

      setMensaje({
        texto: "✅ Contraseña actualizada. Ahora tienes acceso total.",
        tipo: "exito",
      });

      // 3. Optional: Clear the form
      setPasswordData({ nueva: "", confirmar: "" });

      // 4. Redirect after 2 seconds so they can see the success message
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      setMensaje({
        texto:
          "❌ Re-inicia sesión para cambiar la contraseña (por seguridad).",
        tipo: "error",
      });
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <Link
          to="/"
          className="text-blue-600 text-xs font-bold uppercase mb-4 inline-block"
        >
          ← Volver
        </Link>

        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">
          Mi Perfil
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Gestiona la seguridad de tu cuenta.
        </p>

        {mensaje.texto && (
          <div
            className={`p-4 rounded-xl mb-4 text-sm font-bold ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleCambiarPassword} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={nuevaPassword.confirmar}
              onChange={(e) =>
                setNuevaPassword({
                  ...nuevaPassword,
                  confirmar: e.target.value,
                })
              }
              placeholder="Confirma tu nueva contraseña"
              className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            disabled={cargando}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
          >
            {cargando ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
