import React from "react";
import { useQuizLogic } from "@/hooks/useQuizLogic";

interface TournamentQuizProps {
    userGrade: number;
    onTournamentComplete: (aciertos: number, puntuacionTotal: number) => void;
}

const TournamentQuiz: React.FC<TournamentQuizProps> = ({ userGrade, onTournamentComplete }) => {
    const {
        preguntaActual,
        setPreguntaActual,
        objetoPreguntaActual,
        setObjetoPreguntaActual,
        respuestaCorrecta,
        setRespuestaCorrecta,
        respuestaUsuario,
        setRespuestaUsuario,
        feedback,
        setFeedback,
        preguntasUsadas,
        setPreguntasUsadas,
        timeLeft,
        setTimeLeft,
        bloqueado,
        setBloqueado,
        aciertos,
        setAciertos,
        puntuacionTotal,
        setPuntuacionTotal,
        preguntaNumero,
        setPreguntaNumero,
        comprobarRespuesta,
        generarPregunta,
        resetQuiz
    } = useQuizLogic({
        timeLimit: 300,
        onTimeUp: () => {
            setPuntuacionTotal(puntuacionTotal - 15);
            setFeedback("⏰ Tiempo agotado. -15 puntos");
        }
    });

    // Cargar preguntas de general según el curso
    let preguntas: any[] = [];
    try {
        preguntas = require(`../questions/general-${userGrade}primaria.json`);
    } catch {
        preguntas = [];
    }

    const handleGenerarPregunta = () => {
        if (preguntasUsadas.length >= 25) {
            // Torneo completado
            onTournamentComplete(aciertos, puntuacionTotal);
            return;
        }

        generarPregunta(preguntas, 25, () => {
            onTournamentComplete(aciertos, puntuacionTotal);
        });
    };

    const handleVerificarRespuesta = () => {
        if (bloqueado) return;

        const tiempoUsado = 300 - timeLeft;
        let puntosPregunta = 0;

        if (respuestaUsuario.toLowerCase().trim() === respuestaCorrecta.toLowerCase().trim()) {
            setAciertos(aciertos + 1);
            if (tiempoUsado <= 60) {
                puntosPregunta = 10;
                setFeedback("✅ ¡Correcto! +10 puntos (rápido)");
            } else if (tiempoUsado <= 120) {
                puntosPregunta = 5;
                setFeedback("✅ ¡Correcto! +5 puntos");
            } else {
                puntosPregunta = 5;
                setFeedback("✅ ¡Correcto! +5 puntos");
            }
        } else {
            if (tiempoUsado <= 60) {
                puntosPregunta = -5;
                setFeedback(`❌ Incorrecto. -5 puntos\nLa respuesta correcta era: ${respuestaCorrecta}`);
            } else if (tiempoUsado <= 120) {
                puntosPregunta = -10;
                setFeedback(`❌ Incorrecto. -10 puntos\nLa respuesta correcta era: ${respuestaCorrecta}`);
            } else {
                puntosPregunta = -10;
                setFeedback(`❌ Incorrecto. -10 puntos\nLa respuesta correcta era: ${respuestaCorrecta}`);
            }
        }

        setPuntuacionTotal(puntuacionTotal + puntosPregunta);
        setBloqueado(true);
    };

    // Iniciar el torneo automáticamente
    React.useEffect(() => {
        if (preguntas.length > 0 && !preguntaActual) {
            handleGenerarPregunta();
        }
    }, [preguntas]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (preguntasUsadas.length >= 25) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-8">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">🎯 ¡Torneo Completado!</h2>
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-lg mb-2">Aciertos: <strong>{aciertos}/25</strong></p>
                    <p className="text-lg mb-2">Puntuación total: <strong>{puntuacionTotal} puntos</strong></p>
                    <p className="text-lg">Promedio: <strong>{(puntuacionTotal / 25).toFixed(1)} pts/pregunta</strong></p>
                    <p className="text-sm text-gray-600 mt-4">Los resultados se procesarán automáticamente...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header del torneo */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">🎯 Modo Torneo Premium</h1>
                    <div className="flex justify-center gap-6 text-white">
                        <div>
                            <div className="text-2xl font-bold">{preguntaNumero}/25</div>
                            <div className="text-sm">Pregunta</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{aciertos}</div>
                            <div className="text-sm">Aciertos</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
                            <div className="text-sm">Tiempo</div>
                        </div>
                    </div>
                </div>

                {/* Pregunta */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {preguntaActual ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">{preguntaActual}</h2>

                                {objetoPreguntaActual && objetoPreguntaActual.imagen && (
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src={objetoPreguntaActual.imagen}
                                            alt="Pregunta"
                                            className="max-w-full h-auto max-h-64 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Input de respuesta */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={respuestaUsuario}
                                    onChange={(e) => setRespuestaUsuario(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && verificarRespuesta()}
                                    placeholder="Escribe tu respuesta aquí..."
                                    className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    disabled={bloqueado}
                                />
                            </div>

                            {/* Botón verificar o siguiente */}
                            <div className="flex gap-4">
                                {!bloqueado ? (
                                    <button
                                        onClick={handleVerificarRespuesta}
                                        disabled={!respuestaUsuario.trim()}
                                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                                    >
                                        Verificar Respuesta
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleGenerarPregunta()}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        {preguntasUsadas.length >= 25 ? 'Finalizar Torneo' : 'Siguiente Pregunta'}
                                    </button>
                                )}
                            </div>

                            {/* Feedback */}
                            {feedback && (
                                <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {feedback}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎯</div>
                            <p className="text-xl">Cargando torneo...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TournamentQuiz;