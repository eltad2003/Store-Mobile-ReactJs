import { Email, Send } from '@mui/icons-material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import ChatbotIcon from '../asset/ChatbotIcon.png'
import { urlChat } from "../../baseUrl";
import './Chatbot.css'
function Chatbot() {
    const { user } = useContext(AuthContext)
    const userId = user?.user.id
    const [showChat, setShowChat] = useState(false)
    const [content, setContent] = useState('')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [messages, setMessages] = useState([{
        sender: 'bot', text: 'Xin chào, bạn muốn giúp gì ?'
    }])
    const chatEndRef = useRef(null)

    const handleChat = async () => {
        if (!content.trim()) return;
        setIsLoading(true)
        const userMessage = { sender: 'user', text: content }

        setMessages(prev => [...prev, userMessage])
        setContent('')
        try {
            const res = await fetch(`${urlChat}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    message: content
                })
            })
            if (res.ok) {
                const data = await res.json()
                const botMessage = { sender: 'bot', text: data.reply }
                setMessages(prev => [...prev, botMessage])
            }
        } catch (error) {
            alert("Lỗi Server: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatBotMessage = (text) => {
        const urlRegex = /https?:\/\/[^\s)]+/g;
        const htmlWithLinks = text.replace(urlRegex, url => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">Tại đây</a>`;
        });
        const htmlWithLineBreaks = htmlWithLinks.replace(/\n/g, "<br>");
        return htmlWithLineBreaks;
    }

    return (
        <div>
            {/* Chatbot trigger button */}
            <button
                className="btn chatbot rounded-pill small p-2 position-fixed"
                style={{
                    bottom: '55px',
                    right: '5px',
                    zIndex: 999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onClick={() => setShowChat(!showChat)}
            >
                <img
                    src={ChatbotIcon}
                    alt="ChatBot"
                    className='img-fluid rounded-5'
                    width={40}
                    height={50}
                />
            </button>

            {showChat && (
                <>
                    {/* Backdrop */}
                    <div
                        className="position-fixed top-0 start-0 h-100 w-100 bg-dark opacity-50"
                        style={{ zIndex: 1000 }}
                        onClick={() => setShowChat(false)}
                    />

                    {/* Chat window */}
                    <div
                        className="position-fixed end-0 bottom-0 p-3"
                        style={{ zIndex: 1001 }}
                    >
                        <div
                            className="card shadow-lg border-0 rounded-3"
                            style={{
                                width: 'min(420px, calc(100vw - 2rem))',
                                height: 'min(500px, calc(100vh - 2rem))',
                                maxWidth: '100%'
                            }}
                        >
                            {/* Header */}
                            <div className='card-header bg d-flex align-items-center'>
                                <p className="fw-bold fs-5 text-white m-0">Chat với shop</p>
                                <button
                                    onClick={() => setShowChat(false)}
                                    className='btn btn-close btn-close-white ms-auto'
                                    aria-label="Close chat"
                                />
                            </div>

                            {/* Messages container */}
                            <div
                                className="flex-grow-1 p-2 p-md-3"
                                style={{
                                    overflowY: "auto",
                                    backgroundColor: "#f7f7f7",
                                    minHeight: '200px'
                                }}
                            >
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                                    >
                                        {msg.sender === 'bot' && (
                                            <img
                                                src={ChatbotIcon}
                                                alt="ChatBot"
                                                className='rounded-circle me-2 flex-shrink-0'
                                                width={30}
                                                height={30}
                                            />
                                        )}
                                        <div
                                            className={`px-2 px-md-3 py-2 rounded-4 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                            style={{
                                                maxWidth: msg.sender === 'bot' ? 'calc(100% - 40px)' : '85%',
                                                wordWrap: 'break-word',
                                                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.text) }}
                                        />
                                    </div>
                                ))}

                                {/* Loading indicator */}
                                {isLoading && (
                                    <div className="d-flex justify-content-start mb-2">
                                        <img
                                            src={ChatbotIcon}
                                            alt="ChatBot"
                                            className='rounded-circle me-2 flex-shrink-0'
                                            width={30}
                                            height={30}
                                        />
                                        <div
                                            className="bg-light rounded-4 px-3 py-2"
                                            style={{ display: 'flex', alignItems: 'center', minHeight: '36px' }}
                                        >
                                            <span className="typing-dot" style={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                margin: '0 2px',
                                                borderRadius: '50%',
                                                background: '#bbb',
                                                animation: 'typingWave 1.2s infinite'
                                            }} />
                                            <span className="typing-dot" style={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                margin: '0 2px',
                                                borderRadius: '50%',
                                                background: '#bbb',
                                                animation: 'typingWave 1.2s 0.2s infinite'
                                            }} />
                                            <span className="typing-dot" style={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                margin: '0 2px',
                                                borderRadius: '50%',
                                                background: '#bbb',
                                                animation: 'typingWave 1.2s 0.4s infinite'
                                            }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input area */}
                            {user ? (
                                <div className="d-flex p-2 p-md-3 gap-2 border-top">
                                    <textarea
                                        className="form-control flex-grow-1"
                                        style={{
                                            resize: 'none',
                                            minHeight: '38px',
                                            maxHeight: '100px',
                                            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                                        }}
                                        rows="1"
                                        value={content}
                                        placeholder='Nhập tin nhắn'
                                        onChange={(e) => setContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleChat();
                                            }
                                        }}
                                        disabled={isLoading}
                                    />
                                    <button
                                        className="btn text-primary btn-sm flex-shrink-0"
                                        onClick={handleChat}
                                        disabled={isLoading || !content.trim()}
                                        style={{ minWidth: '40px' }}
                                    >
                                        <Send fontSize="small" />
                                    </button>
                                </div>
                            ) : (
                                <div className='p-2 p-md-3 border-top'>
                                    <button
                                        className='btn btn-primary w-100'
                                        onClick={() => navigate('/login')}
                                        style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
                                    >
                                        Vui lòng đăng nhập để tiếp tục
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                </>
            )}
        </div>
    )
}

export default Chatbot