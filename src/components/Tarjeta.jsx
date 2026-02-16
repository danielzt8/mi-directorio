import React from 'react';

// Recibimos "datos" como una propiedad (prop)
const Tarjeta = ({ datos }) => {

    const obtenerEstiloFuerza = (rango) => {
        const r = rango ? rango.toUpperCase() : "";

        if (r.includes("FARD")) return {
            borde: "border-l-sky-500",
            texto: "text-sky-600",
            bg: "bg-sky-50"
        };
        if (r.includes("ERD")) return {
            borde: "border-l-green-700",
            texto: "text-green-800",
            bg: "bg-green-50"
        };
        if (r.includes("ARD")) return {
            borde: "border-l-blue-900",
            texto: "text-blue-900",
            bg: "bg-blue-50"
        };
        if (r.includes("PN") || r.includes("P.N.")) return {
            borde: "border-l-slate-900",
            texto: "text-slate-900",
            bg: "bg-slate-100"
        };

        return { borde: "border-l-slate-300", texto: "text-slate-600", bg: "bg-white" };
    };

    const estilo = obtenerEstiloFuerza(datos.instRango);



    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 border-l-8 ${estilo.borde} p-5 flex items-center gap-6 hover:shadow-md transition-all`}>
            {/* Espacio para la foto */}
            <img
                src={datos.foto}
                alt={datos.nombre}
                className={`w-24 h-24 rounded-xl object-cover ring-2 ring-offset-2 ${estilo.borde.replace('border-l', 'ring')}`}
            />

            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">{datos.nombre}</h3>

                {/* Etiqueta dinámica con el color de la fuerza */}
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-2 ${estilo.bg} ${estilo.texto}`}>
                    {datos.instRango}
                </span>

                <div className="mt-2 text-slate-500 text-sm space-y-1">
                    <p><span className="font-bold text-slate-700">Misión:</span> {datos.mision}</p>
                    <p><span className="font-bold text-slate-700">Diócesis:</span> {datos.diocesis}</p>
                    <p><span className="font-bold text-slate-700">Cumpleaños:</span> {datos.cumpleaños}</p>
                    <p><span className="font-bold text-slate-700">Teléfono:</span> {datos.telefono}</p>
                </div>
            </div>

            {/* Botón de Acción (Simulado) */}
            <div className="hidden sm:block">
                <a href={`tel:${datos.telefono}`} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${estilo.bg} ${estilo.texto} hover:opacity-80`}>
                    Llamar
                </a>
            </div>
        </div>
    );
};

export default Tarjeta;