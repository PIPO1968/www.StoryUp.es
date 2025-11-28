"use client";
import React from "react";
import { renderNick } from "@/utils/renderNick";
import { CARD_STYLES } from "@/utils/styles";

export default function Noticias() {
    type Noticia = {
        titulo: string;
        autor: string;
        fecha: string;
        contenido: string;
    };

    const [noticias, setNoticias] = React.useState<Noticia[]>([]);
    React.useEffect(() => {
        fetch('/api/noticias')
            .then(response => response.json())
            .then(data => {
                console.log("Noticias cargadas desde API:", data);
                setNoticias(data);
            })
            .catch(error => {
                console.error("Error al cargar noticias desde API:", error);
            });
    }, []);
    const mostrarNoticias = noticias.length > 0
        ? noticias.map((noticia, idx) => {
            console.log(`Procesando noticia ${idx + 1}:`, noticia);
            return (
                <div key={idx} className={CARD_STYLES.default}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-blue-700">{noticia.titulo || 'Título no disponible'}</span>
                        {noticia.autor && (
                            <span className="ml-4">{renderNick(noticia.autor)}</span>
                        )}
                        {noticia.fecha && (
                            <span className="ml-4 text-gray-500 text-sm">{noticia.fecha}</span>
                        )}
                    </div>
                    <p className="text-gray-800">{noticia.contenido || 'Contenido no disponible'}</p>
                </div>
            );
        })
        : null; // No renderizar nada si no hay noticias

    return (
        <div className="min-h-screen bg-green-100 p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-center">Últimas Noticias</h1>
            </header>
            <main>
                <section className="container mx-auto">
                    <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
                        {mostrarNoticias}
                    </div>
                </section>
            </main>
        </div>
    );
}
