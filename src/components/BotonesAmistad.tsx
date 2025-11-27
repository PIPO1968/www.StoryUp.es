import React, { useEffect, useState } from "react";

interface BotonesAmistadProps {
    perfilNick: string;
}

const BotonesAmistad: React.FC<BotonesAmistadProps> = ({ perfilNick }) => {
    const [user, setUser] = useState<any>(null);
    const [esAmigo, setEsAmigo] = useState(false);

    useEffect(() => {
        // Get current user
        fetch('/api/auth/me')
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!user || !perfilNick || perfilNick === user.nick) return;

        // Check if friend
        fetch(`/api/friends?action=friends&nick=${user.nick}`)
            .then(response => response.json())
            .then(data => {
                setEsAmigo(data.friends.some((f: any) => f.nick === perfilNick));
            })
            .catch(() => { });
    }, [user, perfilNick]);

    const handleSolicitar = async () => {
        if (!user || !perfilNick || perfilNick === user.nick) return;

        try {
            const response = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add', userNick: user.nick, friendNick: perfilNick })
            });
            if (response.ok) {
                setEsAmigo(true);
                alert(`Solicitud enviada a ${perfilNick}`);
            } else {
                alert('Error al enviar solicitud');
            }
        } catch (error) {
            alert('Error al enviar solicitud');
        }
    };

    const handleFinalizar = async () => {
        if (!user || !perfilNick) return;

        try {
            const response = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove', userNick: user.nick, friendNick: perfilNick })
            });
            if (response.ok) {
                setEsAmigo(false);
                alert(`Amistad finalizada con ${perfilNick}`);
            } else {
                alert('Error al finalizar amistad');
            }
        } catch (error) {
            alert('Error al finalizar amistad');
        }
    };

    if (!user || perfilNick === user.nick) return null;

    if (esAmigo) {
        return (
            <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl text-base shadow mb-2 animate-pulse"
                onClick={handleFinalizar}
            >
                Finalizar amistad
            </button>
        );
    }

    return (
        <button
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-xl text-base shadow mb-2 animate-bounce"
            onClick={handleSolicitar}
        >
            Solicitar Amistad
        </button>
    );
};

export default BotonesAmistad;
