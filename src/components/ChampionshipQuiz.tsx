import React from "react";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { BUTTON_STYLES } from "../utils/styles";

interface ChampionshipQuizProps {
    userGrade: number;
    userSchool: string;
}

const ChampionshipQuiz: React.FC<ChampionshipQuizProps> = ({ userGrade, userSchool }) => {
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
            // Lógica específica para campeonatos
        }
    });

    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [sessionResponses, setSessionResponses] = React.useState<any[]>([]);

    // Cargar usuario actual al montar el componente
    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const user = await response.json();
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        loadUser();
    }, []);

    // Función para actualizar likes del usuario
    const updateUserLikes = async (likesDelta: number) => {
        if (!currentUser) return;
        try {
            const response = await fetch('/api/user/update-likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ likesDelta })
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setCurrentUser(updatedUser);
                // Emitir evento para refrescar perfil
                window.dispatchEvent(new Event('profileUpdate'));
            }
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    // Función para actualizar estadísticas de campeonato
    const updateChampionshipStats = async (stats: any) => {
        try {
            const response = await fetch('/api/stats/championship', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stats)
            });
            if (!response.ok) {
                console.error('Error updating championship stats');
            }
        } catch (error) {
            console.error('Error updating championship stats:', error);
        }
    };

    // Cargar preguntas de campeonato según el curso
    let preguntas: any[] = [];
    try {
        preguntas = require(`../questions/campeonato-${userGrade}primaria.json`);
    } catch {
        preguntas = [];
    }

    const handleGenerarPregunta = () => {
        if (preguntasUsadas.length >= 25) {
            setPreguntaActual("");
            setRespuestaCorrecta("");
            setFeedback("¡Has completado las 25 preguntas del campeonato!");
            setBloqueado(true);

            // Calcular estadísticas de la sesión y enviar a API
            if (currentUser) {
                const now = new Date();
                let temporada = now.getFullYear();
                if (now.getMonth() + 1 >= 10) temporada += 1;
                const temporadaKey = `t${temporada}`;

                // Calcular de las respuestas de la sesión
                const acertadasSesion = sessionResponses.filter((r: any) => r.correcta).length;
                const falladasSesion = sessionResponses.filter((r: any) => !r.correcta).length;
                const likesSesion = sessionResponses.reduce((sum: number, r: any) => sum + (r.likes || 0), 0);
                const ganadoSesion = acertadasSesion > 12 ? 1 : 0;
                const perdidoSesion = acertadasSesion <= 12 ? 1 : 0;

                const stats = {
                    nick: currentUser.nick,
                    centro: currentUser.centro,
                    curso: currentUser.curso,
                    temporada: temporadaKey,
                    acertadas: acertadasSesion,
                    falladas: falladasSesion,
                    likes: likesSesion,
                    ganado: ganadoSesion,
                    perdido: perdidoSesion,
                    tipo: currentUser.tipo
                };

                updateChampionshipStats(stats);
                setSessionResponses([]);
            }
            return;
        }

        generarPregunta(preguntas, 25);
    };

    const handleComprobarRespuesta = () => {
        if (bloqueado) return;

        const esCorrecta = respuestaUsuario.toLowerCase().trim() === respuestaCorrecta.toLowerCase().trim();
        setBloqueado(true);
        let likesDelta = 0;

        if (esCorrecta) {
            setFeedback("¡Correcto! 🎉");
            likesDelta = timeLeft > 120 ? 2 : 1;
        } else {
            setFeedback(`Incorrecto. La respuesta era: ${respuestaCorrecta}`);
            likesDelta = timeLeft > 120 ? -1 : -2;
        }

        updateUserLikes(likesDelta);

        const respuesta = {
            pregunta: preguntaActual,
            respuestaUsuario,
            respuestaCorrecta,
            correcta: esCorrecta,
            tiempo: timeLeft,
            likes: likesDelta
        };
        setSessionResponses(prev => [...prev, respuesta]);
    };

    return (
        <div className="p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Modo Campeonato</h2>
            <p>Curso seleccionado: {userGrade}º Primaria</p>
            <p>Centro escolar: {userSchool || "No especificado"}</p>
            <button className={BUTTON_STYLES.primary + " mt-2"} onClick={handleGenerarPregunta}>
                Generar pregunta de campeonato
            </button>
            {preguntaActual && (
                <div className="mt-4">
                    <div className="font-semibold mb-2">{preguntaActual}</div>
                    <div className="font-bold text-lg mb-2">⏰ Tiempo: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} min</div>
                    <input
                        type="text"
                        className="border rounded px-2 py-1 w-full mb-2"
                        value={respuestaUsuario}
                        onChange={e => setRespuestaUsuario(e.target.value)}
                        placeholder="Escribe tu respuesta aquí"
                        disabled={bloqueado}
                    />
                    <button className={BUTTON_STYLES.success} onClick={handleComprobarRespuesta} disabled={bloqueado}>
                        Enviar respuesta
                    </button>
                    {feedback && <div className="mt-2 font-bold">{feedback}</div>}
                </div>
            )}
            {feedback && !preguntaActual && <div className="mt-2 font-bold text-red-600">{feedback}</div>}
        </div>
    );
};

export default ChampionshipQuiz;
