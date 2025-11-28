"use client";
import React from "react";
import { renderNick } from "@/utils/renderNick";
import { useTranslation } from '@/utils/i18n';
import { UserLink } from "@/components/UserLink";

export default function Estadisticas() {
    const { t } = useTranslation();
    // Estado para detectar si el usuario es Premium
    const [isPremium, setIsPremium] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [users, setUsers] = React.useState<any[]>([]);
    const [historias, setHistorias] = React.useState<any[]>([]);
    const [concursos, setConcursos] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Función para calcular puntos totales de un usuario
    function calcularPuntosTotales(user: any): number {
        if (!user || !user.nick) return 0;

        let puntosTotales = 0;

        // Puntos por asignaturas (desde la DB ahora)
        const asignaturas = ['matematicas', 'lenguaje', 'geografia', 'historia', 'literatura', 'ingles', 'naturaleza'];
        asignaturas.forEach(asignatura => {
            // Los puntos ahora vienen de la DB en el campo stats_individual
            const stats = user.stats_individual ? JSON.parse(user.stats_individual) : {};
            const puntosAsignatura = stats[asignatura] || 0;
            puntosTotales += puntosAsignatura;
        });

        // Puntos por likes (cada like cuenta como punto)
        puntosTotales += user.likes || 0;

        // Puntos por competiciones superadas (cada competición superada vale 10 puntos)
        puntosTotales += (user.competicionesSuperadas || 0) * 10;

        // Puntos por preguntas acertadas (cada pregunta acertada vale 2 puntos)
        puntosTotales += (user.respuestasAcertadas || 0) * 2;

        return puntosTotales;
    }

    React.useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Obtener usuario actual
                const userResponse = await fetch('/api/auth/me');
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.user) {
                        setCurrentUser(userData.user);
                        setIsPremium(userData.user.premium || false);
                    }
                }

                // Obtener todos los usuarios
                const usersResponse = await fetch('/api/users');
                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    setUsers(usersData);
                }

                // Obtener historias (si existe la API)
                try {
                    const historiasResponse = await fetch('/api/historias');
                    if (historiasResponse.ok) {
                        const historiasData = await historiasResponse.json();
                        setHistorias(historiasData);
                    }
                } catch (error) {
                    console.warn('API de historias no disponible:', error);
                }

                // Obtener concursos (si existe la API)
                try {
                    const concursosResponse = await fetch('/api/concursos');
                    if (concursosResponse.ok) {
                        const concursosData = await concursosResponse.json();
                        setConcursos(concursosData);
                    }
                } catch (error) {
                    console.warn('API de concursos no disponible:', error);
                }

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-green-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p>Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-100 p-8">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">
                    {isPremium ? (
                        <>
                            <span className="text-yellow-600">{t('estadisticasPremium')}</span>
                            <div className="text-sm text-gray-600 mt-1">
                                ¡Hola {currentUser?.nick}! Disfrutas de estadísticas avanzadas
                            </div>
                        </>
                    ) : (
                        <>
                            Estadísticas
                            <div className="text-sm text-blue-600 mt-1">
                                <button
                                    onClick={() => window.location.href = '/premium-nuevo'}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs hover:shadow-lg transform hover:scale-105 transition-all"
                                >
                                    ✨ {t('haztePremiumParaVer')} ✨
                                </button>
                            </div>
                        </>
                    )}
                </h1>
            </div>

            {/* Bloque 1: Estadísticas Globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold mb-4 text-center">{t('estadisticasGlobales')}</h2>
                    <ul className="space-y-2">
                        <li><span className="mr-2 text-xl">🏆</span><b>{t('totalCompeticionesSuperadas')}:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                total += u.competicionesSuperadas || 0;
                            });
                            return total;
                        })()}</li>
                        <li><span className="mr-2 text-xl">👥</span><b>{t('totalUsuarios')}:</b> {users.length}</li>
                        <li><span className="mr-2 text-xl">📖</span><b>{t('totalHistoriasCreadas')}:</b> {historias.length}</li>
                        <li><span className="mr-2 text-xl">🏆</span><b>{t('totalConcursosCreados')}:</b> {concursos.length}</li>
                        <li><span className="mr-2 text-xl">💬</span><b>Total de comentarios realizados:</b> {(() => {
                            let total = 0;
                            historias.forEach((h: any) => {
                                // Asumiendo que los comentarios están en la relación de historias
                                total += h.comentarios ? h.comentarios.length : 0;
                            });
                            return total;
                        })()}</li>
                        <li><span className="mr-2 text-xl">🏫</span><b>Total de centros escolares registrados:</b> {(() => {
                            const centros = new Set(users.map((u: any) => u.centro).filter(Boolean));
                            return centros.size;
                        })()}</li>
                        <li><span className="mr-2 text-xl">👨‍🏫</span><b>Total de docentes registrados:</b> {(() => {
                            const docentesArr = users.filter((u: any) => (u.tipo || "").toLowerCase() === "docente");
                            return docentesArr.length || 0;
                        })()}</li>
                        <li><span className="mr-2 text-xl">🤝</span><b>Total de amigos creados:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                // Contar amigos desde las relaciones
                                const amigosComoUser = u.amigosComoUser?.length || 0;
                                total += amigosComoUser;
                            });
                            return total > 0 ? total : 0;
                        })()}</li>
                        <li><span className="mr-2 text-xl">🏅</span><b>Total de historias ganadoras:</b> {(() => {
                            return concursos.filter((c: any) => c.historiaGanadora).length || 0;
                        })()}</li>
                        <li><span className="mr-2 text-xl">👨‍👩‍👧‍👦</span><b>Total de participantes en concursos:</b> {(() => {
                            let count = 0;
                            users.forEach((u: any) => {
                                if (u.historias && Array.isArray(u.historias) && u.historias.length > 0) {
                                    count++;
                                }
                            });
                            return count;
                        })()}</li>
                        <li><span className="mr-2 text-xl">❤️</span><b>Total de likes:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                total += (u.likes || 0);
                            });
                            return total;
                        })()}</li>
                        <li><span className="mr-2 text-xl">❓</span><b>Total de preguntas respondidas:</b> {(() => {
                            let totalAcertadas = 0;
                            let totalFalladas = 0;
                            users.forEach((u: any) => {
                                totalAcertadas += u.respuestasAcertadas || 0;
                                // Si hay estadísticas adicionales en JSON
                                if (u.stats_individual) {
                                    const stats = JSON.parse(u.stats_individual);
                                    totalFalladas += stats.preguntasFalladas || 0;
                                }
                            });
                            return totalAcertadas + totalFalladas;
                        })()}</li>
                        <li><span className="mr-2 text-xl">❓</span><b>{t('totalPreguntasAcertadas')}:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                total += u.respuestasAcertadas || 0;
                            });
                            return total;
                        })()}</li>
                        <li><span className="mr-2 text-xl">❓</span><b>Total de preguntas falladas:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                // Si hay estadísticas adicionales en JSON
                                if (u.stats_individual) {
                                    const stats = JSON.parse(u.stats_individual);
                                    total += stats.preguntasFalladas || 0;
                                }
                            });
                            return total;
                        })()}</li>
                        <li><span className="mr-2 text-xl">🏆</span><b>Total de concursos ganados:</b> {(() => {
                            let total = 0;
                            users.forEach((u: any) => {
                                total += u.concursosGanados || 0;
                            });
                            return total;
                        })()}</li>
                    </ul>
                </div>
                {/* Bloque 2: Rankings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold mb-4 text-center">Rankings</h2>
                    <ul className="space-y-2">
                        <li><span className="mr-2 text-xl">❤️</span><b>{t('usuariosMasLikes')}:</b> {(() => {
                            const ranking = users.map((u: any) => {
                                return {
                                    nick: u.nick,
                                    nombre: u.nombre,
                                    totalLikes: (u.likes || 0)
                                };
                            })
                                .filter((u: { nick: string; nombre: string; totalLikes: number }) => u.nick && u.totalLikes > 0) // Solo usuarios con al menos 1 like
                                .sort((a: { totalLikes: number }, b: { totalLikes: number }) => b.totalLikes - a.totalLikes)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con likes.</span>;
                            return ranking.map((u: { nick: string; totalLikes: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.totalLikes} likes)</span>
                            ));
                        })()}</li>
                        <li><span className="mr-2 text-xl">💬</span><b>{t('usuariosMasComentarios')}:</b> {(() => {
                            const comentariosPorAutor: Record<string, number> = {};
                            historias.forEach((h: any) => {
                                if (h.autor) {
                                    comentariosPorAutor[h.autor] = (comentariosPorAutor[h.autor] || 0) + (h.comentarios ? h.comentarios.length : 0);
                                }
                            });
                            const ranking = Object.entries(comentariosPorAutor)
                                .map(([nick, totalComentarios]: [string, number]) => ({ nick, totalComentarios }))
                                .filter((u: { nick: string; totalComentarios: number }) => u.nick && u.totalComentarios > 0)
                                .sort((a: { totalComentarios: number }, b: { totalComentarios: number }) => b.totalComentarios - a.totalComentarios)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con comentarios aún.</span>;
                            return ranking.map((u: { nick: string; totalComentarios: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.totalComentarios} comentarios)</span>
                            ));
                        })()}</li>
                        <li><span className="mr-2 text-xl">🤝</span><b>Usuarios con más amigos:</b> {(() => {
                            const ranking = users
                                .map((u: any) => {
                                    const numAmigos = u.amigosComoUser?.length || 0;
                                    return {
                                        nick: u.nick,
                                        numAmigos
                                    };
                                })
                                .filter((u: { nick: string; numAmigos: number }) => u.nick && u.numAmigos > 0)
                                .sort((a: { numAmigos: number }, b: { numAmigos: number }) => b.numAmigos - a.numAmigos)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con amigos aún.</span>;
                            return ranking.map((u: { nick: string; numAmigos: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.numAmigos} amigos)</span>
                            ));
                        })()}</li>
                        <li><span className="mr-2 text-xl">📖</span><b>Usuarios con más historias:</b> {(() => {
                            const historiasPorAutor: Record<string, number> = {};
                            historias.forEach((h: any) => {
                                if (h.autor) {
                                    historiasPorAutor[h.autor] = (historiasPorAutor[h.autor] || 0) + 1;
                                }
                            });
                            const ranking = Object.entries(historiasPorAutor)
                                .map(([nick, totalHistorias]: [string, number]) => ({ nick, totalHistorias }))
                                .filter((u: { nick: string; totalHistorias: number }) => u.nick && u.totalHistorias > 0)
                                .sort((a: { totalHistorias: number }, b: { totalHistorias: number }) => b.totalHistorias - a.totalHistorias)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con historias aún.</span>;
                            return ranking.map((u: { nick: string; totalHistorias: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.totalHistorias} historias)</span>
                            ));
                        })()}</li>
                        <li><span className="mr-2 text-xl">🏆</span><b>Usuarios con más concursos ganados:</b> {(() => {
                            const ranking = users.map((u: any) => ({
                                nick: u.nick,
                                nombre: u.nombre,
                                totalConcursos: u.concursosGanados || 0
                            }))
                                .filter((u: { nick: string; nombre: string; totalConcursos: number }) => u.totalConcursos > 0)
                                .sort((a: { totalConcursos: number }, b: { totalConcursos: number }) => b.totalConcursos - a.totalConcursos)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con concursos ganados aún.</span>;
                            return ranking.map((u: { nick: string; totalConcursos: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.totalConcursos} concursos)</span>
                            ));
                        })()}</li>
                        <li><span className="mr-2 text-xl">🏆</span><b>Usuarios con más competiciones superadas:</b> {(() => {
                            const ranking = users
                                .map((u: any) => ({
                                    nick: u.nick,
                                    nombre: u.nombre,
                                    totalCompeticiones: u.competicionesSuperadas || 0
                                }))
                                .filter((u: { totalCompeticiones: number }) => u.totalCompeticiones > 0)
                                .sort((a: { totalCompeticiones: number }, b: { totalCompeticiones: number }) => b.totalCompeticiones - a.totalCompeticiones)
                                .slice(0, 5);
                            if (ranking.length === 0) return <span className="block">No hay usuarios con competiciones superadas aún.</span>;
                            return ranking.map((u: { nick: string; totalCompeticiones: number }, i: number) => (
                                <span key={u.nick} className="block">{i + 1}. <b><UserLink nick={u.nick} /></b> ({u.totalCompeticiones} competiciones)</span>
                            ));
                        })()}</li>

                    </ul>
                </div>
            </div>
            {/* Bloque Premium: Estadísticas Avanzadas Solo para Premium */}
            {isPremium && (
                <div className="max-w-5xl mx-auto mt-8">
                    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-1 shadow-2xl">
                        <div className="bg-white rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                                👑 Estadísticas Premium Avanzadas 👑
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Análisis Personal Premium */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
                                    <h3 className="font-bold text-blue-800 mb-3 text-center">📈 Tu Análisis Personal</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex justify-between">
                                            <span>🎯 Precisión promedio:</span>
                                            <span className="font-bold text-blue-600">{(() => {
                                                if (currentUser) {
                                                    const acertadas = currentUser.respuestasAcertadas || 0;
                                                    const falladas = 0; // No hay campo en DB
                                                    const total = acertadas + falladas;
                                                    return total > 0 ? ((acertadas / total) * 100).toFixed(1) + '%' : '0%';
                                                }
                                                return '0%';
                                            })()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>⚡ Racha actual:</span>
                                            <span className="font-bold text-blue-600">{currentUser?.racha || 0} días</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>📅 Días activo:</span>
                                            <span className="font-bold text-blue-600">{(() => {
                                                if (currentUser?.fechaRegistro) {
                                                    const fechaReg = new Date(currentUser.fechaRegistro);
                                                    const ahora = new Date();
                                                    const diffTime = Math.abs(ahora.getTime() - fechaReg.getTime());
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    return diffDays;
                                                }
                                                return 0;
                                            })()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>🏆 Tu ranking:</span>
                                            <span className="font-bold text-blue-600">{(() => {
                                                // Ranking basado en respuestasAcertadas
                                                if (users.length > 0 && currentUser) {
                                                    const usersWithPoints = users.map((u: any) => ({
                                                        ...u,
                                                        puntosTotales: u.respuestasAcertadas || 0
                                                    }));
                                                    const sorted = usersWithPoints.sort((a: any, b: any) => b.puntosTotales - a.puntosTotales);
                                                    const position = sorted.findIndex((u: any) => u.nick === currentUser.nick) + 1;
                                                    return position > 0 ? `#${position}` : '-';
                                                }
                                                return '-';
                                            })()}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Análisis de Materias Premium */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4">
                                    <h3 className="font-bold text-green-800 mb-3 text-center">📚 Análisis por Materias</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex justify-between">
                                            <span>🔬 Matemáticas:</span>
                                            <span className="font-bold text-green-600">Datos no disponibles</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>📖 Lenguaje:</span>
                                            <span className="font-bold text-green-600">Datos no disponibles</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>🌍 Geografía:</span>
                                            <span className="font-bold text-green-600">Datos no disponibles</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>📚 Historia:</span>
                                            <span className="font-bold text-green-600">Datos no disponibles</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>🎨 Tu fuerte:</span>
                                            <span className="font-bold text-green-600">Datos no disponibles</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Logros y Proyección Premium */}
                                <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4">
                                    <h3 className="font-bold text-purple-800 mb-3 text-center">🎯 Logros y Proyección</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex justify-between">
                                            <span>📈 Crecimiento:</span>
                                            <span className="font-bold text-purple-600">{(() => {
                                                if (currentUser) {
                                                    const acertadas = currentUser.respuestasAcertadas || 0;
                                                    const falladas = 0;
                                                    const total = acertadas + falladas;
                                                    if (total > 0) {
                                                        const precision = (acertadas / total) * 100;
                                                        const crecimiento = Math.max(0, Math.floor(precision - 50));
                                                        return `+${crecimiento}% sem.`;
                                                    }
                                                }
                                                return '+0% sem.';
                                            })()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>🎯 Meta semanal:</span>
                                            <span className="font-bold text-purple-600">{(() => {
                                                if (currentUser) {
                                                    const acertadas = currentUser.respuestasAcertadas || 0;
                                                    const falladas = 0;
                                                    const total = acertadas + falladas;
                                                    if (total > 0) {
                                                        const precision = (acertadas / total) * 100;
                                                        return precision >= 75 ? '75% ✅' : `${precision.toFixed(1)}% ❌`;
                                                    }
                                                }
                                                return '0% ❌';
                                            })()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>⭐ Próximo nivel:</span>
                                            <span className="font-bold text-purple-600">{(() => {
                                                if (currentUser) {
                                                    const puntosActuales = calcularPuntosTotales(currentUser);
                                                    const nivelActual = Math.floor(puntosActuales / 100);
                                                    const puntosParaSiguiente = ((nivelActual + 1) * 100) - puntosActuales;
                                                    return `${puntosParaSiguiente} pts`;
                                                }
                                                return '100 pts';
                                            })()}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Gráfico de Progreso Premium */}
                            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                                <h3 className="font-bold text-indigo-800 mb-3 text-center">📊 Gráfico de Progreso Semanal</h3>
                                <div className="flex items-end justify-between h-32 gap-2">
                                    {[...Array(7)].map((_, i) => {
                                        const dayActivities = (() => {
                                            if (currentUser) {
                                                const acertadas = currentUser.respuestasAcertadas || 0;
                                                const total = acertadas;

                                                // Simular actividad distribuida a lo largo de la semana
                                                const baseActivity = Math.floor(total / 7);
                                                const variation = Math.floor(Math.random() * 5) - 2; // -2 a +2
                                                return Math.max(0, baseActivity + variation);
                                            }
                                            return Math.floor(Math.random() * 5) + 1;
                                        })();

                                        const maxHeight = 25; // altura máxima esperada
                                        const height = Math.max(20, Math.min(100, (dayActivities / maxHeight) * 80 + 20));
                                        const day = ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i];
                                        const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);

                                        return (
                                            <div key={i} className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 rounded-t-md ${isToday ? 'bg-gradient-to-t from-orange-500 to-red-500' : 'bg-gradient-to-t from-blue-500 to-purple-500'}`}
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                                <span className={`text-xs mt-1 font-semibold ${isToday ? 'text-orange-600' : 'text-indigo-600'}`}>
                                                    {day}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {dayActivities}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center mt-3 text-sm text-indigo-600">
                                    📈 <strong>Tendencia:</strong> {(() => {
                                        if (currentUser) {
                                            const acertadas = currentUser.respuestasAcertadas || 0;
                                            const falladas = 0;
                                            const precision = falladas + acertadas > 0 ? (acertadas / (falladas + acertadas)) * 100 : 0;

                                            if (precision >= 80) return '¡Excelente! Mantén este nivel de precisión.';
                                            if (precision >= 60) return '¡Vas muy bien! Mantén el ritmo esta semana.';
                                            if (precision >= 40) return 'Buen progreso. ¡Sigue practicando!';
                                            return 'Empezando bien. ¡Cada respuesta cuenta!';
                                        }
                                        return '¡Empieza tu aventura de aprendizaje!';
                                    })()}
                                </div>
                            </div>

                            {/* Comparativa Premium */}
                            <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                                <h3 className="font-bold text-orange-800 mb-3 text-center">⚔️ Tu Posición vs. Mejores</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-white rounded-lg p-3">
                                        <div className="text-2xl">🥇</div>
                                        <div className="text-xs text-gray-600">1º Lugar</div>
                                        <div className="font-bold text-yellow-600">{(() => {
                                            const usersWithPoints = users.map((u: any) => ({
                                                ...u,
                                                puntosTotales: u.respuestasAcertadas || 0
                                            }));
                                            const sorted = usersWithPoints.sort((a: any, b: any) => b.puntosTotales - a.puntosTotales);
                                            return sorted[0]?.puntosTotales || 0;
                                        })()}</div>
                                        <div className="text-xs text-gray-500">{(() => {
                                            const usersWithPoints = users.map((u: any) => ({
                                                ...u,
                                                puntosTotales: u.respuestasAcertadas || 0
                                            }));
                                            const sorted = usersWithPoints.sort((a: any, b: any) => b.puntosTotales - a.puntosTotales);
                                            return sorted[0]?.nick || 'Nadie';
                                        })()}</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 border-2 border-blue-300">
                                        <div className="text-2xl">👑</div>
                                        <div className="text-xs text-blue-600 font-bold">TÚ</div>
                                        <div className="font-bold text-blue-600">{currentUser ? (currentUser.respuestasAcertadas || 0) : 0}</div>
                                        <div className="text-xs text-blue-500">{(() => {
                                            if (currentUser) {
                                                const usersWithPoints = users.map((u: any) => ({
                                                    ...u,
                                                    puntosTotales: u.respuestasAcertadas || 0
                                                }));
                                                const sorted = usersWithPoints.sort((a: any, b: any) => b.puntosTotales - a.puntosTotales);
                                                const position = sorted.findIndex((u: any) => u.nick === currentUser.nick) + 1;
                                                return position > 0 ? `Posición #${position}` : 'Sin clasificar';
                                            }
                                            return 'Sin clasificar';
                                        })()}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <div className="text-2xl">🎯</div>
                                        <div className="text-xs text-gray-600">Promedio</div>
                                        <div className="font-bold text-gray-600">{(() => {
                                            const total = users.reduce((sum: number, u: any) => sum + (u.respuestasAcertadas || 0), 0);
                                            return Math.floor(total / users.length);
                                        })()}</div>
                                        <div className="text-xs text-gray-500">{(() => {
                                            return `${users.length} usuarios`;
                                        })()}</div>
                                    </div>
                                </div>
                                {/* Indicador de diferencia con el promedio */}
                                <div className="mt-3 text-center text-sm">
                                    {(() => {
                                        if (currentUser) {
                                            const total = users.reduce((sum: number, u: any) => sum + (u.respuestasAcertadas || 0), 0);
                                            const promedio = Math.floor(total / users.length);
                                            const tusPuntos = currentUser.respuestasAcertadas || 0;
                                            const diferencia = tusPuntos - promedio;

                                            if (diferencia > 0) {
                                                return <span className="text-green-600">📈 +{diferencia} puntos sobre el promedio</span>;
                                            } else if (diferencia < 0) {
                                                return <span className="text-red-600">📉 {Math.abs(diferencia)} puntos bajo el promedio</span>;
                                            } else {
                                                return <span className="text-blue-600">🎯 Exactamente en el promedio</span>;
                                            }
                                        }
                                        return <span className="text-gray-500">Sin datos para comparar</span>;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bloque 3: Mejores estadísticas y curiosidades */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto mt-8" >
                <h2 className="text-lg font-bold mb-4 text-center">Mejores estadísticas</h2>
                <ul className="space-y-2 text-center">
                    <li><span className="mr-2 text-xl">📖</span><b>Historia con más likes:</b> {(() => {
                        if (historias.length === 0) return "-";
                        const top = historias.reduce((max: any, h: any) => {
                            if ((h.likes || 0) > (max.likes || 0)) return h;
                            return max;
                        }, historias[0]);
                        return (
                            <span>
                                <b>{top.titulo}</b> por <b><UserLink nick={top.autor} /></b> <span className="text-pink-600">❤️ {top.likes || 0}</span>
                            </span>
                        );
                    })()}</li>
                    <li><span className="mr-2 text-xl">💬</span><b>Historia más comentada:</b> {(() => {
                        if (historias.length === 0) return "-";
                        const top = historias.reduce((max: any, h: any) => {
                            const comentarios = h.comentarios ? h.comentarios.length : 0;
                            const maxComentarios = max.comentarios ? max.comentarios.length : 0;
                            if (comentarios > maxComentarios) return h;
                            return max;
                        }, historias[0]);
                        return (
                            <span>
                                <b>{top.titulo}</b> por <b><UserLink nick={top.autor} /></b> <span className="text-blue-600">💬 {top.comentarios ? top.comentarios.length : 0}</span>
                            </span>
                        );
                    })()}</li>
                    <li><span className="mr-2 text-xl">🏫</span><b>Centro con más historias creadas:</b> {(() => {
                        if (historias.length === 0 || users.length === 0) return "-";
                        const nickToCentro: Record<string, string> = {};
                        users.forEach((u: any) => {
                            if (u.nick && u.centro) {
                                nickToCentro[u.nick] = u.centro;
                            }
                        });
                        const historiasPorCentro: Record<string, number> = {};
                        historias.forEach((h: any) => {
                            const centro = h.centro || nickToCentro[h.autor] || null;
                            if (centro) {
                                historiasPorCentro[centro] = (historiasPorCentro[centro] || 0) + 1;
                            }
                        });
                        const top = Object.entries(historiasPorCentro).sort((a, b) => b[1] - a[1])[0];
                        if (!top) return "-";
                        return (
                            <span>
                                <b>{top[0]}</b> <span className="text-purple-600">🏫 {top[1]}</span>
                            </span>
                        );
                    })()}</li>
                    <li><span className="mr-2 text-xl">🏫</span><b>Centro Escolar con más usuarios activos:</b> {(() => {
                        if (users.length === 0) return "-";
                        const usuariosPorCentro: Record<string, number> = {};
                        users.forEach((u: any) => {
                            if (u.centro) {
                                usuariosPorCentro[u.centro] = (usuariosPorCentro[u.centro] || 0) + 1;
                            }
                        });
                        const top = Object.entries(usuariosPorCentro).sort((a, b) => b[1] - a[1])[0];
                        if (!top) return "-";
                        return (
                            <span>
                                <b>{top[0]}</b> <span className="text-blue-600">🏫 {top[1]}</span>
                            </span>
                        );
                    })()}</li>
                </ul>
            </div>
        </div>
    );
}
