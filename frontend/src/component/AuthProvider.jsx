import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('user'))
        return storage ?? null
    });

    const login = async (username, password) => {
        try {
            // const res = await fetch('https://fakestoreapi.in/api/users', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         username,
            //         password
            //     })
            // });
            const res = await fetch('https://fakestoreapi.in/api/users');
            const data = await res.json();
            const existUser = data.users.find(user =>
                user.username === username && user.password === password
            );
            if (existUser) {
                setUser(existUser);
                localStorage.setItem('user', JSON.stringify(existUser));
                alert('Đăng nhập thành công');

            } else {
                alert('Sai tài khoản hoặc mật khẩu');
            }
        } catch (error) {
            console.log("Đăng nhập thất bại", error);
            alert('Đăng nhập thất bại')
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
