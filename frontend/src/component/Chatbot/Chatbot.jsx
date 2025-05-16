import { Email, Send } from '@mui/icons-material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import ChatbotIcon from '../asset/ChatbotIcon.png'
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
            const res = await fetch('http://localhost:8000/chat', {
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
            <button className="btn respond rounded-pill small p-2 " onClick={() => setShowChat(!showChat)}> <img src={ChatbotIcon} alt="ChatBot" className='ms-5 img-fluid rounded-5' width={40} height={50} /> </button>
            {showChat ? (
                <>
                    <div className="position-fixed top-0 start-0 h-100 w-100 bg-dark opacity-50" onClick={() => setShowChat(false)}>
                    </div>
                    <div className="me-5 mb-3 position-fixed end-0 bottom-0 z-3">
                        <div className="card shadow-lg border-0 rounded-3" style={{ width: "420px", height: "500px" }}>
                            <div className='card-header bg-primary d-flex'>
                                <p className="fw-bold fs-5  text-white" >Chat với shop</p>
                                <button onClick={() => setShowChat(false)} className='btn btn-close ms-auto mt-2'></button>
                            </div>
                            <div className="flex-grow-1 mb-2" style={{ height: "300px", overflowY: "auto", backgroundColor: "#f7f7f7", padding: "10px", borderRadius: "10px" }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`} >
                                        {msg.sender === 'bot' && <img src={ChatbotIcon} alt="ChatBot" className='rounded-circle me-1' width={30} height={30} />}
                                        <div className={`px-3 py-2 rounded-4 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }} dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.text) }}>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="d-flex justify-content-start mb-2">
                                        <img src={ChatbotIcon} alt="ChatBot" className='rounded-circle me-1' width={30} height={30} />
                                        {/* Loading chat */}
                                        <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
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
                                            <style>
                                                {`
                                                @keyframes typingWave {
                                                    0%, 60%, 100% {
                                                        transform: translateY(0);
                                                        opacity: 0.7;
                                                    }
                                                    30% {
                                                        transform: translateY(-8px);
                                                        opacity: 1;
                                                    }
                                                }
                                                `}
                                            </style>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            {user ?
                                <div className="d-flex p-3">
                                    <textarea
                                        className="form-control"
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
                                    >
                                    </textarea>
                                    <button className="btn text-primary btn-sm" onClick={() => handleChat()} disabled={isLoading}><Send /></button>
                                </div>
                                : (
                                    <div className='p-3'>
                                        <button className='btn btn-primary w-100' onClick={() => { navigate('/login') }}>Vui lòng đăng nhập để tiếp tục</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </>
            ) : (
                <>
                </>
            )
            }
        </div >

    )
}

export default Chatbot