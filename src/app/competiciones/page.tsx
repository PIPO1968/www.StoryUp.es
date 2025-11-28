
"use client";
// Obtener datos reales de docentes por temporada
async function getTablaDocentes(temporada: string) {
    try {
        const response = await fetch(`/api/championship/results?season=${temporada}&type=docentes`);
        if (!response.ok) return [];
        const data = await response.json();
        const resultado: { escudo: string; nombre: string; ganados: number; perdidos: number; preguntasAcertadas: number; preguntasFalladas: number; likes: number; }[] = data.map((item: any) => ({
            escudo: item.escudo || '👨‍🏫',
            nombre: item.nick,
            ganados: item.ganados ?? 0,
            perdidos: item.perdidos ?? 0,
            preguntasAcertadas: item.preguntasAcertadas ?? 0,
            preguntasFalladas: item.preguntasFalladas ?? 0,
            likes: item.likes ?? 0,
        }));
        // Ordenar y limitar a los 25 mejores
        return resultado.sort((a, b) => b.likes - a.likes).slice(0, 25);
    } catch (error) {
        console.error('Error cargando docentes:', error);
        return [];
    }
}
import React from "react";
import { renderNick } from "@/utils/renderNick";

export default function Competiciones() {
    type Centro = {
        escudo: string; // URL o emoji
        nombre: string;
        ganados: number;
        perdidos: number;
        preguntasAcertadas: number;
        preguntasFalladas: number;
        likes: number;
    };
    type Alumno = {
        escudo: string; // emoji/avatar
        nombre: string;
        ganados: number;
        perdidos: number;
        preguntasAcertadas: number;
        preguntasFalladas: number;
        likes: number;
    };

    // Estado para datos y carga
    const [loading, setLoading] = React.useState(true);
    const [temporadasDisponibles, setTemporadasDisponibles] = React.useState<string[]>([]);
    const [temporadaSeleccionada, setTemporadaSeleccionada] = React.useState<string>("");
    const [mostrarCentros, setMostrarCentros] = React.useState<any[]>([]);
    const [mostrarAlumnos, setMostrarAlumnos] = React.useState<any[]>([]);
    const [mostrarDocentes, setMostrarDocentes] = React.useState<any[]>([]);
    const [usuario, setUsuario] = React.useState<any>(null);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        // Cargar usuario actual
        fetch('/api/auth/me')
            .then(response => response.ok ? response.json() : null)
            .then(user => {
                setUsuario(user);
            })
            .catch(error => {
                console.error('Error cargando usuario:', error);
            });

        // Función para calcular la temporada actual basada en el año escolar
        const getTemporadaActual = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // getMonth() devuelve 0-11
            const day = now.getDate();

            // Si estamos antes del 30 de septiembre, usamos el año anterior como base
            // Si estamos después del 30 de septiembre, usamos el año actual como base
            let temporadaYear = year;
            if (month < 9 || (month === 9 && day < 30)) {
                temporadaYear = year - 1;
            }

            return `t${temporadaYear}`;
        };

        // Detectar todas las temporadas disponibles en la base de datos
        fetch('/api/championship/seasons')
            .then(response => response.ok ? response.json() : [])
            .then((temporadas: string[]) => {
                // Obtener la temporada actual
                const temporadaActual = getTemporadaActual();

                // Si no hay ninguna temporada guardada o la actual no existe, añadirla
                if (!temporadas.includes(temporadaActual)) {
                    temporadas.push(temporadaActual);
                }

                // Ordenar temporadas de más reciente a más antigua
                temporadas.sort((a, b) => {
                    const yearA = parseInt(a.replace('t', ''));
                    const yearB = parseInt(b.replace('t', ''));
                    return yearB - yearA;
                });

                setTemporadasDisponibles(temporadas);
                setTemporadaSeleccionada(temporadaActual);
            })
            .catch(error => {
                console.error('Error cargando temporadas:', error);
                const temporadaActual = getTemporadaActual();
                setTemporadasDisponibles([temporadaActual]);
                setTemporadaSeleccionada(temporadaActual);
            });
    }, []);

    // Función para cargar datos de centros por temporada
    async function getTablaCentros(temporada: string) {
        try {
            const response = await fetch(`/api/championship/results?season=${temporada}&type=centros`);
            if (!response.ok) return [];
            const data = await response.json();
            const resultado: Centro[] = data.map((item: any) => ({
                escudo: item.escudo || '🏫',
                nombre: item.centro,
                ganados: item.ganados ?? 0,
                perdidos: item.perdidos ?? 0,
                preguntasAcertadas: item.preguntasAcertadas ?? 0,
                preguntasFalladas: item.preguntasFalladas ?? 0,
                likes: item.likes ?? 0,
            }));
            // Ordenar y limitar a los 25 mejores
            return resultado.sort((a, b) => b.likes - a.likes).slice(0, 25);
        } catch (error) {
            console.error('Error cargando centros:', error);
            return [];
        }
    }

    // Función para cargar datos de alumnos por temporada
    async function getTablaAlumnos(temporada: string) {
        try {
            const response = await fetch(`/api/championship/results?season=${temporada}&type=individual`);
            if (!response.ok) return [];
            const data = await response.json();
            const resultado: Alumno[] = data.map((item: any) => ({
                escudo: item.escudo || '👤',
                nombre: item.nick,
                ganados: item.ganados ?? 0,
                perdidos: item.perdidos ?? 0,
                preguntasAcertadas: item.preguntasAcertadas ?? 0,
                preguntasFalladas: item.preguntasFalladas ?? 0,
                likes: item.likes ?? 0,
            }));
            // Ordenar y limitar a los 25 mejores
            return resultado.sort((a, b) => b.likes - a.likes).slice(0, 25);
        } catch (error) {
            console.error('Error cargando alumnos:', error);
            return [];
        }
    }

    // Solo cargar datos al cambiar la temporada
    React.useEffect(() => {
        if (!temporadaSeleccionada) return;
        if (typeof window === "undefined") return;

        const loadData = async () => {
            const centros = await getTablaCentros(temporadaSeleccionada);
            const alumnos = await getTablaAlumnos(temporadaSeleccionada);
            const docentes = await getTablaDocentes(temporadaSeleccionada);

            setMostrarCentros(centros);
            setMostrarAlumnos(alumnos);
            setMostrarDocentes(docentes);
            setLoading(false);
        };

        loadData();
    }, [temporadaSeleccionada]);

    // Handler para resetear datos solo al hacer clic en el nick (función de administrador)
    async function handleResetDatos() {
        if (typeof window === "undefined") return;

        const confirmReset = window.confirm(
            `¿Estás seguro de que quieres resetear TODOS los datos de la temporada ${temporadaSeleccionada.replace('t', '')}?\n\n` +
            `Esto borrará:\n` +
            `- Tabla de centros\n` +
            `- Tabla individual de alumnos\n` +
            `- Tabla de docentes\n\n` +
            `Esta acción NO se puede deshacer.`
        );

        if (!confirmReset) return;

        try {
            const response = await fetch(`/api/championship/reset?season=${temporadaSeleccionada}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error reseteando datos');
            }

            // Recargar datos (ahora serán tablas vacías)
            const centros = await getTablaCentros(temporadaSeleccionada);
            const alumnos = await getTablaAlumnos(temporadaSeleccionada);
            const docentes = await getTablaDocentes(temporadaSeleccionada);

            setMostrarCentros(centros);
            setMostrarAlumnos(alumnos);
            setMostrarDocentes(docentes);

            alert(`Datos de la temporada ${temporadaSeleccionada.replace('t', '')} reseteados correctamente.`);
        } catch (error) {
            console.error('Error reseteando:', error);
            alert('Error al resetear los datos.');
        }
    }

    // Función para obtener información de la temporada actual
    const getInfoTemporada = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        // Calcular cuándo termina la temporada actual (30 de septiembre)
        let finTemporada = new Date(year, 8, 30); // Mes 8 = septiembre (0-indexed)

        // Si ya pasó el 30 de septiembre de este año, la próxima fecha es el año que viene
        if (month > 9 || (month === 9 && day >= 30)) {
            finTemporada = new Date(year + 1, 8, 30);
        }

        const diasRestantes = Math.ceil((finTemporada.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
            temporadaActual: temporadaSeleccionada.replace('t', ''),
            finTemporada: finTemporada.toLocaleDateString('es-ES'),
            diasRestantes: diasRestantes > 0 ? diasRestantes : 0
        };
    };

    const infoTemporada = getInfoTemporada();
    if (loading || !temporadaSeleccionada) {
        return <div className="min-h-screen bg-green-100 p-8 text-center text-lg">Cargando competiciones...</div>;
    }
    return (
        <div className="min-h-screen bg-green-100 p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Competiciones StoryUp</h1>

            {/* Información de temporada */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-blue-700">📅 Información de Temporada</h3>
                        <div className="flex items-center gap-4">
                            <label className="font-semibold mr-2 text-blue-700">Ver temporada:</label>
                            <select
                                className="border rounded px-3 py-2 bg-white shadow"
                                value={temporadaSeleccionada}
                                onChange={e => setTemporadaSeleccionada(e.target.value)}
                            >
                                {temporadasDisponibles.map((t, idx) => (
                                    <option key={idx} value={t}>
                                        {`Temporada ${t.replace('t', '')}${t === temporadasDisponibles[0] ? ' (Actual)' : ''}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white rounded p-3 border border-blue-200">
                            <div className="font-semibold text-blue-600">Temporada Actual:</div>
                            <div className="text-lg font-bold">{infoTemporada.temporadaActual}</div>
                        </div>
                        <div className="bg-white rounded p-3 border border-green-200">
                            <div className="font-semibold text-green-600">Fin de Temporada:</div>
                            <div className="text-lg font-bold">{infoTemporada.finTemporada}</div>
                        </div>
                        <div className="bg-white rounded p-3 border border-orange-200">
                            <div className="font-semibold text-orange-600">Días Restantes:</div>
                            <div className="text-lg font-bold">{infoTemporada.diasRestantes} días</div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                        💡 <strong>Sistema de Temporadas:</strong> Cada temporada termina el 30 de septiembre.
                        Los datos se mantienen guardados y puedes consultar temporadas anteriores usando el selector de arriba.
                        {temporadasDisponibles.length > 1 && ` Hay ${temporadasDisponibles.length} temporada${temporadasDisponibles.length > 1 ? 's' : ''} disponible${temporadasDisponibles.length > 1 ? 's' : ''}.`}
                    </div>
                </div>
            </div>

            {/* Botón de reset temporada eliminado por solicitud del usuario */}
            <div className="max-w-5xl mx-auto mb-6">
                <div className="bg-blue-50 border border-blue-300 rounded p-3 text-sm text-gray-700">
                    <b>Importante:</b> Solo se contabilizan en estas tablas los datos obtenidos en <span className="font-bold text-blue-700">modo competicion</span>.<br />
                    Las partidas en modo clásico no afectan los rankings ni las estadísticas de competición.
                </div>
            </div>
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                <div className="flex flex-row gap-8 w-full max-w-7xl mx-auto">
                    {/* Bloque Competición Centros */}
                    <div className="bg-white rounded-lg shadow-md p-3 w-1/2 text-[11px]">
                        <h2 className="text-xl font-bold text-center mb-4">Competición Centros</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="py-2 text-center">PG</th>
                                    <th className="py-2 text-center">EC</th>
                                    <th className="py-2 text-center">CE</th>
                                    <th className="py-2 text-center">G</th>
                                    <th className="py-2 text-center">P</th>
                                    <th className="py-2 text-center">PA</th>
                                    <th className="py-2 text-center">PF</th>
                                    <th className="py-2 text-center">❤️</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mostrarCentros.map((centro, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="py-0 text-center font-bold">{idx + 1}</td>
                                        <td className="py-0 text-center">
                                            <span className="inline-block w-8 h-8 text-2xl align-middle">{centro.escudo}</span>
                                        </td>
                                        <td className="py-0 font-semibold">
                                            <span style={{ color: '#007bff' }}>{renderNick(centro.nombre)}</span>
                                        </td>
                                        <td className="py-0 text-center">{centro.ganados}</td>
                                        <td className="py-0 text-center">{centro.perdidos}</td>
                                        <td className="py-0 text-center">{centro.preguntasAcertadas}</td>
                                        <td className="py-0 text-center">{centro.preguntasFalladas}</td>
                                        <td className="py-0 text-center">{centro.likes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Bloque Competición Individual */}
                    <div className="bg-white rounded-lg shadow-md p-3 w-1/2 text-[11px]">
                        <h2 className="text-xl font-bold text-center mb-4">Competición Individual</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="py-2 text-center">PG</th>
                                    <th className="py-2 text-center">EC</th>
                                    <th className="py-2 text-center">A</th>
                                    <th className="py-2 text-center">G</th>
                                    <th className="py-2 text-center">P</th>
                                    <th className="py-2 text-center">PA</th>
                                    <th className="py-2 text-center">PF</th>
                                    <th className="py-2 text-center">❤️</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mostrarAlumnos.map((alumno, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="py-0 text-center font-bold">{idx + 1}</td>
                                        <td className="py-0 text-center">
                                            <span className="inline-block w-8 h-8 text-2xl align-middle">{alumno.escudo}</span>
                                        </td>
                                        <td className="py-0 font-semibold">
                                            <span style={{ color: '#007bff' }}>{renderNick(alumno.nombre)}</span>
                                        </td>
                                        <td className="py-0 text-center">{alumno.ganados}</td>
                                        <td className="py-0 text-center">{alumno.perdidos}</td>
                                        <td className="py-0 text-center">{alumno.preguntasAcertadas}</td>
                                        <td className="py-0 text-center">{alumno.preguntasFalladas}</td>
                                        <td className="py-0 text-center">{alumno.likes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Bloque Competición Docentes */}
                <div className="bg-yellow-50 rounded-lg shadow-md p-3 w-full max-w-7xl mx-auto text-[11px]">
                    <h2 className="text-xl font-bold text-center mb-4">Competición Docentes</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-yellow-100">
                                <th className="py-2 text-center">PG</th>
                                <th className="py-2 text-center">EC</th>
                                <th className="py-2 text-center">Docente</th>
                                <th className="py-2 text-center">G</th>
                                <th className="py-2 text-center">P</th>
                                <th className="py-2 text-center">PA</th>
                                <th className="py-2 text-center">PF</th>
                                <th className="py-2 text-center">❤️</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mostrarDocentes.map((docente, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="py-1 text-center font-bold">{idx + 1}</td>
                                    <td className="py-1 text-center">
                                        <span className="inline-block w-8 h-8 text-2xl align-middle">{docente.escudo}</span>
                                    </td>
                                    <td className="py-1 font-semibold">
                                        <span style={{ color: '#007bff' }}>{renderNick(docente.nombre)}</span>
                                    </td>
                                    <td className="py-1 text-center">{docente.ganados}</td>
                                    <td className="py-1 text-center">{docente.perdidos}</td>
                                    <td className="py-1 text-center">{docente.preguntasAcertadas}</td>
                                    <td className="py-1 text-center">{docente.preguntasFalladas}</td>
                                    <td className="py-1 text-center">{docente.likes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Resumen de significados de las siglas */}
                <div className="bg-green-50 rounded-lg shadow p-4 w-full mt-4">
                    <h3 className="font-bold mb-2">Significado de las siglas:</h3>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        <li><b>PG</b>: Posición Global</li>
                        <li><b>EC</b>: Escudo Centro / Avatar</li>
                        <li><b>CE</b>: Nombre del Centro</li>
                        <li><b>A</b>: Alumno</li>
                        <li><b>G</b>: Ganados</li>
                        <li><b>P</b>: Perdidos</li>
                        <li><b>PA</b>: Preguntas Acertadas</li>
                        <li><b>PF</b>: Preguntas Falladas</li>
                        <li><b>❤️</b>: Likes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
