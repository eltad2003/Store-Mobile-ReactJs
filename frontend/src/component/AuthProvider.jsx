import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('user'))
        return storage ?? null
    });

    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                alert('Đăng nhập thành công')
            } else {
                alert(await res.text());
            }
        } catch (error) {
            console.log("Đăng nhập thất bại", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        alert('Đăng xuất thành công')



    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
