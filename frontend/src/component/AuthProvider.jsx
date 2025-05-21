import { DataArray } from '@mui/icons-material';
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlBE } from '../baseUrl';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('user'))
        return storage ?? null
    });

    const login = async (email, password) => {
        try {
            const res = await fetch(`${urlBE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (res.ok) {
                const data = await res.json();

                if (!data?.user?.isVerified) {
                    return { success: false, message: 'Tài khoản chưa xác minh', user: data.user };
                }

                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true, user: data.user };
            } else {
                const errorText = await res.text();
                return { success: false, message: errorText };
            }
        } catch (error) {
            console.log("Đăng nhập thất bại", error);
            return { success: false, message: 'Đăng nhập thất bại' };
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('order');
        alert('Đăng xuất thành công')



    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
