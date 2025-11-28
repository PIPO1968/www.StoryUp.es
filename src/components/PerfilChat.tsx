import React, { useState } from "react";
import { BUTTON_STYLES } from "../utils/styles";

const PerfilChat = () => {
    const [messages, setMessages] = useState<Array<{ user: string, text: string }>>([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { user: "Tú", text: input }]);
            setInput("");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow mt-8 w-full max-w-7xl mx-auto p-6 flex flex-col" style={{ minHeight: 320 }}>
            <h2 className="text-xl font-bold mb-4 text-center">Chat del Perfil</h2>
            <div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50" style={{ maxHeight: 220 }}>
                {messages.length === 0 ? (
                    <div className="text-gray-400 text-center">No hay mensajes aún.</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                            <span className="font-semibold text-blue-700">{msg.user}:</span> <span>{msg.text}</span>
                        </div>
                    ))
                )}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                    className={BUTTON_STYLES.primary}
                    onClick={handleSend}
                >Enviar</button>
            </div>
        </div>
    );
};

export default PerfilChat;
