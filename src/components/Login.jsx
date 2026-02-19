import React, { useState } from 'react';
import { auth } from '../Firebase'; // Importamos la conexión que creaste
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ alEntrar }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Para mostrar si la clave está mal

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 🛡️ Intentamos validar con Firebase
            await signInWithEmailAndPassword(auth, email, password);
            alEntrar(); // Si los datos son correctos, entramos al directorio
        } catch (err) {
            // ❌ Si algo falla (clave mal, usuario no existe), mostramos este error
            setError("Credenciales incorrectas. Verifique e intente de nuevo.");
            console.error("Error de Firebase:", err.code);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 mb-4">
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight text-center">ACCESO PRIVADO</h2>
                    <p className="text-slate-400 text-sm mt-2 text-center">Obispado Castrense de la R.D.</p>
                </div>

                <form onSubmit={manejarEnvio} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs py-2 px-4 rounded-lg text-center font-bold">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Correo Institucional</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="admin@obispado.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                        Validar Identidad
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;