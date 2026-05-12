import React, { useState, useEffect, useRef } from "react";

export default function AiSidebar() {
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hi! Ask me anything." }
    ]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // ⚠️ Better practice: move this to .env later
    const API_KEY = "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";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!prompt.trim()) return;

        const currentPrompt = prompt;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: currentPrompt }
        ]);

        setPrompt("");
        setLoading(true);

        try {
            const res = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages: [
                            {
                                role: "system",
                                content: "You are a helpful AI assistant."
                            },
                            {
                                role: "user",
                                content: currentPrompt
                            }
                        ]
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.error?.message || "Request failed"
                );
            }

            const reply =
                data?.choices?.[0]?.message?.content ||
                "No response";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: reply }
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: `Error: ${err.message}`
                }
            ]);
        }

        setLoading(false);
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .ai-chat-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    background: #111;
                    color: #fff;
                    border: none;
                    border-radius: 50px;
                    padding: 14px 20px;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
                }

                .ai-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.45);
                    z-index: 999998;
                }

                .ai-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 400px;
                    max-width: 100%;
                    height: 100vh;
                    background: #fff;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(100%);
                    transition: transform 0.35s ease;
                    box-shadow: -5px 0 20px rgba(0,0,0,0.2);
                }

                .ai-sidebar.open {
                    transform: translateX(0);
                }

                .ai-header {
                    padding: 16px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 700;
                }

                .ai-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 12px;
                    background: #fafafa;
                }

                .msg-row {
                    margin-bottom: 12px;
                    display: flex;
                }

                .msg-row.user {
                    justify-content: flex-end;
                }

                .msg-row.assistant {
                    justify-content: flex-start;
                }

                .msg-box {
                    padding: 12px 14px;
                    border-radius: 16px;
                    max-width: 80%;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .msg-box.user {
                    background: #111;
                    color: #fff;
                }

                .msg-box.assistant {
                    background: #fff;
                    color: #000;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .ai-input-area {
                    padding: 12px;
                    border-top: 1px solid #eee;
                    background: #fff;
                }

                .ai-input {
                    width: 100%;
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    outline: none;
                }

                .ai-send-btn {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 12px;
                    background: #111;
                    color: #fff;
                    cursor: pointer;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .ai-sidebar {
                        width: 100vw;
                        height: 100dvh;
                    }

                    .ai-chat-btn {
                        bottom: 15px;
                        right: 15px;
                        padding: 12px 16px;
                        font-size: 13px;
                    }
                }
            `}</style>

            {!open && (
                <button
                    className="ai-chat-btn"
                    onClick={() => setOpen(true)}
                >
                    AI Chat
                </button>
            )}

            {open && (
                <div
                    className="ai-overlay"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className={`ai-sidebar ${open ? "open" : ""}`}>
                <div className="ai-header">
                    <span>AI Assistant</span>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "24px",
                            cursor: "pointer"
                        }}
                    >
                        ×
                    </button>
                </div>

                <div className="ai-messages">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`msg-row ${msg.role}`}
                        >
                            <div
                                className={`msg-box ${msg.role}`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && <p>Thinking...</p>}
                    <div ref={messagesEndRef}></div>
                </div>

                <div className="ai-input-area">
                    <input
                        type="text"
                        className="ai-input"
                        value={prompt}
                        onChange={(e) =>
                            setPrompt(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            sendMessage()
                        }
                        placeholder="Type your message..."
                    />

                    <button
                        className="ai-send-btn"
                        onClick={sendMessage}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </>
    );
}
