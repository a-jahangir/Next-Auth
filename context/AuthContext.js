'use client'

import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoding] = useState(false);

    const router = useRouter();

    const handleError = (message) => {
        const errors = [];
        Object.keys(message).map((key) => {
            message[key].map((e) => {
                errors.push(e)
            })
        })
        return errors.join();
    }

    // Register user
    const register = async (user) => {
        setLoding(true);
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password,
                c_password: user.confirmPassword
            })
        });
        const data = await res.json();

        if (res.ok) {
            setLoding(false);
            router.push('/');
        } else {
            setError(handleError(data.message))
            setError(null)
            setLoding(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, error, loading, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext