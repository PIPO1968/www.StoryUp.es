import { useState, useEffect } from 'react';

interface UseQuizLogicOptions {
    timeLimit?: number;
    onTimeUp?: () => void;
    onCorrectAnswer?: (points: number) => void;
    onWrongAnswer?: (penalty: number) => void;
}

interface UseQuizLogicReturn {
    preguntaActual: string;
    setPreguntaActual: (pregunta: string) => void;
    objetoPreguntaActual: any;
    setObjetoPreguntaActual: (objeto: any) => void;
    respuestaCorrecta: string;
    setRespuestaCorrecta: (respuesta: string) => void;
    respuestaUsuario: string;
    setRespuestaUsuario: (respuesta: string) => void;
    feedback: string;
    setFeedback: (feedback: string) => void;
    preguntasUsadas: string[];
    setPreguntasUsadas: (preguntas: string[]) => void;
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    bloqueado: boolean;
    setBloqueado: (bloqueado: boolean) => void;
    aciertos: number;
    setAciertos: (aciertos: number) => void;
    puntuacionTotal: number;
    setPuntuacionTotal: (puntuacion: number) => void;
    preguntaNumero: number;
    setPreguntaNumero: (numero: number) => void;
    comprobarRespuesta: (customLogic?: (esCorrecta: boolean) => void) => void;
    generarPregunta: (preguntas: any[], maxPreguntas?: number, onComplete?: () => void) => void;
    resetQuiz: () => void;
}

export function useQuizLogic(options: UseQuizLogicOptions = {}): UseQuizLogicReturn {
    const {
        timeLimit = 300,
        onTimeUp,
        onCorrectAnswer,
        onWrongAnswer
    } = options;

    // Estados comunes
    const [preguntaActual, setPreguntaActual] = useState<string>("");
    const [objetoPreguntaActual, setObjetoPreguntaActual] = useState<any>(null);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState<string>("");
    const [respuestaUsuario, setRespuestaUsuario] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [preguntasUsadas, setPreguntasUsadas] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [bloqueado, setBloqueado] = useState<boolean>(false);
    const [aciertos, setAciertos] = useState<number>(0);
    const [puntuacionTotal, setPuntuacionTotal] = useState<number>(0);
    const [preguntaNumero, setPreguntaNumero] = useState<number>(1);

    // Temporizador
    useEffect(() => {
        if (!preguntaActual || bloqueado) return;
        if (timeLeft === 0) {
            setBloqueado(true);
            setPuntuacionTotal(puntuacionTotal - 15);
            setFeedback("⏰ Tiempo agotado. -15 puntos");
            onTimeUp?.();
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, preguntaActual, bloqueado, puntuacionTotal, onTimeUp]);

    // Función para normalizar respuestas
    function normalizar(str: string) {
        return str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "").trim();
    }

    // Función para comprobar respuesta
    const comprobarRespuesta = (customLogic?: (esCorrecta: boolean) => void) => {
        if (bloqueado) return;

        const esCorrecta = normalizar(respuestaUsuario) === normalizar(respuestaCorrecta);
        setBloqueado(true);

        if (esCorrecta) {
            let points = 1;
            if (timeLeft > 120) {
                points = 1;
            } else {
                points = 0.5;
            }
            setFeedback(`¡Correcto! 🎉 +${points} punto${points !== 1 ? 's' : ''}`);
            setAciertos(aciertos + 1);
            setPuntuacionTotal(puntuacionTotal + points);
            onCorrectAnswer?.(points);
        } else {
            let penalty = -0.5;
            if (timeLeft <= 120) {
                penalty = -1;
            }
            setFeedback(`Incorrecto. La respuesta era: ${respuestaCorrecta} ${penalty} punto${Math.abs(penalty) !== 1 ? 's' : ''}`);
            setPuntuacionTotal(puntuacionTotal + penalty);
            onWrongAnswer?.(penalty);
        }

        customLogic?.(esCorrecta);
    };

    // Función para generar pregunta
    const generarPregunta = (preguntas: any[], maxPreguntas: number = 25, onComplete?: () => void) => {
        if (preguntasUsadas.length >= maxPreguntas) {
            onComplete?.();
            return;
        }

        if (preguntas.length === 0) {
            setPreguntaActual("");
            setObjetoPreguntaActual(null);
            setRespuestaCorrecta("");
            setFeedback("No hay preguntas disponibles.");
            setBloqueado(false);
            setTimeLeft(timeLimit);
            setPreguntasUsadas([]);
            return;
        }

        // Filtrar preguntas no usadas
        const restantes = preguntas.filter((p: any) => !preguntasUsadas.includes(p.pregunta));
        if (restantes.length === 0) {
            setPreguntaActual("");
            setObjetoPreguntaActual(null);
            setRespuestaCorrecta("");
            setFeedback("¡Has respondido todas las preguntas disponibles!");
            setBloqueado(true);
            setTimeLeft(timeLimit);
            setPreguntasUsadas([]);
            return;
        }

        const random = Math.floor(Math.random() * restantes.length);
        const preguntaSeleccionada = restantes[random];
        setPreguntaActual(preguntaSeleccionada.pregunta);
        setObjetoPreguntaActual(preguntaSeleccionada);
        setRespuestaCorrecta(preguntaSeleccionada.respuesta);
        setRespuestaUsuario("");
        setFeedback("");
        setBloqueado(false);
        setTimeLeft(timeLimit);
        setPreguntasUsadas([...preguntasUsadas, preguntaSeleccionada.pregunta]);
        setPreguntaNumero(preguntaNumero + 1);
    };

    // Función para resetear el quiz
    const resetQuiz = () => {
        setPreguntaActual("");
        setObjetoPreguntaActual(null);
        setRespuestaCorrecta("");
        setRespuestaUsuario("");
        setFeedback("");
        setPreguntasUsadas([]);
        setTimeLeft(timeLimit);
        setBloqueado(false);
        setAciertos(0);
        setPuntuacionTotal(0);
        setPreguntaNumero(1);
    };

    return {
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
    };
}