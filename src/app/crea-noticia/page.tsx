"use client";
import React, { useState } from "react";

export default function CreaNoticia() {
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [enviando, setEnviando] = useState(false);

    const handleEnviar = async () => {
        setEnviando(true);
        // Obtener usuario actual
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            if (!data.user) {
                alert("No se ha detectado usuario. Inicia sesión.");
                setEnviando(false);
                return;
            }
            const autorNick = data.user.nick;

            await fetch('/api/noticias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo,
                    contenido,
                    autorNick
                })
            });

            alert("Noticia enviada!");
            setTitulo("");
            setContenido("");
        } catch (error) {
            console.error('Error creando noticia:', error);
            alert("Error enviando noticia");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Noticia</h1>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Título de la noticia"
                    className="w-full border rounded px-3 py-2 font-semibold text-lg mb-2"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                />
                <textarea
                    placeholder="Escribe la noticia aquí..."
                    className="w-full border rounded px-3 py-2 min-h-[120px] mb-2"
                    value={contenido}
                    onChange={e => setContenido(e.target.value)}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded self-end"
                    onClick={handleEnviar}
                    disabled={enviando}
                >Enviar</button>
            </div>
        </div>
    );
}
