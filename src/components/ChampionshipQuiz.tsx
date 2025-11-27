import React from "react";

interface ChampionshipQuizProps {
    userGrade: number;
    userSchool: string;
}

const ChampionshipQuiz: React.FC<ChampionshipQuizProps> = ({ userGrade, userSchool }) => {
    const [preguntaActual, setPreguntaActual] = React.useState<string>("");
    const [respuestaCorrecta, setRespuestaCorrecta] = React.useState<string>("");
    const [respuestaUsuario, setRespuestaUsuario] = React.useState<string>("");
    const [feedback, setFeedback] = React.useState<string>("");
    const [preguntasUsadas, setPreguntasUsadas] = React.useState<string[]>([]);
    const [timeLeft, setTimeLeft] = React.useState<number>(300); // 5 minutos
    const [bloqueado, setBloqueado] = React.useState<boolean>(false);
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

    React.useEffect(() => {
        if (!preguntaActual || bloqueado) return;
        if (timeLeft === 0) {
            setBloqueado(true);
            setFeedback("⏰ Tiempo agotado. No puedes responder esta pregunta. -3 likes");
            updateUserLikes(-3);
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, preguntaActual, bloqueado]);
    // Cargar preguntas de campeonato según el curso
    let preguntas: any[] = [];
    try {
        preguntas = require(`../questions/campeonato-${userGrade}primaria.json`);
    } catch {
        preguntas = [];
    }

    function generarPregunta() {
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

                // Resetear respuestas de sesión para próxima partida
                setSessionResponses([]);
            }
            return;
        }
        setTimeLeft(300);
        setBloqueado(false);
        const restantes = preguntas.filter((p: any) => !preguntasUsadas.includes(p.pregunta));
        if (restantes.length === 0) {
            setPreguntaActual("");
            setRespuestaCorrecta("");
            setFeedback("¡No hay más preguntas disponibles en el banco!");
            setBloqueado(true);
            return;
        }
        const random = Math.floor(Math.random() * restantes.length);
        setPreguntaActual(restantes[random].pregunta);
        setRespuestaCorrecta(restantes[random].respuesta);
        setRespuestaUsuario("");
        setFeedback("");
        setPreguntasUsadas([...preguntasUsadas, restantes[random].pregunta]);
    }

    function comprobarRespuesta() {
        // Normalizar para comparar respuestas
        function normalizar(str: string) {
            return str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "").trim();
        }
        if (bloqueado) return;
        const esCorrecta = normalizar(respuestaUsuario) === normalizar(respuestaCorrecta);
        setBloqueado(true);
        let likesDelta = 0;
        if (esCorrecta) {
            setFeedback("¡Correcto! 🎉");
            likesDelta = timeLeft > 120 ? 2 : 1;
        } else {
            setFeedback(`Incorrecto. La respuesta era: ${respuestaCorrecta}`);
            likesDelta = timeLeft > 120 ? -1 : -2;
        }

        // Actualizar likes
        updateUserLikes(likesDelta);

        // Guardar respuesta en el historial de sesión
        const respuesta = {
            pregunta: preguntaActual,
            respuestaUsuario,
            respuestaCorrecta,
            correcta: esCorrecta,
            tiempo: timeLeft,
            likes: likesDelta
        };
        setSessionResponses(prev => [...prev, respuesta]);
    }

    return (
        <div className="p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Modo Campeonato</h2>
            <p>Curso seleccionado: {userGrade}º Primaria</p>
            <p>Centro escolar: {userSchool || "No especificado"}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={generarPregunta}>
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
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={comprobarRespuesta} disabled={bloqueado}>
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
