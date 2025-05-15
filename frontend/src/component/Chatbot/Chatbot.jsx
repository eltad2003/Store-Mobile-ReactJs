import { Email, Send } from '@mui/icons-material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthProvider'

function Chatbot() {
    const { user } = useContext(AuthContext)
    const userId = user?.user.id
    const [showChat, setShowChat] = useState(false)
    const [content, setContent] = useState('')
    const [reply, setReply] = useState('')
    const [messages, setMessages] = useState([{
        sender: 'bot', text: 'Xin chào, bạn muốn giúp gì ?'
    }])
    const chatEndRef = useRef(null)

    const handleChat = async () => {
        if (!content.trim()) return;
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
        }
    }
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatBotMessage = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        // 1. Thay URL thành thẻ <a>
        const htmlWithLinks = text.replace(urlRegex, url => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
        // 2. Thay \n thành <br> để xuống dòng
        const htmlWithLineBreaks = htmlWithLinks.replace(/\n/g, "<br>");
        return htmlWithLineBreaks;
    }

    return (
        <div>
            <button className="btn respond rounded-pill p-2 bg-primary text-white" onClick={() => setShowChat(!showChat)}> <Email /></button>
            {showChat ? (
                <>
                    <div className="position-fixed top-0 start-0 h-100 w-100 bg-dark opacity-50 " onClick={() => setShowChat(false)}>
                    </div>
                    <div className=" p-5 position-fixed end-0 bottom-0 z-3 w-50 ">
                        <div className="card shadow mt-2 p-3">
                            <p className="fw-bold fs-5">Chat với shop</p>
                            <div className="flex-grow-1 mb-2" style={{ height: "300px", overflowY: "auto", backgroundColor: "#f7f7f7", padding: "10px", borderRadius: "10px" }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`} >
                                        <div className={`p-2 rounded-pill ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }} dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.text) }}>

                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="d-flex">
                                <textarea
                                    className="form-control mx-2"
                                    value={content}
                                    placeholder='Nhập tin nhắn'
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleChat();
                                        }
                                    }}
                                ></textarea>
                                <button className="btn text-primary btn-sm" onClick={() => handleChat()}><Send /></button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                </>
            )}
        </div>

    )
}

export default Chatbot