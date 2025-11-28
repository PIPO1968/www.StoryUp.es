"use client";
import React, { useState, useEffect } from "react";

// Interfaces de tipos
interface SolicitudPago {
    id: string;
    nick: string;
    email: string;
    fechaSolicitud: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    tipo: string;
    precio: number;
    metodoPago: string;
    fechaAprobacion?: string;
    fechaRechazo?: string;
    motivo?: string;
}

interface Usuario {
    nick: string;
    email?: string;
    tipo?: string;
}

export default function AdminPremium() {
    const [mensaje, setMensaje] = useState<string>("");
    const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudPago[]>([]);
    const [mostrarSolicitudes, setMostrarSolicitudes] = useState<boolean>(false);
    const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(null);
    const [accesoDenegado, setAccesoDenegado] = useState<boolean>(false);
    const [nick, setNick] = useState<string>("");

    // Lista de administradores autorizados - Solo PIPO68
    const ADMINS_AUTORIZADOS = ['PIPO68'];

    useEffect(() => {
        // Verificar si hay usuario logueado via API
        const checkUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        setUsuarioLogueado(data.user);
                    } else {
                        setAccesoDenegado(true);
                    }
                } else {
                    setAccesoDenegado(true);
                }
            } catch (error) {
                console.error('Error checking user:', error);
                setAccesoDenegado(true);
            }
        };

        checkUser();
    }, []);

    // Si no tiene acceso, mostrar página de error
    if (accesoDenegado) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center p-8">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Acceso Denegado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Acceso restringido a esta página de administración.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                        Volver al Inicio
                    </button>

                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                        <p className="text-xs text-gray-600">
                            <strong>Acceso autorizado para usuarios registrados:</strong><br />
                            • Administrador: <strong>PIPO68</strong><br />
                            • Docentes: Usuarios con tipo "docente"<br />
                            URL: <code className="bg-gray-200 px-1 rounded">tudominio.com/admin-premium</code>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Cargar solicitudes pendientes
    const cargarSolicitudes = async (): Promise<void> => {
        try {
            const response = await fetch('/api/premium/solicitudes');
            const solicitudes = await response.json();
            setSolicitudesPendientes(solicitudes.filter((s: any) => s.estado === 'pendiente'));
            setMostrarSolicitudes(true);
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
            setMensaje("❌ Error al cargar solicitudes de pago");
        }
    };

    // Aprobar solicitud de pago (activar Premium)
    const aprobarSolicitud = async (solicitud: SolicitudPago): Promise<void> => {
        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve', solicitudId: solicitud.id })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`🎉 ${data.message}`);
                cargarSolicitudes(); // Recargar lista
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error al aprobar solicitud:', error);
            setMensaje("❌ Error al aprobar la solicitud");
        }
    };

    // Rechazar solicitud
    const rechazarSolicitud = async (solicitud: SolicitudPago, motivo: string = 'Pago no verificado'): Promise<void> => {
        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', solicitudId: solicitud.id, motivo })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`❌ ${data.message}`);
                cargarSolicitudes(); // Recargar lista
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
            setMensaje("❌ Error al rechazar la solicitud");
        }
    };

    // Hacer Premium
    const hacerPremium = async (): Promise<void> => {
        if (!nick.trim()) {
            setMensaje("❌ Ingresa un nick válido");
            return;
        }

        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'activate', nick })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`🎉 ${data.message}`);
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error al activar premium:', error);
            setMensaje("❌ Error al activar Premium");
        }
    };

    // Anular Premium
    const anularPremium = async (): Promise<void> => {
        if (!nick.trim()) {
            setMensaje("❌ Ingresa un nick válido");
            return;
        }

        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deactivate', nick })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`🗑️ ${data.message}`);
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error al anular premium:', error);
            setMensaje("❌ Error al anular Premium");
        }
    };

    const activarPremium = async (): Promise<void> => {
        if (!nick.trim()) {
            setMensaje("❌ Ingresa un nick válido");
            return;
        }

        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'activate', nick })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`🎉 ¡Premium activado exitosamente para ${nick}!`);
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error al activar Premium:', error);
            setMensaje("❌ Error al activar Premium. Inténtalo de nuevo.");
        }
    };

    const verificarPremium = async (): Promise<void> => {
        if (!nick.trim()) {
            setMensaje("❌ Ingresa un nick válido");
            return;
        }

        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check', nick })
            });

            const data = await response.json();
            if (response.ok) {
                if (data.premium) {
                    setMensaje(`✅ ${nick} tiene Premium ACTIVO`);
                } else {
                    setMensaje(`❌ ${nick} NO tiene Premium activado`);
                }
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            setMensaje("❌ Error al verificar Premium");
        }
    };

    const desactivarPremium = async (): Promise<void> => {
        if (!nick.trim()) {
            setMensaje("❌ Ingresa un nick válido");
            return;
        }

        try {
            const response = await fetch('/api/premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deactivate', nick })
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(`🗑️ ${data.message}`);
            } else {
                setMensaje(`❌ ${data.error}`);
            }
        } catch (error) {
            setMensaje("❌ Error al desactivar Premium");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        🔧 Admin Premium
                    </h1>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Nick del usuario:
                        </label>
                        <input
                            type="text"
                            value={nick}
                            onChange={(e) => setNick(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: PIPO68"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <button
                            onClick={activarPremium}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            ✅ Activar Premium
                        </button>

                        <button
                            onClick={anularPremium}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            🗑️ Anular Premium
                        </button>

                        <button
                            onClick={verificarPremium}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            🔍 Verificar Estado
                        </button>

                        <button
                            onClick={cargarSolicitudes}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            📋 Ver Solicitudes
                        </button>
                    </div>

                    {mensaje && (
                        <div className={`p-4 rounded-lg ${mensaje.includes('✅') || mensaje.includes('🎉')
                            ? 'bg-green-100 border border-green-300 text-green-800'
                            : mensaje.includes('❌')
                                ? 'bg-red-100 border border-red-300 text-red-800'
                                : 'bg-blue-100 border border-blue-300 text-blue-800'
                            }`}>
                            <pre className="whitespace-pre-wrap font-semibold">{mensaje}</pre>
                        </div>
                    )}

                    {/* Sección de solicitudes pendientes */}
                    {mostrarSolicitudes && (
                        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                📋 Solicitudes de Pago Pendientes
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    {solicitudesPendientes.length}
                                </span>
                            </h3>

                            {solicitudesPendientes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    ✅ No hay solicitudes pendientes
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {solicitudesPendientes.map((solicitud) => (
                                        <div key={solicitud.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-gray-800">{solicitud.user.nick}</h4>
                                                    <p className="text-sm text-gray-600">{solicitud.user.email}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        📅 {new Date(solicitud.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                                        Pendiente
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => aprobarSolicitud(solicitud)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                                                >
                                                    ✅ Aprobar y Activar Premium
                                                </button>
                                                <button
                                                    onClick={() => rechazarSolicitud(solicitud)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                                                >
                                                    ❌ Rechazar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-bold text-yellow-800 mb-2">📋 Instrucciones:</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li><strong>Activar Premium:</strong> Activa Premium por 1 año para cualquier usuario</li>
                            <li><strong>Anular Premium:</strong> Remueve el estado Premium de un usuario</li>
                            <li><strong>Verificar Estado:</strong> Comprueba si un usuario ya tiene Premium activo</li>
                            <li><strong>Ver Solicitudes:</strong> Muestra pagos pendientes de verificación</li>
                            <li><strong>Aprobar/Rechazar:</strong> Gestiona las solicitudes tras verificar Bizum</li>
                        </ul>

                        <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded">
                            <p className="text-sm text-orange-800">
                                <strong>🔒 Proceso de seguridad:</strong> Ahora los usuarios NO pueden hacerse Premium automáticamente.
                                Deben solicitar y esperar verificación manual del pago.
                            </p>
                        </div>

                        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
                            <p className="text-sm text-blue-800">
                                <strong>🌐 Acceso en servidor:</strong><br />
                                • URL: <code className="bg-blue-200 px-1 rounded">tudominio.com/admin-premium</code><br />
                                • Protegido por nick de administrador<br />
                                • Solo usuario autorizado: <strong>PIPO68</strong>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => window.location.href = '/estadisticas'}
                            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            📊 Ver Estadísticas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}